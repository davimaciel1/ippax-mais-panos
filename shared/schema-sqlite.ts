import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table for SQLite
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Products table for SQLite with all Google Shopping fields
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: text("price").notNull(),
  salePrice: text("sale_price"),
  salePriceStartDate: text("sale_price_start_date"),
  salePriceEndDate: text("sale_price_end_date"),
  stock: integer("stock").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  
  // Google Shopping fields
  gtin: text("gtin"),
  mpn: text("mpn"),
  brand: text("brand").default("IPPAX"),
  condition: text("condition").default("new"),
  availability: text("availability").default("in stock"),
  googleCategory: text("google_category"),
  productType: text("product_type"),
  
  // Physical properties
  material: text("material").default("PVC"),
  color: text("color"),
  weight: text("weight"),
  shippingLength: real("shipping_length"),
  shippingWidth: real("shipping_width"),
  shippingHeight: real("shipping_height"),
  shippingWeight: real("shipping_weight"),
  unit: text("unit").default("m²"),
  
  // Additional attributes
  itemGroupId: text("item_group_id"),
  customLabel0: text("custom_label_0"),
  customLabel1: text("custom_label_1"),
  customLabel2: text("custom_label_2"),
  customLabel3: text("custom_label_3"),
  customLabel4: text("custom_label_4"),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  urlSlug: text("url_slug"),
  
  // Features (stored as JSON strings)
  highlights: text("highlights"),
  technicalSpecs: text("technical_specs"),
  
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Analytics table for marketplace clicks tracking
export const marketplaceClicks = sqliteTable("marketplace_clicks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  marketplace: text("marketplace").notNull(), // 'amazon', 'mercadolivre', 'americanas', etc.
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  userId: text("user_id"), // session/cookie based user tracking
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  referrer: text("referrer"),
  country: text("country"),
  city: text("city"),
  device: text("device"), // 'mobile', 'desktop', 'tablet'
  browser: text("browser"),
  os: text("os"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  sessionId: text("session_id"),
  clickedAt: text("clicked_at").default("CURRENT_TIMESTAMP"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Analytics aggregations table for performance optimization
export const analyticsDaily = sqliteTable("analytics_daily", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD format
  marketplace: text("marketplace").notNull(),
  productId: integer("product_id"),
  totalClicks: integer("total_clicks").notNull().default(0),
  uniqueClicks: integer("unique_clicks").notNull().default(0),
  mobileClicks: integer("mobile_clicks").notNull().default(0),
  desktopClicks: integer("desktop_clicks").notNull().default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Affiliate tracking tables
export const affiliateClicks = sqliteTable("affiliate_clicks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  marketplace: text("marketplace").notNull(), // amazon, mercadolivre, shopee, leroymerlin
  productId: integer("product_id"),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmCampaign: text("utm_campaign"),
  utmMedium: text("utm_medium"),
  deviceType: text("device_type"), // mobile, desktop, tablet
  browserName: text("browser_name"),
  country: text("country"),
  city: text("city"),
  clickedAt: text("clicked_at").default("CURRENT_TIMESTAMP"),
});

export const marketplaceSettings = sqliteTable("marketplace_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  marketplace: text("marketplace").unique().notNull(),
  isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
  affiliateLink: text("affiliate_link").notNull(),
  buttonText: text("button_text").notNull(),
  buttonImage: text("button_image"),
  priority: integer("priority").default(1), // Display order
  trackingParams: text("tracking_params"), // JSON string for extra params
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export const conversionEvents = sqliteTable("conversion_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clickId: integer("click_id").references(() => affiliateClicks.id),
  eventType: text("event_type").notNull(), // view, add_to_cart, purchase
  eventValue: real("event_value"), // Purchase amount if applicable
  currency: text("currency").default("BRL"),
  productData: text("product_data"), // JSON string with product info
  conversionTime: integer("conversion_time"), // Minutes from click to conversion
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const retargetingPixels = sqliteTable("retargeting_pixels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pixelType: text("pixel_type").notNull(), // google_ads, google_analytics, uol_ads, facebook, meta_pixel
  pixelId: text("pixel_id").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  eventTypes: text("event_types"), // JSON array of events to track
  customCode: text("custom_code"), // Custom pixel code if needed
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Settings table for general site configuration including pixels
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  type: text("type").default("string"), // string, number, boolean, json
  description: text("description"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Affiliate types
export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = typeof affiliateClicks.$inferInsert;
export type MarketplaceSettings = typeof marketplaceSettings.$inferSelect;
export type InsertMarketplaceSettings = typeof marketplaceSettings.$inferInsert;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
export type InsertConversionEvent = typeof conversionEvents.$inferInsert;
export type RetargetingPixel = typeof retargetingPixels.$inferSelect;
export type InsertRetargetingPixel = typeof retargetingPixels.$inferInsert;
export type MarketplaceClick = typeof marketplaceClicks.$inferSelect;
export type InsertMarketplaceClick = typeof marketplaceClicks.$inferInsert;
export type AnalyticsDaily = typeof analyticsDaily.$inferSelect;
export type InsertAnalyticsDaily = typeof analyticsDaily.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;