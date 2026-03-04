import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas (jpeg, jpg, png, webp, avif)"));
    }
  },
});

// Ensure upload directories exist
async function ensureUploadDirs() {
  const dirs = [
    "public/uploads",
    "public/uploads/products",
    "public/uploads/products/thumbs",
    "public/uploads/products/webp",
  ];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
}

// Initialize directories on startup
ensureUploadDirs();

// Upload single product image
router.post("/product-image", authenticateToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    const timestamp = Date.now();
    const originalName = path.parse(req.file.originalname).name;
    const baseFileName = `${originalName}_${timestamp}`;

    // Process image with Sharp
    const originalPath = `public/uploads/products/${baseFileName}.jpg`;
    const thumbPath = `public/uploads/products/thumbs/${baseFileName}_thumb.jpg`;
    const webpPath = `public/uploads/products/webp/${baseFileName}.webp`;

    // Save original (compressed)
    await sharp(req.file.buffer)
      .jpeg({ quality: 85, progressive: true })
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .toFile(originalPath);

    // Generate thumbnail
    await sharp(req.file.buffer)
      .jpeg({ quality: 80 })
      .resize(300, 300, { fit: "cover" })
      .toFile(thumbPath);

    // Generate WebP version
    await sharp(req.file.buffer)
      .webp({ quality: 85 })
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .toFile(webpPath);

    // Return file paths
    res.json({
      success: true,
      data: {
        original: `/uploads/products/${baseFileName}.jpg`,
        thumbnail: `/uploads/products/thumbs/${baseFileName}_thumb.jpg`,
        webp: `/uploads/products/webp/${baseFileName}.webp`,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Erro no upload da imagem" });
  }
});

// Upload multiple product images
router.post("/product-images", authenticateToken, requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    const files = req.files as Express.Multer.File[];
    const results = [];

    for (const file of files) {
      const timestamp = Date.now();
      const originalName = path.parse(file.originalname).name;
      const baseFileName = `${originalName}_${timestamp}`;

      // Process each image
      const originalPath = `public/uploads/products/${baseFileName}.jpg`;
      const thumbPath = `public/uploads/products/thumbs/${baseFileName}_thumb.jpg`;
      const webpPath = `public/uploads/products/webp/${baseFileName}.webp`;

      await sharp(file.buffer)
        .jpeg({ quality: 85, progressive: true })
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .toFile(originalPath);

      await sharp(file.buffer)
        .jpeg({ quality: 80 })
        .resize(300, 300, { fit: "cover" })
        .toFile(thumbPath);

      await sharp(file.buffer)
        .webp({ quality: 85 })
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .toFile(webpPath);

      results.push({
        original: `/uploads/products/${baseFileName}.jpg`,
        thumbnail: `/uploads/products/thumbs/${baseFileName}_thumb.jpg`,
        webp: `/uploads/products/webp/${baseFileName}.webp`,
        originalName: file.originalname,
        size: file.size,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({ error: "Erro no upload das imagens" });
  }
});

// Delete image
router.delete("/image", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ error: "Caminho da imagem necessário" });
    }

    // Remove leading slash and construct full path
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const fullPath = path.join("public", cleanPath);

    // Also remove related files (thumbnail, webp)
    const pathParts = path.parse(fullPath);
    const baseName = pathParts.name.replace("_thumb", "");
    
    const filesToDelete = [
      fullPath,
      `public/uploads/products/thumbs/${baseName}_thumb.jpg`,
      `public/uploads/products/webp/${baseName}.webp`,
    ];

    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // File might not exist, ignore error
      }
    }

    res.json({ success: true, message: "Imagem removida com sucesso" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Erro ao remover imagem" });
  }
});

export default router;