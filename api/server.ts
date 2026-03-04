// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "../server/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { products } from "../shared/schema";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://ippax.com.br", "https://www.ippax.com.br"]
    : ["http://localhost:7173", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "http://localhost:5179", "http://localhost:5180", "http://localhost:5181", "http://localhost:5182", "http://localhost:5183", "http://localhost:5184", "http://localhost:5185", "http://localhost:5186", "http://localhost:5187", "http://localhost:5188", "http://localhost:5189", "http://localhost:5190"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mock auth routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Authentication should be handled by proper backend with bcrypt
  // This is a placeholder endpoint
  if (!process.env.SESSION_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: "Server not properly configured. SESSION_SECRET is required." 
    });
  }
  
  // TODO: Implement proper authentication with database
  res.status(401).json({ 
    success: false, 
    message: "Authentication service not implemented. Configure proper backend." 
  });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Token não fornecido" });
  }
  
  if (!process.env.SESSION_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: "Server not properly configured. SESSION_SECRET is required." 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET) as any;
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
});

// Products routes
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar produtos" });
  }
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await db.select().from(products).limit(1);
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: "ok",
      database: "disconnected",
      timestamp: new Date().toISOString()
    });
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

// For Vercel serverless functions, export the app
export default app;