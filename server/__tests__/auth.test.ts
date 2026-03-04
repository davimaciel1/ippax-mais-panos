import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'

// Mock database setup
let app: express.Application
let db: Database

beforeEach(async () => {
  // Setup test database
  db = new Database(':memory:')
  
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Setup express app with auth routes
  app = express()
  app.use(express.json())
  
  // Mock auth routes (simplified version)
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body
    
    try {
      // Basic validation
      if (!email || !password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Email and password (min 6 chars) are required'
        })
      }

      // Check if user already exists
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Insert user
      const result = db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `).run(name, email, hashedPassword, 'user')
      
      const user = {
        id: result.lastInsertRowid,
        name,
        email,
        role: 'user'
      }

      // Mock JWT token (in real implementation, use actual JWT)
      const token = `mock-token-${user.id}`

      res.status(201).json({
        success: true,
        token,
        user
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    
    try {
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        })
      }

      // Find user
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // Mock JWT token
      const token = `mock-token-${user.id}`

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      })
    }
  })
})

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe('test@example.com')
      expect(response.body.user.name).toBe('Test User')
      expect(response.body.token).toBeDefined()
      expect(response.body.user.password).toBeUndefined()
    })

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('min 6 chars')
    })

    it('should reject registration with duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'test@example.com',
          password: 'password123'
        })

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'test@example.com',
          password: 'password456'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })

    it('should reject registration without email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          password: 'password123'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const hashedPassword = await bcrypt.hash('password123', 12)
      db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `).run('Test User', 'test@example.com', hashedPassword, 'user')
    })

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe('test@example.com')
      expect(response.body.token).toBeDefined()
    })

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login without email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('Security', () => {
    it('should hash passwords properly', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'security@example.com',
          password: 'password123'
        })

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get('security@example.com') as any
      expect(user.password).not.toBe('password123')
      expect(user.password).toMatch(/^\$2[ab]\$/)
    })

    it('should not expose password in response', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.body.user.password).toBeUndefined()
    })
  })
})
