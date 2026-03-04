import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db-sqlite";
import { marketplaceClicks, analyticsDaily, products } from "../../shared/schema-sqlite";
import { eq, and, gte, lte, desc, sql, count, countDistinct } from "drizzle-orm";
import { validateMarketplace, sanitizeString } from "../utils/analytics";
import { authenticateToken } from "../middleware/auth";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiting for analytics endpoints
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: { error: "Muitas requisições de analytics. Tente novamente em 1 minuto." },
});

const clickLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 click tracking requests per minute
  message: { error: "Muitas requisições de tracking. Tente novamente em 1 minuto." },
});

// Validation schemas
const ClickTrackingSchema = z.object({
  marketplace: z.string().min(1).max(50),
  productId: z.number().optional(),
  productName: z.string().min(1).max(255),
  redirectUrl: z.string().url().optional(),
  userId: z.string().max(100).optional(),
  ipAddress: z.string().max(45).optional(),
  userAgent: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
  country: z.string().max(10).optional(),
  city: z.string().max(100).optional(),
  device: z.enum(["mobile", "desktop", "tablet"]).optional(),
  browser: z.string().max(50).optional(),
  os: z.string().max(50).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
});

const DashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  marketplace: z.string().optional(),
  productId: z.string().optional(),
  device: z.enum(["mobile", "desktop", "tablet"]).optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

/**
 * POST /api/analytics/click
 * Track marketplace clicks
 */
router.post("/click", clickLimiter, async (req: Request, res: Response) => {
  try {
    const validatedData = ClickTrackingSchema.parse(req.body);
    
    // Validate marketplace
    if (!validateMarketplace(validatedData.marketplace)) {
      return res.status(400).json({
        success: false,
        message: "Marketplace inválido"
      });
    }
    
    // Get tracking data from middleware if available
    const trackingData = (req as any).trackingData || {};
    
    // Merge request data with tracking middleware data
    const clickData = {
      marketplace: validatedData.marketplace.toLowerCase(),
      productId: validatedData.productId,
      productName: sanitizeString(validatedData.productName, 255)!,
      userId: validatedData.userId || trackingData.userId,
      ipAddress: validatedData.ipAddress || trackingData.ipAddress || 'unknown',
      userAgent: validatedData.userAgent || trackingData.userAgent || 'unknown',
      referrer: sanitizeString(validatedData.referrer || trackingData.referrer, 500),
      country: validatedData.country || trackingData.country,
      city: validatedData.city || trackingData.city,
      device: validatedData.device || trackingData.device,
      browser: validatedData.browser || trackingData.browser,
      os: validatedData.os || trackingData.os,
      utmSource: sanitizeString(validatedData.utmSource || trackingData.utmSource, 100),
      utmMedium: sanitizeString(validatedData.utmMedium || trackingData.utmMedium, 100),
      utmCampaign: sanitizeString(validatedData.utmCampaign || trackingData.utmCampaign, 100),
      utmContent: sanitizeString(validatedData.utmContent || trackingData.utmContent, 100),
      utmTerm: sanitizeString(validatedData.utmTerm || trackingData.utmTerm, 100),
      sessionId: validatedData.sessionId || trackingData.sessionId,
    };
    
    // Insert click record
    const result = await db.insert(marketplaceClicks).values(clickData).returning();
    
    // Update daily aggregations
    await updateDailyAggregations(
      clickData.marketplace,
      clickData.productId,
      clickData.device,
      clickData.sessionId
    );
    
    res.json({
      success: true,
      message: "Click registrado com sucesso",
      clickId: result[0].id
    });
    
  } catch (error) {
    console.error("Analytics click tracking error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Get dashboard metrics with filters
 */
router.get("/dashboard", analyticsLimiter, authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = DashboardQuerySchema.parse(req.query);
    
    // Default date range (last 30 days)
    const endDate = query.endDate || new Date().toISOString().split('T')[0];
    const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Build where conditions
    const whereConditions = [
      gte(marketplaceClicks.clickedAt, startDate),
      lte(marketplaceClicks.clickedAt, endDate + ' 23:59:59')
    ];
    
    if (query.marketplace) {
      whereConditions.push(eq(marketplaceClicks.marketplace, query.marketplace));
    }
    
    if (query.productId) {
      whereConditions.push(eq(marketplaceClicks.productId, parseInt(query.productId)));
    }
    
    if (query.device) {
      whereConditions.push(eq(marketplaceClicks.device, query.device));
    }
    
    // Get total metrics
    const totalStats = await db
      .select({
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
        mobileClicks: sql<number>`SUM(CASE WHEN device = 'mobile' THEN 1 ELSE 0 END)`,
        desktopClicks: sql<number>`SUM(CASE WHEN device = 'desktop' THEN 1 ELSE 0 END)`,
        tabletClicks: sql<number>`SUM(CASE WHEN device = 'tablet' THEN 1 ELSE 0 END)`,
        uniqueUsers: countDistinct(marketplaceClicks.userId),
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions));
    
    // Get top marketplaces
    const topMarketplaces = await db
      .select({
        marketplace: marketplaceClicks.marketplace,
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .groupBy(marketplaceClicks.marketplace)
      .orderBy(desc(count()))
      .limit(10);
    
    // Get top products
    const topProducts = await db
      .select({
        productId: marketplaceClicks.productId,
        productName: marketplaceClicks.productName,
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .groupBy(marketplaceClicks.productId, marketplaceClicks.productName)
      .orderBy(desc(count()))
      .limit(10);
    
    // Get daily stats for chart
    const dailyStats = await db
      .select({
        date: sql<string>`DATE(clicked_at)`,
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
        mobileClicks: sql<number>`SUM(CASE WHEN device = 'mobile' THEN 1 ELSE 0 END)`,
        desktopClicks: sql<number>`SUM(CASE WHEN device = 'desktop' THEN 1 ELSE 0 END)`,
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .groupBy(sql`DATE(clicked_at)`)
      .orderBy(sql`DATE(clicked_at)`);
    
    res.json({
      success: true,
      data: {
        summary: totalStats[0],
        topMarketplaces,
        topProducts,
        dailyStats,
        dateRange: { startDate, endDate }
      }
    });
    
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros inválidos",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

/**
 * GET /api/analytics/clicks
 * Get detailed click history with pagination
 */
router.get("/clicks", analyticsLimiter, authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = DashboardQuerySchema.parse(req.query);
    
    const limit = parseInt(query.limit || '50');
    const offset = parseInt(query.offset || '0');
    
    // Default date range (last 7 days)
    const endDate = query.endDate || new Date().toISOString().split('T')[0];
    const startDate = query.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Build where conditions
    const whereConditions = [
      gte(marketplaceClicks.clickedAt, startDate),
      lte(marketplaceClicks.clickedAt, endDate + ' 23:59:59')
    ];
    
    if (query.marketplace) {
      whereConditions.push(eq(marketplaceClicks.marketplace, query.marketplace));
    }
    
    if (query.productId) {
      whereConditions.push(eq(marketplaceClicks.productId, parseInt(query.productId)));
    }
    
    if (query.device) {
      whereConditions.push(eq(marketplaceClicks.device, query.device));
    }
    
    // Get detailed clicks
    const clicks = await db
      .select()
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .orderBy(desc(marketplaceClicks.clickedAt))
      .limit(limit)
      .offset(offset);
    
    // Get total count for pagination
    const totalCount = await db
      .select({ count: count() })
      .from(marketplaceClicks)
      .where(and(...whereConditions));
    
    res.json({
      success: true,
      data: {
        clicks,
        pagination: {
          total: totalCount[0].count,
          limit,
          offset,
          hasMore: totalCount[0].count > offset + limit
        }
      }
    });
    
  } catch (error) {
    console.error("Clicks history error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros inválidos",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

/**
 * GET /api/analytics/marketplaces
 * Get marketplace performance comparison
 */
router.get("/marketplaces", analyticsLimiter, authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = DashboardQuerySchema.parse(req.query);
    
    // Default date range (last 30 days)
    const endDate = query.endDate || new Date().toISOString().split('T')[0];
    const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Build where conditions
    const whereConditions = [
      gte(marketplaceClicks.clickedAt, startDate),
      lte(marketplaceClicks.clickedAt, endDate + ' 23:59:59')
    ];
    
    if (query.productId) {
      whereConditions.push(eq(marketplaceClicks.productId, parseInt(query.productId)));
    }
    
    // Get marketplace performance
    const marketplacesStats = await db
      .select({
        marketplace: marketplaceClicks.marketplace,
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
        mobileClicks: sql<number>`SUM(CASE WHEN device = 'mobile' THEN 1 ELSE 0 END)`,
        desktopClicks: sql<number>`SUM(CASE WHEN device = 'desktop' THEN 1 ELSE 0 END)`,
        tabletClicks: sql<number>`SUM(CASE WHEN device = 'tablet' THEN 1 ELSE 0 END)`,
        uniqueUsers: countDistinct(marketplaceClicks.userId),
        topCountries: sql<string>`GROUP_CONCAT(DISTINCT country)`,
        avgClicksPerSession: sql<number>`CAST(COUNT(*) AS REAL) / COUNT(DISTINCT session_id)`,
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .groupBy(marketplaceClicks.marketplace)
      .orderBy(desc(count()));
    
    // Get daily trends for each marketplace
    const dailyTrends = await db
      .select({
        date: sql<string>`DATE(clicked_at)`,
        marketplace: marketplaceClicks.marketplace,
        totalClicks: count(),
        uniqueClicks: countDistinct(marketplaceClicks.sessionId),
      })
      .from(marketplaceClicks)
      .where(and(...whereConditions))
      .groupBy(sql`DATE(clicked_at)`, marketplaceClicks.marketplace)
      .orderBy(sql`DATE(clicked_at)`, marketplaceClicks.marketplace);
    
    res.json({
      success: true,
      data: {
        marketplaces: marketplacesStats,
        dailyTrends,
        dateRange: { startDate, endDate }
      }
    });
    
  } catch (error) {
    console.error("Marketplaces analytics error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros inválidos",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

/**
 * Helper function to update daily aggregations
 */
async function updateDailyAggregations(
  marketplace: string,
  productId: number | undefined,
  device: string | undefined,
  sessionId: string | undefined
) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if record exists
    const existing = await db
      .select()
      .from(analyticsDaily)
      .where(
        and(
          eq(analyticsDaily.date, today),
          eq(analyticsDaily.marketplace, marketplace),
          productId ? eq(analyticsDaily.productId, productId) : sql`product_id IS NULL`
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing record
      const updates: any = {
        totalClicks: sql`total_clicks + 1`,
        updatedAt: new Date().toISOString(),
      };
      
      if (device === 'mobile') {
        updates.mobileClicks = sql`mobile_clicks + 1`;
      } else if (device === 'desktop') {
        updates.desktopClicks = sql`desktop_clicks + 1`;
      }
      
      await db
        .update(analyticsDaily)
        .set(updates)
        .where(eq(analyticsDaily.id, existing[0].id));
      
    } else {
      // Create new record
      await db.insert(analyticsDaily).values({
        date: today,
        marketplace,
        productId,
        totalClicks: 1,
        uniqueClicks: 1, // This would need more complex logic to be accurate
        mobileClicks: device === 'mobile' ? 1 : 0,
        desktopClicks: device === 'desktop' ? 1 : 0,
      });
    }
  } catch (error) {
    console.error('Failed to update daily aggregations:', error);
    // Don't throw - this shouldn't break the main flow
  }
}

export default router;