import { Router } from "express";
import { db, sqlite } from "../db-sqlite";
import { retargetingPixels, siteSettings } from "../../shared/schema-sqlite";
import { eq } from "drizzle-orm";

const router = Router();

// Get all pixel settings
router.get("/", async (req, res) => {
  try {
    // Get pixels from retargeting_pixels table
    const pixels = sqlite.prepare(`
      SELECT * FROM retargeting_pixels 
      ORDER BY pixel_type
    `).all();

    // Get site settings related to pixels
    const settings = sqlite.prepare(`
      SELECT key, value FROM site_settings 
      WHERE key IN ('google_analytics_id', 'meta_pixel_id', 'uol_ads_pixel_id')
    `).all();

    // Format response
    const pixelSettings = {
      googleAnalyticsId: "",
      metaPixelId: "",
      uolAdsPixelId: "",
      enableGoogleAnalytics: false,
      enableMetaPixel: false,
      enableUolAds: false,
      customPixelCode: "",
      pixels: pixels,
      settings: settings
    };

    // Map settings
    settings.forEach((setting: any) => {
      switch (setting.key) {
        case 'google_analytics_id':
          pixelSettings.googleAnalyticsId = setting.value;
          break;
        case 'meta_pixel_id':
          pixelSettings.metaPixelId = setting.value;
          break;
        case 'uol_ads_pixel_id':
          pixelSettings.uolAdsPixelId = setting.value;
          break;
      }
    });

    // Map pixel states
    pixels.forEach((pixel: any) => {
      switch (pixel.pixel_type) {
        case 'google_analytics':
          pixelSettings.enableGoogleAnalytics = pixel.is_active === 1;
          if (pixel.pixel_id) pixelSettings.googleAnalyticsId = pixel.pixel_id;
          break;
        case 'meta_pixel':
          pixelSettings.enableMetaPixel = pixel.is_active === 1;
          if (pixel.pixel_id) pixelSettings.metaPixelId = pixel.pixel_id;
          break;
        case 'uol_ads':
          pixelSettings.enableUolAds = pixel.is_active === 1;
          if (pixel.pixel_id) pixelSettings.uolAdsPixelId = pixel.pixel_id;
          break;
      }
      
      // Get custom code if available
      if (pixel.custom_code) {
        pixelSettings.customPixelCode = pixel.custom_code;
      }
    });

    res.json(pixelSettings);
  } catch (error) {
    console.error("Error fetching pixel settings:", error);
    res.status(500).json({ error: "Failed to fetch pixel settings" });
  }
});

// Update pixel settings
router.post("/", async (req, res) => {
  try {
    const {
      googleAnalyticsId,
      metaPixelId,
      uolAdsPixelId,
      enableGoogleAnalytics,
      enableMetaPixel,
      enableUolAds,
      customPixelCode
    } = req.body;

    // Update or insert pixel settings
    const pixelUpdates = [
      {
        type: 'google_analytics',
        id: googleAnalyticsId || '',
        active: enableGoogleAnalytics ? 1 : 0,
        events: JSON.stringify(['page_view', 'purchase', 'add_to_cart'])
      },
      {
        type: 'meta_pixel',
        id: metaPixelId || '',
        active: enableMetaPixel ? 1 : 0,
        events: JSON.stringify(['PageView', 'Purchase', 'AddToCart', 'ViewContent'])
      },
      {
        type: 'uol_ads',
        id: uolAdsPixelId || '',
        active: enableUolAds ? 1 : 0,
        events: JSON.stringify(['page_view', 'conversion'])
      }
    ];

    // Update retargeting_pixels table
    const updatePixelStmt = sqlite.prepare(`
      INSERT OR REPLACE INTO retargeting_pixels 
      (pixel_type, pixel_id, is_active, event_types, custom_code, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    pixelUpdates.forEach(pixel => {
      updatePixelStmt.run(
        pixel.type,
        pixel.id,
        pixel.active,
        pixel.events,
        pixel.type === 'google_analytics' ? customPixelCode || '' : ''
      );
    });

    // Update site_settings table
    const updateSettingStmt = sqlite.prepare(`
      INSERT OR REPLACE INTO site_settings 
      (key, value, type, description, updated_at)
      VALUES (?, ?, 'string', ?, CURRENT_TIMESTAMP)
    `);

    updateSettingStmt.run(
      'google_analytics_id',
      googleAnalyticsId || '',
      'ID de medição do Google Analytics 4'
    );

    updateSettingStmt.run(
      'meta_pixel_id',
      metaPixelId || '',
      'ID do pixel do Meta/Facebook'
    );

    updateSettingStmt.run(
      'uol_ads_pixel_id',
      uolAdsPixelId || '',
      'ID do pixel do UOL Ads'
    );

    console.log("✅ Pixel settings updated successfully");

    res.json({ 
      success: true, 
      message: "Pixel settings updated successfully",
      settings: {
        googleAnalyticsId,
        metaPixelId,
        uolAdsPixelId,
        enableGoogleAnalytics,
        enableMetaPixel,
        enableUolAds,
        customPixelCode
      }
    });

  } catch (error) {
    console.error("Error updating pixel settings:", error);
    res.status(500).json({ error: "Failed to update pixel settings" });
  }
});

// Get pixel configuration for frontend
router.get("/config", async (req, res) => {
  try {
    const pixels = sqlite.prepare(`
      SELECT pixel_type, pixel_id, is_active, custom_code 
      FROM retargeting_pixels 
      WHERE is_active = 1
    `).all();

    const config = {
      enabledPixels: pixels.map((pixel: any) => ({
        type: pixel.pixel_type,
        id: pixel.pixel_id,
        customCode: pixel.custom_code
      }))
    };

    res.json(config);
  } catch (error) {
    console.error("Error fetching pixel config:", error);
    res.status(500).json({ error: "Failed to fetch pixel config" });
  }
});

// Track pixel events (for analytics)
router.post("/track", async (req, res) => {
  try {
    const { pixelType, eventType, eventData, userId, sessionId } = req.body;

    // Log pixel event (in production, you might want to store this in a separate analytics table)
    console.log(`📊 Pixel Event: ${pixelType} - ${eventType}`, {
      data: eventData,
      userId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    // Here you could store the event in an analytics table
    // For now, we'll just acknowledge the event
    res.json({ 
      success: true, 
      message: "Event tracked successfully" 
    });

  } catch (error) {
    console.error("Error tracking pixel event:", error);
    res.status(500).json({ error: "Failed to track event" });
  }
});

export default router;