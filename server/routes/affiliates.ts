import express from "express";
import { db } from "../db-sqlite";
import { 
  affiliateClicks, 
  marketplaceSettings, 
  conversionEvents,
  retargetingPixels,
  type InsertAffiliateClick,
  type InsertConversionEvent 
} from "../../shared/schema-sqlite";
import { eq, and, gte, sql, desc } from "drizzle-orm";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Track affiliate click
router.post("/track-click", async (req, res) => {
  try {
    const {
      marketplace,
      productId,
      affiliateLink,
      sessionId,
      userAgent,
      referrer,
      utmSource,
      utmCampaign,
      utmMedium,
      trackingParams
    } = req.body;

    // Get client IP
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    // Detect device type from user agent
    const deviceType = detectDeviceType(userAgent);
    const browserName = detectBrowser(userAgent);

    // Get geolocation (simplified - you might want to use a real IP geolocation service)
    const { country, city } = await getGeolocation(ipAddress);

    const clickData: InsertAffiliateClick = {
      marketplace,
      productId: productId ? parseInt(productId) : null,
      sessionId,
      ipAddress,
      userAgent,
      referrer,
      utmSource,
      utmCampaign,
      utmMedium,
      deviceType,
      browserName,
      country,
      city,
      clickedAt: new Date().toISOString()
    };

    // Insert click record
    const result = await db.insert(affiliateClicks).values(clickData).returning();
    
    res.json({
      success: true,
      clickId: result[0].id,
      message: "Click tracked successfully"
    });

  } catch (error) {
    console.error("Error tracking affiliate click:", error);
    res.status(500).json({
      success: false,
      message: "Error tracking click"
    });
  }
});

// Track conversion event
router.post("/track-conversion", async (req, res) => {
  try {
    const {
      clickId,
      eventType,
      eventValue,
      currency = "BRL",
      productData
    } = req.body;

    // Get original click data to calculate conversion time
    const originalClick = await db
      .select()
      .from(affiliateClicks)
      .where(eq(affiliateClicks.id, clickId))
      .limit(1);

    if (originalClick.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Original click not found"
      });
    }

    const clickTime = new Date(originalClick[0].clickedAt);
    const conversionTime = Math.floor((Date.now() - clickTime.getTime()) / (1000 * 60)); // Minutes

    const conversionData: InsertConversionEvent = {
      clickId,
      eventType,
      eventValue: eventValue ? parseFloat(eventValue) : null,
      currency,
      productData: JSON.stringify(productData),
      conversionTime,
      createdAt: new Date().toISOString()
    };

    const result = await db.insert(conversionEvents).values(conversionData).returning();

    res.json({
      success: true,
      conversionId: result[0].id,
      conversionTime,
      message: "Conversion tracked successfully"
    });

  } catch (error) {
    console.error("Error tracking conversion:", error);
    res.status(500).json({
      success: false,
      message: "Error tracking conversion"
    });
  }
});

// Get marketplace configuration
router.get("/marketplace/:marketplace/config", async (req, res) => {
  try {
    const { marketplace } = req.params;

    const config = await db
      .select()
      .from(marketplaceSettings)
      .where(eq(marketplaceSettings.marketplace, marketplace))
      .limit(1);

    if (config.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Marketplace configuration not found"
      });
    }

    // Parse tracking params if they exist
    const trackingParams = config[0].trackingParams 
      ? JSON.parse(config[0].trackingParams)
      : {};

    res.json({
      id: config[0].marketplace,
      name: config[0].marketplace,
      affiliateLink: config[0].affiliateLink,
      buttonText: config[0].buttonText,
      buttonImage: config[0].buttonImage,
      isEnabled: config[0].isEnabled,
      trackingParams
    });

  } catch (error) {
    console.error("Error getting marketplace config:", error);
    res.status(500).json({
      success: false,
      message: "Error loading configuration"
    });
  }
});

// Get analytics data
router.get("/analytics/marketplaces/stats", async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get stats for each marketplace
    const marketplaces = ['amazon', 'mercadolivre', 'shopee', 'leroymerlin'];
    const stats = [];

    for (const marketplace of marketplaces) {
      // Today's clicks
      const todayClicks = await db
        .select({ count: sql<number>`count(*)` })
        .from(affiliateClicks)
        .where(and(
          eq(affiliateClicks.marketplace, marketplace),
          gte(affiliateClicks.clickedAt, startOfToday.toISOString())
        ));

      // Week's clicks
      const weekClicks = await db
        .select({ count: sql<number>`count(*)` })
        .from(affiliateClicks)
        .where(and(
          eq(affiliateClicks.marketplace, marketplace),
          gte(affiliateClicks.clickedAt, startOfWeek.toISOString())
        ));

      // Month's clicks
      const monthClicks = await db
        .select({ count: sql<number>`count(*)` })
        .from(affiliateClicks)
        .where(and(
          eq(affiliateClicks.marketplace, marketplace),
          gte(affiliateClicks.clickedAt, startOfMonth.toISOString())
        ));

      // Calculate conversion rate (simplified)
      const conversions = await db
        .select({ count: sql<number>`count(*)` })
        .from(conversionEvents)
        .innerJoin(affiliateClicks, eq(conversionEvents.clickId, affiliateClicks.id))
        .where(and(
          eq(affiliateClicks.marketplace, marketplace),
          gte(affiliateClicks.clickedAt, startOfMonth.toISOString())
        ));

      const conversionRate = monthClicks[0].count > 0 
        ? (conversions[0].count / monthClicks[0].count) * 100 
        : 0;

      // Check if marketplace is enabled
      const config = await db
        .select()
        .from(marketplaceSettings)
        .where(eq(marketplaceSettings.marketplace, marketplace))
        .limit(1);

      const isEnabled = config.length > 0 ? config[0].isEnabled : true;

      stats.push({
        marketplace,
        clicksToday: todayClicks[0].count,
        clicksWeek: weekClicks[0].count,
        clicksMonth: monthClicks[0].count,
        conversionRate,
        isEnabled
      });
    }

    res.json(stats);

  } catch (error) {
    console.error("Error getting marketplace stats:", error);
    res.status(500).json({
      success: false,
      message: "Error loading stats"
    });
  }
});

// Get detailed analytics for a specific marketplace
router.get("/analytics/marketplace/:marketplace/details", authenticate, async (req, res) => {
  try {
    const { marketplace } = req.params;
    const { period = "30d" } = req.query;

    // Calculate date range
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get clicks over time
    const clicksOverTime = await db
      .select({
        date: sql<string>`DATE(clicked_at)`,
        count: sql<number>`count(*)`
      })
      .from(affiliateClicks)
      .where(and(
        eq(affiliateClicks.marketplace, marketplace),
        gte(affiliateClicks.clickedAt, startDate.toISOString())
      ))
      .groupBy(sql`DATE(clicked_at)`)
      .orderBy(sql`DATE(clicked_at)`);

    // Get device breakdown
    const deviceBreakdown = await db
      .select({
        deviceType: affiliateClicks.deviceType,
        count: sql<number>`count(*)`
      })
      .from(affiliateClicks)
      .where(and(
        eq(affiliateClicks.marketplace, marketplace),
        gte(affiliateClicks.clickedAt, startDate.toISOString())
      ))
      .groupBy(affiliateClicks.deviceType);

    // Get top referrers
    const topReferrers = await db
      .select({
        referrer: affiliateClicks.referrer,
        count: sql<number>`count(*)`
      })
      .from(affiliateClicks)
      .where(and(
        eq(affiliateClicks.marketplace, marketplace),
        gte(affiliateClicks.clickedAt, startDate.toISOString())
      ))
      .groupBy(affiliateClicks.referrer)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get conversion events
    const conversions = await db
      .select({
        eventType: conversionEvents.eventType,
        count: sql<number>`count(*)`,
        totalValue: sql<number>`sum(event_value)`
      })
      .from(conversionEvents)
      .innerJoin(affiliateClicks, eq(conversionEvents.clickId, affiliateClicks.id))
      .where(and(
        eq(affiliateClicks.marketplace, marketplace),
        gte(affiliateClicks.clickedAt, startDate.toISOString())
      ))
      .groupBy(conversionEvents.eventType);

    res.json({
      marketplace,
      period,
      clicksOverTime,
      deviceBreakdown,
      topReferrers,
      conversions,
      summary: {
        totalClicks: clicksOverTime.reduce((acc, day) => acc + day.count, 0),
        totalConversions: conversions.reduce((acc, conv) => acc + conv.count, 0),
        totalValue: conversions.reduce((acc, conv) => acc + (conv.totalValue || 0), 0)
      }
    });

  } catch (error) {
    console.error("Error getting marketplace details:", error);
    res.status(500).json({
      success: false,
      message: "Error loading marketplace details"
    });
  }
});

// Admin endpoints
router.post("/admin/marketplace/:marketplace/toggle", authenticate, async (req, res) => {
  try {
    const { marketplace } = req.params;
    const { enabled } = req.body;

    // Check if setting exists
    const existing = await db
      .select()
      .from(marketplaceSettings)
      .where(eq(marketplaceSettings.marketplace, marketplace))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(marketplaceSettings)
        .set({ 
          isEnabled: enabled,
          updatedAt: new Date().toISOString()
        })
        .where(eq(marketplaceSettings.marketplace, marketplace));
    } else {
      // Create new (with default values)
      await db.insert(marketplaceSettings).values({
        marketplace,
        isEnabled: enabled,
        affiliateLink: `https://${marketplace}.com/ippax`,
        buttonText: `Comprar na ${marketplace}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: `Marketplace ${marketplace} ${enabled ? 'enabled' : 'disabled'}`
    });

  } catch (error) {
    console.error("Error toggling marketplace:", error);
    res.status(500).json({
      success: false,
      message: "Error updating marketplace"
    });
  }
});

// Helper functions
function detectDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

function detectBrowser(userAgent: string): string {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'chrome';
  if (ua.includes('firefox')) return 'firefox';
  if (ua.includes('safari')) return 'safari';
  if (ua.includes('edge')) return 'edge';
  if (ua.includes('opera')) return 'opera';
  return 'other';
}

async function getGeolocation(ipAddress: string): Promise<{ country: string; city: string }> {
  // Simplified geolocation - in production, use a real IP geolocation service
  // like GeoIP2, IPapi, or similar
  try {
    if (ipAddress === 'unknown' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.')) {
      return { country: 'BR', city: 'Unknown' };
    }
    
    // Mock geolocation for now
    return { country: 'BR', city: 'São Paulo' };
  } catch (error) {
    return { country: 'Unknown', city: 'Unknown' };
  }
}

export default router;