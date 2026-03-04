import { Request } from "express";
import { TrackingData } from "../middleware/tracking";

export interface PixelEvent {
  eventName: string;
  parameters: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface GoogleAnalyticsEvent extends PixelEvent {
  clientId: string;
  eventCategory?: string;
  eventLabel?: string;
  value?: number;
}

export interface UOLAdsEvent extends PixelEvent {
  pixelId: string;
  conversionType?: string;
  conversionValue?: number;
}

/**
 * Google Analytics 4 integration
 */
export class GoogleAnalytics4 {
  private measurementId: string;
  private apiSecret: string;
  
  constructor(measurementId: string, apiSecret: string) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
  }
  
  /**
   * Send event to Google Analytics 4 via Measurement Protocol
   */
  async sendEvent(event: GoogleAnalyticsEvent): Promise<boolean> {
    try {
      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;
      
      const payload = {
        client_id: event.clientId,
        user_id: event.userId,
        events: [{
          name: event.eventName,
          params: {
            ...event.parameters,
            event_category: event.eventCategory,
            event_label: event.eventLabel,
            value: event.value,
            session_id: event.sessionId,
            timestamp_micros: Date.now() * 1000,
          }
        }]
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Google Analytics 4 event failed:', error);
      return false;
    }
  }
  
  /**
   * Track marketplace click event
   */
  async trackMarketplaceClick(data: {
    marketplace: string;
    productId?: number;
    productName: string;
    trackingData: TrackingData;
  }): Promise<boolean> {
    const event: GoogleAnalyticsEvent = {
      eventName: 'marketplace_click',
      clientId: data.trackingData.sessionId || 'anonymous',
      userId: data.trackingData.userId,
      sessionId: data.trackingData.sessionId,
      eventCategory: 'affiliate',
      eventLabel: `${data.marketplace}_${data.productName}`,
      timestamp: new Date().toISOString(),
      parameters: {
        marketplace: data.marketplace,
        product_id: data.productId,
        product_name: data.productName,
        device: data.trackingData.device,
        browser: data.trackingData.browser,
        os: data.trackingData.os,
        country: data.trackingData.country,
        utm_source: data.trackingData.utmSource,
        utm_medium: data.trackingData.utmMedium,
        utm_campaign: data.trackingData.utmCampaign,
      }
    };
    
    return await this.sendEvent(event);
  }
  
  /**
   * Track page view event
   */
  async trackPageView(data: {
    pageTitle: string;
    pagePath: string;
    trackingData: TrackingData;
  }): Promise<boolean> {
    const event: GoogleAnalyticsEvent = {
      eventName: 'page_view',
      clientId: data.trackingData.sessionId || 'anonymous',
      userId: data.trackingData.userId,
      sessionId: data.trackingData.sessionId,
      timestamp: new Date().toISOString(),
      parameters: {
        page_title: data.pageTitle,
        page_location: data.pagePath,
        device: data.trackingData.device,
        browser: data.trackingData.browser,
        os: data.trackingData.os,
        country: data.trackingData.country,
        referrer: data.trackingData.referrer,
        utm_source: data.trackingData.utmSource,
        utm_medium: data.trackingData.utmMedium,
        utm_campaign: data.trackingData.utmCampaign,
      }
    };
    
    return await this.sendEvent(event);
  }
}

/**
 * UOL Ads pixel integration
 */
export class UOLAdsPixel {
  private pixelId: string;
  private accessToken?: string;
  
  constructor(pixelId: string, accessToken?: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
  }
  
  /**
   * Send event to UOL Ads pixel
   */
  async sendEvent(event: UOLAdsEvent): Promise<boolean> {
    try {
      // UOL Ads pixel implementation would depend on their specific API
      // This is a placeholder implementation
      const url = `https://ads.uol.com.br/pixel/${this.pixelId}/track`;
      
      const payload = {
        event: event.eventName,
        parameters: event.parameters,
        conversion_type: event.conversionType,
        conversion_value: event.conversionValue,
        timestamp: event.timestamp,
        user_id: event.userId,
        session_id: event.sessionId,
      };
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      return response.ok;
    } catch (error) {
      console.error('UOL Ads pixel event failed:', error);
      return false;
    }
  }
  
  /**
   * Track marketplace click for UOL Ads
   */
  async trackMarketplaceClick(data: {
    marketplace: string;
    productId?: number;
    productName: string;
    trackingData: TrackingData;
  }): Promise<boolean> {
    const event: UOLAdsEvent = {
      pixelId: this.pixelId,
      eventName: 'marketplace_click',
      conversionType: 'affiliate_click',
      timestamp: new Date().toISOString(),
      userId: data.trackingData.userId,
      sessionId: data.trackingData.sessionId,
      parameters: {
        marketplace: data.marketplace,
        product_id: data.productId,
        product_name: data.productName,
        device: data.trackingData.device,
        country: data.trackingData.country,
        utm_source: data.trackingData.utmSource,
        utm_medium: data.trackingData.utmMedium,
        utm_campaign: data.trackingData.utmCampaign,
      }
    };
    
    return await this.sendEvent(event);
  }
}

/**
 * Facebook Pixel integration (bonus)
 */
export class FacebookPixel {
  private pixelId: string;
  private accessToken: string;
  
  constructor(pixelId: string, accessToken: string) {
    this.pixelId = pixelId;
    this.accessToken = accessToken;
  }
  
  async sendEvent(eventName: string, data: any, trackingData: TrackingData): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;
      
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          user_data: {
            client_ip_address: trackingData.ipAddress,
            client_user_agent: trackingData.userAgent,
            fbc: trackingData.sessionId, // Facebook click ID (if available)
            fbp: trackingData.userId, // Facebook browser ID (if available)
          },
          custom_data: data,
          event_source_url: data.source_url,
          action_source: 'website'
        }],
        access_token: this.accessToken
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Facebook Pixel event failed:', error);
      return false;
    }
  }
}

/**
 * Pixel Manager - orchestrates all pixel integrations
 */
export class PixelManager {
  private ga4?: GoogleAnalytics4;
  private uolAds?: UOLAdsPixel;
  private facebook?: FacebookPixel;
  
  constructor(config: {
    ga4?: { measurementId: string; apiSecret: string };
    uolAds?: { pixelId: string; accessToken?: string };
    facebook?: { pixelId: string; accessToken: string };
  }) {
    if (config.ga4) {
      this.ga4 = new GoogleAnalytics4(config.ga4.measurementId, config.ga4.apiSecret);
    }
    
    if (config.uolAds) {
      this.uolAds = new UOLAdsPixel(config.uolAds.pixelId, config.uolAds.accessToken);
    }
    
    if (config.facebook) {
      this.facebook = new FacebookPixel(config.facebook.pixelId, config.facebook.accessToken);
    }
  }
  
  /**
   * Track marketplace click across all configured pixels
   */
  async trackMarketplaceClick(data: {
    marketplace: string;
    productId?: number;
    productName: string;
    trackingData: TrackingData;
  }): Promise<{ ga4?: boolean; uolAds?: boolean; facebook?: boolean }> {
    const results: any = {};
    
    // Track in Google Analytics 4
    if (this.ga4) {
      results.ga4 = await this.ga4.trackMarketplaceClick(data);
    }
    
    // Track in UOL Ads
    if (this.uolAds) {
      results.uolAds = await this.uolAds.trackMarketplaceClick(data);
    }
    
    // Track in Facebook Pixel
    if (this.facebook) {
      results.facebook = await this.facebook.sendEvent('Purchase', {
        content_name: data.productName,
        content_category: data.marketplace,
        content_ids: [data.productId?.toString()],
        contents: [{
          id: data.productId?.toString(),
          name: data.productName,
          category: data.marketplace,
        }],
        source_url: `https://ippax.com.br/produto/${data.productId}`,
      }, data.trackingData);
    }
    
    return results;
  }
  
  /**
   * Track page view across all configured pixels
   */
  async trackPageView(data: {
    pageTitle: string;
    pagePath: string;
    trackingData: TrackingData;
  }): Promise<{ ga4?: boolean; facebook?: boolean }> {
    const results: any = {};
    
    // Track in Google Analytics 4
    if (this.ga4) {
      results.ga4 = await this.ga4.trackPageView(data);
    }
    
    // Track in Facebook Pixel
    if (this.facebook) {
      results.facebook = await this.facebook.sendEvent('PageView', {
        source_url: `https://ippax.com.br${data.pagePath}`,
      }, data.trackingData);
    }
    
    return results;
  }
}

// Singleton instance
let pixelManager: PixelManager | null = null;

/**
 * Initialize pixel manager with environment configuration
 */
export function initializePixelManager(): PixelManager {
  if (!pixelManager) {
    const config: any = {};
    
    // Google Analytics 4 configuration
    if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
      config.ga4 = {
        measurementId: process.env.GA4_MEASUREMENT_ID,
        apiSecret: process.env.GA4_API_SECRET,
      };
    }
    
    // UOL Ads configuration
    if (process.env.UOL_PIXEL_ID) {
      config.uolAds = {
        pixelId: process.env.UOL_PIXEL_ID,
        accessToken: process.env.UOL_ACCESS_TOKEN,
      };
    }
    
    // Facebook Pixel configuration
    if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
      config.facebook = {
        pixelId: process.env.FACEBOOK_PIXEL_ID,
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      };
    }
    
    pixelManager = new PixelManager(config);
  }
  
  return pixelManager;
}

/**
 * Get the initialized pixel manager instance
 */
export function getPixelManager(): PixelManager {
  if (!pixelManager) {
    return initializePixelManager();
  }
  return pixelManager;
}