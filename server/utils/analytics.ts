import { Request } from "express";

export interface DeviceInfo {
  device: "mobile" | "desktop" | "tablet";
  browser: string;
  os: string;
}

export interface GeolocationInfo {
  country?: string;
  city?: string;
}

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let device: "mobile" | "desktop" | "tablet" = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "mobile";
  } else if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
    device = "tablet";
  }
  
  // Detect browser
  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edge")) {
    browser = "chrome";
  } else if (ua.includes("firefox")) {
    browser = "firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "safari";
  } else if (ua.includes("edge")) {
    browser = "edge";
  } else if (ua.includes("opera")) {
    browser = "opera";
  }
  
  // Detect OS
  let os = "unknown";
  if (ua.includes("windows")) {
    os = "windows";
  } else if (ua.includes("mac os") || ua.includes("macos")) {
    os = "macos";
  } else if (ua.includes("linux")) {
    os = "linux";
  } else if (ua.includes("android")) {
    os = "android";
  } else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) {
    os = "ios";
  }
  
  return { device, browser, os };
}

/**
 * Extract UTM parameters from URL query string
 */
export function extractUTMParameters(url: string) {
  const urlObj = new URL(url, 'https://example.com');
  const params = urlObj.searchParams;
  
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
  };
}

/**
 * Generate or extract session ID from request
 */
export function getSessionId(req: Request): string {
  // Try to get from cookie first
  if (req.cookies?.session_id) {
    return req.cookies.session_id;
  }
  
  // Generate new session ID
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get user ID from session/authentication
 */
export function getUserId(req: Request): string | undefined {
  // Try to get from authenticated user
  if ((req as any).user?.id) {
    return `user_${(req as any).user.id}`;
  }
  
  // Try to get from cookie
  if (req.cookies?.user_id) {
    return req.cookies.user_id;
  }
  
  // Generate anonymous user ID
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get client IP address from request
 */
export function getClientIP(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
         req.headers['x-real-ip'] as string ||
         req.socket.remoteAddress ||
         'unknown';
}

/**
 * Simple geolocation based on IP (placeholder - in production use a proper service)
 */
export async function getGeolocation(ip: string): Promise<GeolocationInfo> {
  // For now, return basic info based on IP ranges
  // In production, you'd integrate with services like MaxMind, ipapi.co, etc.
  
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return { country: 'BR', city: 'Local Network' };
  }
  
  // Default to Brazil for now
  return { country: 'BR', city: 'Unknown' };
}

/**
 * Validate marketplace name
 */
export function validateMarketplace(marketplace: string): boolean {
  const validMarketplaces = [
    'amazon',
    'mercadolivre',
    'americanas',
    'submarino',
    'casasbahia',
    'magazineluiza',
    'extra',
    'pontofrio',
    'shopee',
    'aliexpress',
    'direct' // Direct purchase
  ];
  
  return validMarketplaces.includes(marketplace.toLowerCase());
}

/**
 * Sanitize string for database storage
 */
export function sanitizeString(str: string | undefined, maxLength: number = 255): string | undefined {
  if (!str) return undefined;
  return str.trim().substring(0, maxLength);
}