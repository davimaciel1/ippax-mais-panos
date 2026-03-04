// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { testConnection, initializeDatabase } from "./db-sqlite";
import { hashPassword, registerUser } from "./auth-sqlite";

// Import routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products-sqlite";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";
import pixelsRoutes from "./routes/pixels";

// Import middleware
import { trackingMiddleware, marketplaceTrackingMiddleware } from "./middleware/tracking";
import { 
  applySecurityMiddleware, 
  authRateLimiter, 
  apiRateLimiter,
  doubleCsrfProtection,
  generateToken
} from "./middleware/security";

const app = express();
const PORT = process.env.PORT || 5000;

// Define paths
const distPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, "..", "public")  // In production, dist/server/../public = dist/public
  : path.join(__dirname, "..", "dist", "public");
console.log("📁 Serving static files from:", distPath);

// Enable compression for responses (gzip/br)
app.use(compression({ threshold: 1024 }));

// IMPORTANT: Define affiliate redirect routes BEFORE static files
// These routes must be handled before express.static to prevent conflicts
app.get("/go/amazon", (req, res) => {
  const possiblePaths = [
    path.join(__dirname, "..", "public", "go", "amazon.html"),
    path.join(__dirname, "..", "dist", "public", "go", "amazon.html"),
    path.join(distPath, "go", "amazon.html")
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log("✅ Serving amazon.html from:", filePath);
      return res.sendFile(filePath);
    }
  }
  
  console.error("❌ amazon.html not found in any location");
  res.status(404).send("Página não encontrada");
});

app.get("/go/shopee", (req, res) => {
  const possiblePaths = [
    path.join(__dirname, "..", "public", "go", "shopee.html"),
    path.join(__dirname, "..", "dist", "public", "go", "shopee.html"),
    path.join(distPath, "go", "shopee.html")
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log("✅ Serving shopee.html from:", filePath);
      return res.sendFile(filePath);
    }
  }
  
  console.error("❌ shopee.html not found in any location");
  res.status(404).send("Página não encontrada");
});

app.get("/go/ml", (req, res) => {
  const possiblePaths = [
    path.join(__dirname, "..", "public", "go", "ml.html"),
    path.join(__dirname, "..", "dist", "public", "go", "ml.html"),
    path.join(distPath, "go", "ml.html")
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log("✅ Serving ml.html from:", filePath);
      return res.sendFile(filePath);
    }
  }
  
  console.error("❌ ml.html not found in any location");
  res.status(404).send("Página não encontrada");
});

app.get("/go/mercadolivre", (req, res) => {
  res.redirect("/go/ml");
});

// Serve optimized image formats (AVIF/WebP) when available and supported
app.get(/^\/assets\/(.+)\.(png|jpe?g)$/i, (req, res, next) => {
  try {
    const accept = req.headers['accept'] || '';
    const rel = (req.params as any)[0] as string; // filename without extension
    const originalExt = (req.params as any)[1] as string;
    const baseFull = path.join(distPath, 'assets', rel);

    // Choose best format based on Accept header
    if (/image\/avif/.test(accept) && fs.existsSync(baseFull + '.avif')) {
      res.setHeader('Content-Type', 'image/avif');
      return res.sendFile(baseFull + '.avif');
    }
    if (/image\/webp/.test(accept) && fs.existsSync(baseFull + '.webp')) {
      res.setHeader('Content-Type', 'image/webp');
      return res.sendFile(baseFull + '.webp');
    }

    return next();
  } catch (e) {
    return next();
  }
});

// NOW serve static files after redirect routes
app.use(express.static(distPath, {
  etag: true,
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  immutable: process.env.NODE_ENV === 'production',
  setHeaders: (res, filePath) => {
    // For hashed assets under /assets or files with -[hash]. in name: long cache
    const rel = filePath.replace(path.join(distPath, path.sep), '').replace(/\\/g, '/');
    const isAsset = rel.startsWith('assets/') || /\.[a-f0-9]{8,}\./i.test(rel);
    if (isAsset) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (rel === 'index.html') {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https:", "data:"],
      scriptSrc: process.env.NODE_ENV === 'production'
        ? [
            "'self'",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://connect.facebook.net",
            "https://ads.uol.com.br",
          ]
        : [
            "'self'",
            "'unsafe-eval'", // Needed for Vite dev / source maps
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://connect.facebook.net",
            "https://ads.uol.com.br",
          ],
      connectSrc: process.env.NODE_ENV === 'production'
        ? [
            "'self'",
            "https:",
          ]
        : [
            "'self'",
            "https:",
            "http:",
            "wss:",
            "ws:",
          ],
      frameSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        // Allow YouTube embeds
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
      ],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use("/api/", apiRateLimiter);

// Apply stricter rate limiting for auth endpoints
app.use("/api/auth/login", authRateLimiter);
app.use("/api/auth/register", authRateLimiter);
app.use("/api/auth/forgot-password", authRateLimiter);

// Middleware
// CORS configuration
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://ippax.com.br", "https://www.ippax.com.br"]
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]; // Reduced to 3 ports

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add cookie parser for session management
app.use(cookieParser());

// Apply comprehensive security middleware
app.use(applySecurityMiddleware);

// Add tracking middleware for all requests
app.use(trackingMiddleware);

// Add marketplace tracking middleware for specific routes
app.use('/marketplace', marketplaceTrackingMiddleware);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pixels", pixelsRoutes);

// Removed duplicate /go/:slug route - specific routes are now defined above

// Legacy redirects - redirect to tracking HTML pages
app.get("/do/amazon", (req, res) => {
  res.redirect("/go/amazon.html");
});

app.get("/do/shopee", (req, res) => {
  res.redirect("/go/shopee.html");
});

app.get("/do/mercadolivre", (req, res) => {
  res.redirect("/go/ml.html");
});

app.get("/do/ml", (req, res) => {
  res.redirect("/go/ml.html");
});

// Routes duplicadas removidas - agora estão antes dos arquivos estáticos

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/health", async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: "ok",
    database: dbStatus ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});


// Serve index.html for all non-API routes (SPA support)
app.get("*", (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith("/api")) {
    return next();
  }
  
  // Skip affiliate redirect routes - they should be handled by specific routes above
  if (req.path.startsWith("/go/") || req.path.startsWith("/do/")) {
    return next();
  }
  
  const indexPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, "..", "public", "index.html")  // In production: dist/server/../public/index.html = dist/public/index.html
    : path.join(__dirname, "..", "dist", "public", "index.html");
  
  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    // Avoid caching HTML to ensure fresh deployments are picked up
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(indexPath);
  } else {
    console.warn("⚠️ index.html not found at:", indexPath);
    res.status(404).json({ success: false, message: "Endpoint não encontrado" });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint não encontrado"
  });
});

// Initialize server
async function startServer() {
  try {
    // Initialize SQLite database with tables and default data
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error("❌ Cannot start server without database initialization");
      process.exit(1);
    }

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("❌ Cannot start server without database connection");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: http://localhost:${PORT}`);
      console.log(`🔧 API URL: http://localhost:${PORT}/api`);
      console.log(`💾 Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();