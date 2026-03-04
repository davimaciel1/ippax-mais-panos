import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  try {
    console.log("🚀 Connecting to database...");
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log("📋 Creating tables...");
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(50),
        name TEXT NOT NULL,
        color VARCHAR(100),
        description TEXT,
        short_description TEXT,
        category TEXT NOT NULL,
        tone TEXT NOT NULL,
        discount INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(10,2) NOT NULL,
        dimensions TEXT NOT NULL DEFAULT '91cm x 15,2cm x 2mm',
        coverage_per_box DECIMAL(5,2) NOT NULL DEFAULT 1.25,
        stock INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        badge TEXT,
        badge_color TEXT,
        pattern TEXT,
        gtin VARCHAR(20),
        mpn VARCHAR(100),
        brand VARCHAR(100) DEFAULT 'IPPAX',
        condition VARCHAR(20) DEFAULT 'new',
        availability VARCHAR(50) DEFAULT 'in stock',
        google_category TEXT,
        product_type TEXT,
        material VARCHAR(100) DEFAULT 'PVC',
        weight VARCHAR(50),
        shipping_length DECIMAL(10,2),
        shipping_width DECIMAL(10,2),
        shipping_height DECIMAL(10,2),
        shipping_weight DECIMAL(10,2),
        unit VARCHAR(20) DEFAULT 'm²',
        item_group_id VARCHAR(100),
        custom_label_0 VARCHAR(100),
        custom_label_1 VARCHAR(100),
        custom_label_2 VARCHAR(100),
        custom_label_3 VARCHAR(100),
        custom_label_4 VARCHAR(100),
        sale_price VARCHAR(50),
        sale_price_start_date TIMESTAMP,
        sale_price_end_date TIMESTAMP,
        meta_title VARCHAR(255),
        meta_description TEXT,
        url_slug VARCHAR(255),
        highlights JSONB,
        technical_specs JSONB,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create product_images table
    await sql`
      CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt_text VARCHAR(255),
        "order" INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);
    `;

    console.log("✅ Tables created successfully!");

    // Note: Create admin user via secure process, not in migration
    console.log("✅ Database migration complete. Create admin user via secure CLI or environment variables.");

    // Insert some sample products
    await sql`
      INSERT INTO products (name, description, category, tone, price, stock, gtin, brand, availability)
      VALUES 
        ('Piso Vinílico Carvalho Clássico', 'Piso vinílico de alta qualidade com acabamento em carvalho clássico', 'Piso Vinílico', 'Claro', '89.90', 100, '7891234567890', 'IPPAX', 'in stock'),
        ('Piso Vinílico Nogueira Premium', 'Piso vinílico premium com textura de nogueira natural', 'Piso Vinílico', 'Escuro', '119.90', 50, '7891234567891', 'IPPAX', 'in stock'),
        ('Piso Vinílico Carvalho Rústico', 'Piso vinílico com acabamento rústico em carvalho envelhecido', 'Piso Vinílico', 'Médio', '99.90', 75, '7891234567892', 'IPPAX', 'in stock')
      ON CONFLICT DO NOTHING;
    `;

    console.log("✅ Sample products inserted!");
    console.log("🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

export { runMigration };