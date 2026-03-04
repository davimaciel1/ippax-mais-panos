import { Request, Response, NextFunction } from 'express'
import { log } from '../lib/logger'

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
  code?: string
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  // Get client IP
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
  
  // Log when request finishes
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    const { method, originalUrl } = req
    const { statusCode } = res
    
    log.api.request(method, originalUrl, statusCode, responseTime, ip)
    
    // Log slow requests
    if (responseTime > 1000) {
      log.performance.slowQuery(`${method} ${originalUrl}`, responseTime)
    }
  })
  
  next()
}

// Error handling middleware
export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get client IP
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
  
  // Determine status code
  const statusCode = err.status || err.statusCode || 500
  
  // Log the error with context
  log.api.error(err, {
    method: req.method,
    url: req.originalUrl,
    userId: (req as any).user?.id,
    ip,
    body: req.method !== 'GET' ? req.body : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    userAgent: req.headers['user-agent']
  })
  
  // Don't expose internal error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? getPublicErrorMessage(statusCode)
    : err.message || 'Internal server error'
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    },
    // Include stack trace only in development
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err 
    })
  })
}

// Handle unhandled routes
export const notFoundHandler = (req: Request, res: Response) => {
  const message = `Route ${req.originalUrl} not found`
  
  log.api.error(new Error(message), {
    method: req.method,
    url: req.originalUrl,
    type: 'NOT_FOUND'
  })
  
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    }
  })
}

// Security monitoring middleware
export const securityMonitor = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.headers['user-agent'] || ''
  const url = req.originalUrl
  
  // Detect suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /javascript:/i, // XSS
    /\bor\s+1=1/i, // SQL injection
    /\bphp\b/i, // PHP injection attempts
    /\bcmd\b/i // Command injection
  ]
  
  // Check URL and query parameters for suspicious content
  const queryString = JSON.stringify(req.query).toLowerCase()
  const bodyString = JSON.stringify(req.body || {}).toLowerCase()
  const fullContent = `${url} ${queryString} ${bodyString}`.toLowerCase()
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullContent)) {
      log.security.suspiciousActivity(
        `Suspicious pattern detected: ${pattern.source}`,
        ip,
        (req as any).user?.id
      )
      
      // You could optionally block the request here
      // return res.status(403).json({ error: 'Forbidden' })
      break
    }
  }
  
  // Monitor for brute force attempts
  if (req.path.includes('/login') && req.method === 'POST') {
    // This would integrate with a rate limiting service
    // For now, just log the attempt
    log.security.loginAttempt(
      req.body.email || 'unknown',
      false, // We don't know yet if it succeeded
      ip
    )
  }
  
  next()
}

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime()
  const startMemory = process.memoryUsage()
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const milliseconds = seconds * 1000 + nanoseconds / 1e6
    
    const endMemory = process.memoryUsage()
    const memoryDiff = {
      rss: endMemory.rss - startMemory.rss,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      external: endMemory.external - startMemory.external
    }
    
    // Log performance metrics for slow requests
    if (milliseconds > 500) {
      log.performance.slowQuery(
        `${req.method} ${req.originalUrl}`,
        Math.round(milliseconds)
      )
    }
    
    // Log memory usage spikes
    if (Math.abs(memoryDiff.heapUsed) > 50 * 1024 * 1024) { // 50MB
      log.performance.memoryUsage(endMemory)
    }
  })
  
  next()
}

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage()
  const uptime = process.uptime()
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    environment: process.env.NODE_ENV || 'development'
  }
  
  log.system.healthCheck('healthy', health)
  
  res.json(health)
}

// Database health check
export const databaseHealthCheck = async (req: Request, res: Response) => {
  try {
    // This would be replaced with actual database connection check
    // For now, we'll simulate it
    const startTime = Date.now()
    
    // Simulate database ping
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const responseTime = Date.now() - startTime
    
    log.database.query('PING', responseTime, true)
    
    res.json({
      status: 'healthy',
      database: {
        connected: true,
        responseTime: `${responseTime}ms`
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const err = error as Error
    log.database.error(err, 'Health check query')
    
    res.status(503).json({
      status: 'unhealthy',
      database: {
        connected: false,
        error: err.message
      },
      timestamp: new Date().toISOString()
    })
  }
}

// Utility functions
function getPublicErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Bad request'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Not found'
    case 422:
      return 'Validation error'
    case 429:
      return 'Too many requests'
    case 500:
      return 'Internal server error'
    case 502:
      return 'Bad gateway'
    case 503:
      return 'Service unavailable'
    default:
      return 'An error occurred'
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Export all middleware
export default {
  requestLogger,
  errorHandler,
  notFoundHandler,
  securityMonitor,
  performanceMonitor,
  healthCheck,
  databaseHealthCheck
}
