import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Authentication users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 50 }),
  name: text("name").notNull(),
  color: varchar("color", { length: 100 }),
  description: text("description"),
  shortDescription: text("short_description"),
  category: text("category").notNull(),
  tone: text("tone").notNull(),
  discount: integer("discount").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  dimensions: text("dimensions").notNull().default("91cm x 15,2cm x 2mm"),
  coveragePerBox: decimal("coverage_per_box", { precision: 5, scale: 2 }).notNull().default("1.25"),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  badge: text("badge"),
  badgeColor: text("badge_color"),
  pattern: text("pattern"),
  
  // Google Shopping Required Fields
  gtin: varchar("gtin", { length: 20 }), // EAN, UPC, JAN, ISBN
  mpn: varchar("mpn", { length: 100 }), // Manufacturer Part Number
  brand: varchar("brand", { length: 100 }).notNull().default("IPPAX"),
  condition: varchar("condition", { length: 20 }).notNull().default("new"), // new, refurbished, used
  
  // Google Shopping Categories & Types
  googleCategory: text("google_category"), // Google product taxonomy ID
  productType: text("product_type"), // Your own category
  
  // Google Shopping Pricing & Availability
  availability: varchar("availability", { length: 20 }).notNull().default("in stock"), // in stock, out of stock, preorder
  availabilityDate: timestamp("availability_date"), // For preorder items
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }), // Promotional price
  salePriceStartDate: timestamp("sale_price_start_date"),
  salePriceEndDate: timestamp("sale_price_end_date"),
  
  // Google Shopping Physical Properties
  material: varchar("material", { length: 100 }).default("PVC"),
  weight: varchar("weight", { length: 20 }), // e.g., "2.5 kg"
  weightUnit: varchar("weight_unit", { length: 10 }).default("kg"),
  shippingLength: decimal("shipping_length", { precision: 10, scale: 2 }),
  shippingWidth: decimal("shipping_width", { precision: 10, scale: 2 }),
  shippingHeight: decimal("shipping_height", { precision: 10, scale: 2 }),
  shippingWeight: decimal("shipping_weight", { precision: 10, scale: 2 }),
  
  // Google Shopping Additional Attributes
  ageGroup: varchar("age_group", { length: 20 }), // adult, kids, toddler, infant, newborn
  gender: varchar("gender", { length: 20 }), // male, female, unisex
  itemGroupId: varchar("item_group_id", { length: 50 }), // For variants
  customLabel0: varchar("custom_label_0", { length: 100 }), // Custom grouping
  customLabel1: varchar("custom_label_1", { length: 100 }),
  customLabel2: varchar("custom_label_2", { length: 100 }),
  customLabel3: varchar("custom_label_3", { length: 100 }),
  customLabel4: varchar("custom_label_4", { length: 100 }),
  
  // Google Shopping Shipping
  shipping: jsonb("shipping"), // Array of shipping rules
  shippingLabel: varchar("shipping_label", { length: 100 }),
  minHandlingTime: integer("min_handling_time"), // Days
  maxHandlingTime: integer("max_handling_time"), // Days
  
  // Google Shopping Tax
  tax: jsonb("tax"), // Tax rules
  taxCategory: varchar("tax_category", { length: 100 }),
  
  // Additional Product Info
  energyEfficiencyClass: varchar("energy_efficiency_class", { length: 10 }), // A+++, A++, etc
  minEnergyEfficiencyClass: varchar("min_energy_efficiency_class", { length: 10 }),
  maxEnergyEfficiencyClass: varchar("max_energy_efficiency_class", { length: 10 }),
  
  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  urlSlug: varchar("url_slug", { length: 200 }),
  canonicalUrl: text("canonical_url"),
  
  // Product Highlights & Features
  highlights: jsonb("highlights"), // Array of product highlights
  technicalSpecs: jsonb("technical_specs"), // Technical specifications
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  isPrimary: boolean("is_primary").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(), // Changed to varchar
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Customer Info
  customerName: varchar("customer_name", { length: 200 }).notNull(),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerCpf: varchar("customer_cpf", { length: 20 }),
  
  // Billing Address
  billingAddress: text("billing_address").notNull(),
  billingCity: varchar("billing_city", { length: 100 }).notNull(),
  billingState: varchar("billing_state", { length: 50 }).notNull(),
  billingZipCode: varchar("billing_zip_code", { length: 20 }).notNull(),
  billingCountry: varchar("billing_country", { length: 2 }).notNull().default("BR"),
  
  // Shipping Address
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
  shippingState: varchar("shipping_state", { length: 50 }).notNull(),
  shippingZipCode: varchar("shipping_zip_code", { length: 20 }).notNull(),
  shippingCountry: varchar("shipping_country", { length: 2 }).notNull().default("BR"),
  
  // Order Details
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Payment Info
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: text("payment_status", { 
    enum: ["pending", "processing", "paid", "failed", "refunded", "cancelled"] 
  }).notNull().default("pending"),
  paymentId: varchar("payment_id", { length: 200 }),
  paidAt: timestamp("paid_at"),
  
  // Shipping Info
  shippingMethod: varchar("shipping_method", { length: 100 }),
  shippingTrackingCode: varchar("shipping_tracking_code", { length: 100 }),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  
  // Order Status
  status: text("status", { 
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] 
  }).notNull().default("pending"),
  customerType: text("customer_type", { enum: ["B2C", "B2B"] }).notNull().default("B2C"),
  
  // Additional Info
  notes: text("notes"),
  internalNotes: text("internal_notes"),
  couponCode: varchar("coupon_code", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  productSku: varchar("product_sku", { length: 50 }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minimumPurchase: decimal("minimum_purchase", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Shipping Zones
export const shippingZones = pgTable("shipping_zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  states: jsonb("states").notNull(), // Array of state codes
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shipping Methods
export const shippingMethods = pgTable("shipping_methods", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id").references(() => shippingZones.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  calculationType: text("calculation_type", { 
    enum: ["flat_rate", "per_item", "per_weight", "table_rate"] 
  }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  minDays: integer("min_days").notNull(),
  maxDays: integer("max_days").notNull(),
  maxWeight: decimal("max_weight", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product Reviews
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 200 }),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").notNull().default(false),
  helpfulCount: integer("helpful_count").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory Movement
export const inventoryMovements = pgTable("inventory_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  type: text("type", { 
    enum: ["purchase", "sale", "adjustment", "return", "damage"] 
  }).notNull(),
  quantity: integer("quantity").notNull(), // Positive for IN, negative for OUT
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reference: varchar("reference", { length: 100 }), // Order ID, adjustment reason, etc
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = insertProductSchema.partial();

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShippingZoneSchema = createInsertSchema(shippingZones).omit({
  id: true,
  createdAt: true,
});

export const insertShippingMethodSchema = createInsertSchema(shippingMethods).omit({
  id: true,
  createdAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  helpfulCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryMovementSchema = createInsertSchema(inventoryMovements).omit({
  id: true,
  createdAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type UpdateProduct = Partial<InsertProduct>;
export type Product = typeof products.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertShippingZone = typeof shippingZones.$inferInsert;
export type ShippingZone = typeof shippingZones.$inferSelect;
export type InsertShippingMethod = typeof shippingMethods.$inferInsert;
export type ShippingMethod = typeof shippingMethods.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;
export type ProductReview = typeof productReviews.$inferSelect;
export type InsertInventoryMovement = typeof inventoryMovements.$inferInsert;
export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
export type Setting = typeof settings.$inferSelect;

// Define relations

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
