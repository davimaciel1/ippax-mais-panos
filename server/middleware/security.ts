import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { doubleCsrf } from 'csrf-csrf';
import winston from 'winston';

// Initialize CSRF protection
const { generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.SESSION_SECRET || '',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'] as string
});

// Security logger configuration
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.File({ filename: 'logs/security-error.log', level: 'error' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  securityLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Rate limiting configurations
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    securityLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('user-agent')
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per 15 minutes
  message: 'Too many upload attempts, please try again later'
});

// Input validation middleware
export const validateInput = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    securityLogger.warn('Input validation failed', {
      ip: req.ip,
      path: req.path,
      errors: errors.array()
    });

    res.status(400).json({ 
      error: 'Validation failed',
      errors: errors.array() 
    });
  };
};

// Common validation rules
export const validationRules = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  password: body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Name must be 2-100 characters and contain only letters'),
  
  phone: body('phone')
    .optional()
    .matches(/^[\d\s()+-]+$/)
    .withMessage('Invalid phone number format'),
  
  sanitizeHtml: body('*')
    .customSanitizer(value => {
      if (typeof value === 'string') {
        // Remove any HTML tags and script content
        return value.replace(/<[^>]*>?/gm, '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      return value;
    })
};

// SQL injection prevention middleware
export const preventSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\||;|\/\*|\*\/|xp_|sp_|0x)/gi,
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s*\d+\s*=\s*\d+)/gi
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };

  const checkObject = (obj: any): boolean => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (checkValue(value) || (typeof value === 'object' && checkObject(value))) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    securityLogger.error('Potential SQL injection attempt', {
      ip: req.ip,
      path: req.path,
      body: req.body,
      query: req.query,
      params: req.params
    });
    
    return res.status(400).json({
      error: 'Invalid input detected',
      message: 'Your request contains potentially harmful content'
    });
  }

  next();
};

// XSS prevention middleware
export const preventXSS = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<embed/gi,
    /<object/gi
  ];

  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      let sanitized = value;
      xssPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      return sanitized;
    } else if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          sanitized[key] = sanitizeValue(value[key]);
        }
      }
      return sanitized;
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  
  next();
};

// Security monitoring middleware
export const securityMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log request
  securityLogger.info('Request received', {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });

  // Monitor response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      securityLogger.warn('Request failed', {
        ip: req.ip,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString()
      });
    }
    
    // Alert on suspicious activity
    if (res.statusCode === 401 || res.statusCode === 403) {
      securityLogger.error('Unauthorized access attempt', {
        ip: req.ip,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
    }
  });

  next();
};

// Export CSRF middleware
export { doubleCsrfProtection, generateToken };

// Combined security middleware for easy application
export const applySecurityMiddleware = [
  securityMonitoring,
  preventXSS,
  preventSQLInjection
];

export default {
  authRateLimiter,
  apiRateLimiter,
  uploadRateLimiter,
  validateInput,
  validationRules,
  preventSQLInjection,
  preventXSS,
  securityMonitoring,
  doubleCsrfProtection,
  generateToken,
  applySecurityMiddleware,
  securityLogger
};