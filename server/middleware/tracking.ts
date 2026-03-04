import { Request, Response, NextFunction } from "express";
import { 
  parseUserAgent, 
  extractUTMParameters, 
  getSessionId, 
  getUserId, 
  getClientIP, 
  getGeolocation,
  sanitizeString 
} from "../utils/analytics";

export interface TrackingData {
  userAgent: string;
  ipAddress: string;
  device: "mobile" | "desktop" | "tablet";
  browser: string;
  os: string;
  referrer?: string;
  country?: string;
  city?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  sessionId: string;
  userId?: string;
}

/**
 * Middleware to capture and attach tracking data to requests
 */
export async function trackingMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = getClientIP(req);
    const deviceInfo = parseUserAgent(userAgent);
    const referrer = req.headers.referer || req.headers.referrer;
    const sessionId = getSessionId(req);
    const userId = getUserId(req);
    
    // Extract UTM parameters from referrer or current URL
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const utmParams = extractUTMParameters(fullUrl);
    
    // Get geolocation (this could be cached for performance)
    const geoInfo = await getGeolocation(ipAddress);
    
    // Attach tracking data to request object
    (req as any).trackingData = {
      userAgent: sanitizeString(userAgent, 500),
      ipAddress: sanitizeString(ipAddress, 45),
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      referrer: sanitizeString(referrer as string, 500),
      country: geoInfo.country,
      city: geoInfo.city,
      sessionId,
      userId,
      ...utmParams
    } as TrackingData;
    
    // Set session cookie if not exists
    if (!req.cookies?.session_id) {
      res.cookie('session_id', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    // Set user ID cookie if not exists
    if (!req.cookies?.user_id && userId) {
      res.cookie('user_id', userId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    next();
  } catch (error) {
    console.error('Tracking middleware error:', error);
    // Don't block the request if tracking fails
    next();
  }
}

/**
 * Middleware specifically for marketplace click tracking
 */
export function marketplaceTrackingMiddleware(req: Request, res: Response, next: NextFunction) {
  // This runs after trackingMiddleware, so tracking data should be available
  const trackingData = (req as any).trackingData as TrackingData;
  
  if (!trackingData) {
    console.warn('Marketplace tracking middleware called without tracking data');
    return next();
  }
  
  // Store original response.redirect method
  const originalRedirect = res.redirect;
  
  // Override redirect method to capture marketplace redirects
  res.redirect = function(this: Response, status: number | string, url?: string) {
    // Handle different redirect signatures
    let statusCode: number;
    let redirectUrl: string;
    
    if (typeof status === 'string') {
      statusCode = 302;
      redirectUrl = status;
    } else {
      statusCode = status;
      redirectUrl = url!;
    }
    
    // Check if this is a marketplace redirect
    const marketplace = detectMarketplaceFromUrl(redirectUrl);
    if (marketplace) {
      // Log the marketplace click (this will be handled by the analytics API)
      console.log(`Marketplace click detected: ${marketplace} - ${redirectUrl}`);
      
      // You could emit an event here or queue a job to record the click
      setImmediate(() => {
        recordMarketplaceClick({
          marketplace,
          productName: req.params.productName || 'Unknown Product',
          productId: req.params.productId ? parseInt(req.params.productId) : undefined,
          redirectUrl,
          trackingData
        });
      });
    }
    
    // Call original redirect
    return originalRedirect.call(this, statusCode, redirectUrl);
  };
  
  next();
}

/**
 * Detect marketplace from URL
 */
function detectMarketplaceFromUrl(url: string): string | null {
  const marketplacePatterns = {
    amazon: /amazon\.(com\.br|com)/i,
    mercadolivre: /mercadolivre\.com\.br/i,
    americanas: /americanas\.com\.br/i,
    submarino: /submarino\.com\.br/i,
    casasbahia: /casasbahia\.com\.br/i,
    magazineluiza: /magazineluiza\.com\.br/i,
    extra: /extra\.com\.br/i,
    pontofrio: /pontofrio\.com\.br/i,
    shopee: /shopee\.com\.br/i,
    aliexpress: /aliexpress\.com/i,
  };
  
  for (const [marketplace, pattern] of Object.entries(marketplacePatterns)) {
    if (pattern.test(url)) {
      return marketplace;
    }
  }
  
  return null;
}

/**
 * Record marketplace click with pixel tracking
 */
async function recordMarketplaceClick(data: {
  marketplace: string;
  productName: string;
  productId?: number;
  redirectUrl: string;
  trackingData: TrackingData;
}) {
  try {
    // Import pixel manager dynamically to avoid circular dependencies
    const { getPixelManager } = await import('../utils/pixels');
    const pixelManager = getPixelManager();
    
    // Track the click in our analytics API
    const analyticsPayload = {
      marketplace: data.marketplace,
      productId: data.productId,
      productName: data.productName,
      redirectUrl: data.redirectUrl,
      userId: data.trackingData.userId,
      ipAddress: data.trackingData.ipAddress,
      userAgent: data.trackingData.userAgent,
      referrer: data.trackingData.referrer,
      country: data.trackingData.country,
      city: data.trackingData.city,
      device: data.trackingData.device,
      browser: data.trackingData.browser,
      os: data.trackingData.os,
      utmSource: data.trackingData.utmSource,
      utmMedium: data.trackingData.utmMedium,
      utmCampaign: data.trackingData.utmCampaign,
      utmContent: data.trackingData.utmContent,
      utmTerm: data.trackingData.utmTerm,
      sessionId: data.trackingData.sessionId,
    };
    
    // Send to our analytics API
    try {
      await fetch('http://localhost:5000/api/analytics/click', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(analyticsPayload)
      });
    } catch (apiError) {
      console.error('Failed to send to analytics API:', apiError);
    }
    
    // Track in external pixels (Google Analytics, UOL Ads, Facebook)
    try {
      const pixelResults = await pixelManager.trackMarketplaceClick({
        marketplace: data.marketplace,
        productId: data.productId,
        productName: data.productName,
        trackingData: data.trackingData
      });
      
      console.log('Pixel tracking results:', pixelResults);
    } catch (pixelError) {
      console.error('Failed to track in pixels:', pixelError);
    }
    
    console.log('Marketplace click recorded successfully:', {
      marketplace: data.marketplace,
      product: data.productName,
      device: data.trackingData.device,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Failed to record marketplace click:', error);
  }
}