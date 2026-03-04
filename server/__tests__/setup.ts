import { beforeAll, afterAll, beforeEach } from 'vitest'
import { execSync } from 'child_process'

// Test database setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'file:./test.db'
  process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long'
  process.env.SESSION_SECRET = 'test-session-secret-minimum-32-characters-long'
  
  // Run migrations for test database
  try {
    execSync('npm run migrate', { stdio: 'pipe' })
  } catch (error) {
    console.warn('Migration may have failed, but continuing with tests')
  }
})

beforeEach(async () => {
  // Clear test data before each test
  const { Database } = await import('better-sqlite3')
  const db = new Database('./test.db')
  
  try {
    // Clear all tables
    db.exec(`
      DELETE FROM products;
      DELETE FROM users;
      DELETE FROM orders;
      DELETE FROM order_items;
      DELETE FROM analytics_events;
    `)
  } catch (error) {
    // Tables might not exist yet, that's ok
  } finally {
    db.close()
  }
})

afterAll(async () => {
  // Clean up test database
  try {
    const fs = await import('fs')
    if (fs.existsSync('./test.db')) {
      fs.unlinkSync('./test.db')
    }
  } catch (error) {
    console.warn('Failed to cleanup test database')
  }
})
