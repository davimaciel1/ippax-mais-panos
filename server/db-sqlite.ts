import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, products, marketplaceClicks, analyticsDaily, retargetingPixels, siteSettings } from "../shared/schema-sqlite";
import bcrypt from "bcryptjs";

// Create SQLite database file
const sqlite = new Database("./database.sqlite");

// Create drizzle instance
export const db = drizzle(sqlite);

// Initialize database with tables and default data
export async function initializeDatabase() {
  try {
    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create products table with all Google Shopping fields
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        short_description TEXT,
        category TEXT NOT NULL,
        subcategory TEXT,
        price TEXT NOT NULL,
        sale_price TEXT,
        sale_price_start_date TEXT,
        sale_price_end_date TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        is_featured INTEGER NOT NULL DEFAULT 0,
        
        -- Google Shopping fields
        gtin TEXT,
        mpn TEXT,
        brand TEXT DEFAULT 'IPPAX',
        condition TEXT DEFAULT 'new',
        availability TEXT DEFAULT 'in stock',
        google_category TEXT,
        product_type TEXT,
        
        -- Physical properties
        material TEXT DEFAULT 'PVC',
        color TEXT,
        weight TEXT,
        shipping_length REAL,
        shipping_width REAL,
        shipping_height REAL,
        shipping_weight REAL,
        unit TEXT DEFAULT 'm²',
        
        -- Additional attributes
        item_group_id TEXT,
        custom_label_0 TEXT,
        custom_label_1 TEXT,
        custom_label_2 TEXT,
        custom_label_3 TEXT,
        custom_label_4 TEXT,
        
        -- SEO
        meta_title TEXT,
        meta_description TEXT,
        url_slug TEXT,
        
        -- Features (stored as JSON strings)
        highlights TEXT,
        technical_specs TEXT,
        
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create marketplace_clicks table for analytics tracking
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS marketplace_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marketplace TEXT NOT NULL,
        product_id INTEGER REFERENCES products(id),
        product_name TEXT NOT NULL,
        user_id TEXT,
        ip_address TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        referrer TEXT,
        country TEXT,
        city TEXT,
        device TEXT,
        browser TEXT,
        os TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_content TEXT,
        utm_term TEXT,
        session_id TEXT,
        clicked_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create analytics_daily table for aggregated data
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS analytics_daily (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        product_id INTEGER,
        total_clicks INTEGER NOT NULL DEFAULT 0,
        unique_clicks INTEGER NOT NULL DEFAULT 0,
        mobile_clicks INTEGER NOT NULL DEFAULT 0,
        desktop_clicks INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, marketplace, product_id)
      );
    `);

    // Create retargeting_pixels table for tracking pixels management
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS retargeting_pixels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pixel_type TEXT NOT NULL,
        pixel_id TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        event_types TEXT,
        custom_code TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create site_settings table for general site configuration
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'string',
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better query performance
    sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_marketplace_clicks_marketplace ON marketplace_clicks(marketplace);
      CREATE INDEX IF NOT EXISTS idx_marketplace_clicks_product_id ON marketplace_clicks(product_id);
      CREATE INDEX IF NOT EXISTS idx_marketplace_clicks_clicked_at ON marketplace_clicks(clicked_at);
      CREATE INDEX IF NOT EXISTS idx_marketplace_clicks_session_id ON marketplace_clicks(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
      CREATE INDEX IF NOT EXISTS idx_analytics_daily_marketplace ON analytics_daily(marketplace);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
    `);

    // Admin user should be created via secure CLI or environment variables
    console.log("✅ Database initialized. Create admin user via secure process.");

    // Insert sample products if table is empty
    const productCount = sqlite.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
    
    if (productCount.count === 0) {
      const insertProduct = sqlite.prepare(`
        INSERT INTO products (
          name, description, short_description, category, subcategory, price, sale_price,
          stock, is_active, is_featured, gtin, mpn, brand, condition, availability,
          google_category, product_type, material, color, weight, unit,
          meta_title, meta_description, url_slug, highlights, technical_specs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const sampleProducts = [
        [
          "Piso Vinílico Carvalho Clássico",
          "Piso vinílico de alta qualidade com acabamento em carvalho clássico. Resistente a água e de fácil instalação.",
          "Piso vinílico carvalho clássico - resistente e elegante",
          "Piso Vinílico", "Carvalho", "89.90", "79.90",
          100, 1, 1, "7891234567890", "IPPAX-PVC-001", "IPPAX", "new", "in stock",
          "2826", "Piso Vinílico > Carvalho > Clássico", "PVC", "Carvalho Natural", "2.5kg", "m²",
          "Piso Vinílico Carvalho Clássico - IPPAX",
          "Piso vinílico de carvalho clássico com alta resistência. Ideal para ambientes residenciais e comerciais.",
          "piso-vinilico-carvalho-classico",
          JSON.stringify(["Resistente à água", "Fácil instalação", "Acabamento premium", "Garantia 10 anos"]),
          JSON.stringify({"Espessura": "4mm", "Classe de Uso": "32", "Resistência ao Fogo": "Bfl-s1", "Garantia": "10 anos"})
        ],
        [
          "Piso Vinílico Nogueira Premium",
          "Piso vinílico premium com textura de nogueira natural. Acabamento sofisticado para ambientes elegantes.",
          "Piso vinílico nogueira premium - sofisticação e qualidade",
          "Piso Vinílico", "Nogueira", "119.90", null,
          50, 1, 0, "7891234567891", "IPPAX-PVC-002", "IPPAX", "new", "in stock",
          "2826", "Piso Vinílico > Nogueira > Premium", "PVC", "Nogueira Escura", "2.8kg", "m²",
          "Piso Vinílico Nogueira Premium - IPPAX",
          "Piso vinílico premium de nogueira com textura natural. Perfeito para ambientes sofisticados.",
          "piso-vinilico-nogueira-premium",
          JSON.stringify(["Textura natural", "Alta durabilidade", "Antirrisco", "Design exclusivo"]),
          JSON.stringify({"Espessura": "5mm", "Classe de Uso": "33", "Resistência ao Fogo": "Bfl-s1", "Garantia": "15 anos"})
        ],
        [
          "Piso Vinílico Carvalho Rústico",
          "Piso vinílico com acabamento rústico em carvalho envelhecido. Ideal para ambientes que buscam charme e personalidade.",
          "Piso vinílico carvalho rústico - charme e autenticidade",
          "Piso Vinílico", "Carvalho", "99.90", null,
          75, 1, 0, "7891234567892", "IPPAX-PVC-003", "IPPAX", "new", "in stock",
          "2826", "Piso Vinílico > Carvalho > Rústico", "PVC", "Carvalho Envelhecido", "2.6kg", "m²",
          "Piso Vinílico Carvalho Rústico - IPPAX",
          "Piso vinílico rústico de carvalho envelhecido. Traz charme e personalidade aos ambientes.",
          "piso-vinilico-carvalho-rustico",
          JSON.stringify(["Acabamento rústico", "Visual autêntico", "Fácil manutenção", "Resistente"]),
          JSON.stringify({"Espessura": "4mm", "Classe de Uso": "31", "Resistência ao Fogo": "Bfl-s1", "Garantia": "10 anos"})
        ]
      ];

      sampleProducts.forEach(product => {
        insertProduct.run(...product);
      });

      console.log("✅ Sample products inserted into SQLite database");
    }

    // Insert default pixel settings if they don't exist
    const pixelCount = sqlite.prepare("SELECT COUNT(*) as count FROM retargeting_pixels").get() as { count: number };
    
    if (pixelCount.count === 0) {
      const insertPixel = sqlite.prepare(`
        INSERT INTO retargeting_pixels (pixel_type, pixel_id, is_active, event_types, custom_code)
        VALUES (?, ?, ?, ?, ?)
      `);

      const defaultPixels = [
        ['google_analytics', '', 0, JSON.stringify(['page_view', 'purchase', 'add_to_cart']), ''],
        ['meta_pixel', '', 0, JSON.stringify(['PageView', 'Purchase', 'AddToCart', 'ViewContent']), ''],
        ['uol_ads', '', 0, JSON.stringify(['page_view', 'conversion']), '']
      ];

      defaultPixels.forEach(pixel => {
        insertPixel.run(...pixel);
      });

      console.log("✅ Default pixel settings inserted");
    }

    // Insert default site settings
    const settingsCount = sqlite.prepare("SELECT COUNT(*) as count FROM site_settings").get() as { count: number };
    
    if (settingsCount.count === 0) {
      const insertSetting = sqlite.prepare(`
        INSERT INTO site_settings (key, value, type, description)
        VALUES (?, ?, ?, ?)
      `);

      const defaultSettings = [
        ['google_analytics_id', '', 'string', 'ID de medição do Google Analytics 4'],
        ['meta_pixel_id', '', 'string', 'ID do pixel do Meta/Facebook'],
        ['uol_ads_pixel_id', '', 'string', 'ID do pixel do UOL Ads'],
        ['site_name', 'IPPAX', 'string', 'Nome do site'],
        ['site_tagline', 'Pisos Vinílicos Premium', 'string', 'Slogan do site']
      ];

      defaultSettings.forEach(setting => {
        insertSetting.run(...setting);
      });

      console.log("✅ Default site settings inserted");
    }

    console.log("✅ SQLite database initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ SQLite database initialization failed:", error);
    return false;
  }
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    sqlite.exec("SELECT 1");
    console.log("✅ SQLite database connection successful");
    return true;
  } catch (error) {
    console.error("❌ SQLite database connection failed:", error);
    return false;
  }
}

// Export sqlite instance for direct queries if needed
export { sqlite };