import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db-sqlite";
import { products } from "../../shared/schema-sqlite";
import { authenticateToken, requireAdmin, optionalAuth } from "../middleware/auth";
import { eq, desc, like, sql, count } from "drizzle-orm";

const router = Router();

// Validation schema for Google Shopping compliant products
const productSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  shortDescription: z.string().optional(),
  
  // Pricing
  price: z.string().min(1, "Preço é obrigatório"),
  salePrice: z.string().optional(),
  salePriceStartDate: z.string().optional(),
  salePriceEndDate: z.string().optional(),
  
  // Google Shopping Required Fields
  gtin: z.string().min(8, "GTIN deve ter pelo menos 8 dígitos"),
  mpn: z.string().optional(),
  brand: z.string().default("IPPAX"),
  condition: z.enum(["new", "refurbished", "used"]).default("new"),
  availability: z.enum(["in stock", "out of stock", "preorder"]).default("in stock"),
  
  // Categories
  category: z.string().min(1, "Categoria é obrigatória"),
  subcategory: z.string().optional(),
  googleCategory: z.string().optional(),
  productType: z.string().optional(),
  
  // Physical Properties
  material: z.string().default("PVC"),
  color: z.string().optional(),
  weight: z.string().optional(),
  shippingLength: z.number().optional(),
  shippingWidth: z.number().optional(),
  shippingHeight: z.number().optional(),
  shippingWeight: z.number().optional(),
  
  // Stock & Inventory
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  unit: z.string().default("m²"),
  
  // Additional attributes
  itemGroupId: z.string().optional(),
  customLabel0: z.string().optional(),
  customLabel1: z.string().optional(),
  customLabel2: z.string().optional(),
  customLabel3: z.string().optional(),
  customLabel4: z.string().optional(),
  
  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  urlSlug: z.string().optional(),
  
  // Features
  highlights: z.array(z.string()).optional(),
  technicalSpecs: z.record(z.string()).optional(),
  
  // Status
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
});

// GET /api/products - List products
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const featured = req.query.featured === "true";
    const offset = (page - 1) * limit;

    // Build base query
    let whereConditions = eq(products.isActive, true);

    // Apply filters
    if (search) {
      whereConditions = sql`${whereConditions} AND (${products.name} LIKE ${`%${search}%`} OR ${products.description} LIKE ${`%${search}%`})`;
    }

    if (category) {
      whereConditions = sql`${whereConditions} AND ${products.category} = ${category}`;
    }

    if (featured) {
      whereConditions = sql`${whereConditions} AND ${products.isFeatured} = ${true}`;
    }

    // Get products
    const productsList = await db
      .select()
      .from(products)
      .where(whereConditions)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(eq(products.isActive, true));

    res.json({
      success: true,
      data: productsList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos"
    });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado"
      });
    }

    res.json({
      success: true,
      data: {
        ...product,
        images: [] // No image support yet
      }
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produto"
    });
  }
});

// POST /api/products - Create product (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const productData = productSchema.parse(req.body);
    
    // Generate URL slug if not provided
    if (!productData.urlSlug) {
      productData.urlSlug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        ...productData,
        highlights: productData.highlights ? JSON.stringify(productData.highlights) : null,
        technicalSpecs: productData.technicalSpecs ? JSON.stringify(productData.technicalSpecs) : null,
        updatedAt: "CURRENT_TIMESTAMP"
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Produto criado com sucesso"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    } else {
      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao criar produto"
      });
    }
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const productData = productSchema.partial().parse(req.body);

    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado"
      });
    }

    // Update product
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...productData,
        highlights: productData.highlights ? JSON.stringify(productData.highlights) : undefined,
        technicalSpecs: productData.technicalSpecs ? JSON.stringify(productData.technicalSpecs) : undefined,
        updatedAt: "CURRENT_TIMESTAMP"
      })
      .where(eq(products.id, id))
      .returning();

    res.json({
      success: true,
      data: updatedProduct,
      message: "Produto atualizado com sucesso"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    } else {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar produto"
      });
    }
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado"
      });
    }

    // Soft delete - just mark as inactive
    await db
      .update(products)
      .set({ 
        isActive: false,
        updatedAt: "CURRENT_TIMESTAMP"
      })
      .where(eq(products.id, id));

    res.json({
      success: true,
      message: "Produto removido com sucesso"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover produto"
    });
  }
});

// GET /api/products/:id/google-shopping - Get Google Shopping compliance score
router.get("/:id/google-shopping", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado"
      });
    }

    // Calculate Google Shopping compliance score
    const requiredFields = [
      "gtin", "name", "description", "price", "availability", 
      "condition", "googleCategory", "brand"
    ];
    
    const presentFields = requiredFields.filter(field => 
      product[field as keyof typeof product]
    );
    
    const score = Math.round((presentFields.length / requiredFields.length) * 100);

    res.json({
      success: true,
      data: {
        product,
        googleShoppingScore: score,
        missingFields: requiredFields.filter(field => 
          !product[field as keyof typeof product]
        )
      }
    });
  } catch (error) {
    console.error("Google Shopping validation error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao validar produto para Google Shopping"
    });
  }
});

export default router;