import winston from 'winston'
import path from 'path'

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

// Define colors for each level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'cyan'
}

winston.addColors(logColors)

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info
    
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` | Meta: ${JSON.stringify(meta, null, 2)}`
    }
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`
    }
    
    return log
  })
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack } = info
    let log = `${timestamp} ${level}: ${message}`
    
    if (stack && process.env.NODE_ENV === 'development') {
      log += `\n${stack}`
    }
    
    return log
  })
)

// Create transports array
const transports: winston.transport[] = []

// Console transport (always enabled in development)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  )
}

// File transports for production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
  
  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
  
  // Console for production (only errors and warnings)
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'warn'
    })
  )
}

// Create the logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      format: logFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      format: logFormat
    })
  ],
  exitOnError: false
})

// Logging methods with specific contexts
export const log = {
  // Security related logs
  security: {
    loginAttempt: (email: string, success: boolean, ip?: string) => {
      logger.info('Login attempt', {
        type: 'auth',
        email,
        success,
        ip,
        timestamp: new Date().toISOString()
      })
    },
    
    authFailure: (email: string, reason: string, ip?: string) => {
      logger.warn('Authentication failure', {
        type: 'auth_failure',
        email,
        reason,
        ip,
        timestamp: new Date().toISOString()
      })
    },
    
    suspiciousActivity: (description: string, ip?: string, userId?: number) => {
      logger.error('Suspicious activity detected', {
        type: 'security_alert',
        description,
        ip,
        userId,
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // API related logs
  api: {
    request: (method: string, url: string, statusCode: number, responseTime: number, ip?: string) => {
      logger.http('API Request', {
        type: 'api_request',
        method,
        url,
        statusCode,
        responseTime: `${responseTime}ms`,
        ip,
        timestamp: new Date().toISOString()
      })
    },
    
    error: (error: Error, context: { method?: string; url?: string; userId?: number }) => {
      logger.error('API Error', {
        type: 'api_error',
        error: error.message,
        stack: error.stack,
        ...context,
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // Database related logs
  database: {
    query: (query: string, duration: number, success: boolean) => {
      logger.debug('Database Query', {
        type: 'db_query',
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        success,
        timestamp: new Date().toISOString()
      })
    },
    
    error: (error: Error, query?: string) => {
      logger.error('Database Error', {
        type: 'db_error',
        error: error.message,
        query: query?.substring(0, 100),
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    },
    
    migration: (version: string, success: boolean, duration?: number) => {
      logger.info('Database Migration', {
        type: 'db_migration',
        version,
        success,
        duration: duration ? `${duration}ms` : undefined,
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // Business logic logs
  business: {
    orderCreated: (orderId: string, userId: number, total: number) => {
      logger.info('Order created', {
        type: 'order_created',
        orderId,
        userId,
        total,
        timestamp: new Date().toISOString()
      })
    },
    
    paymentProcessed: (orderId: string, amount: number, method: string, success: boolean) => {
      logger.info('Payment processed', {
        type: 'payment',
        orderId,
        amount,
        method,
        success,
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // System logs
  system: {
    startup: (service: string, port?: number) => {
      logger.info('Service started', {
        type: 'system_startup',
        service,
        port,
        timestamp: new Date().toISOString()
      })
    },
    
    shutdown: (service: string) => {
      logger.info('Service shutdown', {
        type: 'system_shutdown',
        service,
        timestamp: new Date().toISOString()
      })
    },
    
    healthCheck: (status: 'healthy' | 'unhealthy', details?: object) => {
      logger.info('Health check', {
        type: 'health_check',
        status,
        details,
        timestamp: new Date().toISOString()
      })
    }
  },
  
  // Performance logs
  performance: {
    slowQuery: (query: string, duration: number) => {
      logger.warn('Slow query detected', {
        type: 'performance_slow_query',
        query: query.substring(0, 100),
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      })
    },
    
    memoryUsage: (usage: NodeJS.MemoryUsage) => {
      logger.debug('Memory usage', {
        type: 'performance_memory',
        usage: {
          rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(usage.external / 1024 / 1024)}MB`
        },
        timestamp: new Date().toISOString()
      })
    }
  }
}

// Export the base logger for direct use
export default logger

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs'
try {
  mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true })
} catch (error) {
  // Directory might already exist
}
