import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!dbInstance) {
    // Create neon client
    const sql = neon(process.env.DATABASE_URL);
    // Create drizzle instance
    dbInstance = drizzle(sql, { schema });
  }
  
  return dbInstance;
}

// Export a getter function for the database instance
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = initializeDb();
    return instance[prop as keyof typeof instance];
  }
});

// Test connection
export async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is required");
      return false;
    }
    
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}