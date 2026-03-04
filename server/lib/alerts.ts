import nodemailer from 'nodemailer'
import { log } from './logger'

interface AlertConfig {
  email: {
    enabled: boolean
    smtp: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    from: string
    to: string[]
  }
  webhook: {
    enabled: boolean
    url: string
    secret?: string
  }
  thresholds: {
    errorRate: number // errors per minute
    responseTime: number // milliseconds
    memoryUsage: number // MB
    diskUsage: number // percentage
  }
}

class AlertManager {
  private config: AlertConfig
  private emailTransporter: nodemailer.Transporter | null = null
  private errorCounts: Map<string, number> = new Map()
  private lastCleanup = Date.now()

  constructor(config: AlertConfig) {
    this.config = config
    this.initializeEmailTransporter()
    
    // Cleanup error counts every 5 minutes
    setInterval(() => this.cleanupErrorCounts(), 5 * 60 * 1000)
  }

  private initializeEmailTransporter() {
    if (!this.config.email.enabled) return

    try {
      this.emailTransporter = nodemailer.createTransporter(this.config.email.smtp)
      
      // Verify connection
      this.emailTransporter.verify((error, success) => {
        if (error) {
          log.system.healthCheck('unhealthy', { 
            component: 'email_alerts',
            error: error.message 
          })
        } else {
          log.system.healthCheck('healthy', { 
            component: 'email_alerts',
            message: 'Email transporter ready' 
          })
        }
      })
    } catch (error) {
      log.api.error(error as Error, { context: 'email_transporter_init' })
    }
  }

  private cleanupErrorCounts() {
    const now = Date.now()
    const oneMinute = 60 * 1000

    // Remove error counts older than 1 minute
    for (const [key, timestamp] of this.errorCounts.entries()) {
      if (now - timestamp > oneMinute) {
        this.errorCounts.delete(key)
      }
    }
  }

  // Critical error alert (500 errors, database failures, etc.)
  async sendCriticalAlert(error: Error, context: any = {}) {
    const subject = `🚨 CRITICAL: ${error.message.substring(0, 50)}...`
    const body = this.formatErrorAlert(error, context, 'CRITICAL')
    
    await this.sendAlert(subject, body, 'critical')
    
    log.system.healthCheck('unhealthy', {
      type: 'critical_alert',
      error: error.message,
      context
    })
  }

  // High error rate alert
  async sendHighErrorRateAlert(errorRate: number, timeWindow: string) {
    const subject = `⚠️ HIGH ERROR RATE: ${errorRate} errors/${timeWindow}`
    const body = `
      <h2>High Error Rate Detected</h2>
      <p><strong>Error Rate:</strong> ${errorRate} errors per ${timeWindow}</p>
      <p><strong>Threshold:</strong> ${this.config.thresholds.errorRate} errors/minute</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Recommendation:</strong> Check application logs and investigate potential issues.</p>
    `
    
    await this.sendAlert(subject, body, 'warning')
  }

  // Performance degradation alert
  async sendPerformanceAlert(averageResponseTime: number) {
    const subject = `🐌 PERFORMANCE: Avg response time ${averageResponseTime}ms`
    const body = `
      <h2>Performance Degradation Detected</h2>
      <p><strong>Average Response Time:</strong> ${averageResponseTime}ms</p>
      <p><strong>Threshold:</strong> ${this.config.thresholds.responseTime}ms</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Memory Usage:</strong> ${this.getMemoryUsageString()}</p>
      <p><strong>Recommendation:</strong> Check for slow queries, high CPU usage, or memory leaks.</p>
    `
    
    await this.sendAlert(subject, body, 'warning')
  }

  // Security alert
  async sendSecurityAlert(description: string, details: any) {
    const subject = `🔒 SECURITY ALERT: ${description}`
    const body = `
      <h2>Security Alert</h2>
      <p><strong>Alert:</strong> ${description}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(details, null, 2)}</pre>
      <p><strong>Recommendation:</strong> Investigate immediately and consider blocking suspicious IPs.</p>
    `
    
    await this.sendAlert(subject, body, 'critical')
    
    log.security.suspiciousActivity(description, details.ip, details.userId)
  }

  // Service availability alert
  async sendServiceDownAlert(service: string, error?: string) {
    const subject = `💥 SERVICE DOWN: ${service}`
    const body = `
      <h2>Service Unavailable</h2>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      ${error ? `<p><strong>Error:</strong> ${error}</p>` : ''}
      <p><strong>Status:</strong> Service is not responding to health checks</p>
      <p><strong>Action Required:</strong> Immediate investigation needed</p>
    `
    
    await this.sendAlert(subject, body, 'critical')
  }

  // Database connection alert
  async sendDatabaseAlert(error: string, query?: string) {
    const subject = `🗄️ DATABASE ALERT: Connection issues`
    const body = `
      <h2>Database Connection Alert</h2>
      <p><strong>Error:</strong> ${error}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      ${query ? `<p><strong>Query:</strong> <code>${query.substring(0, 100)}...</code></p>` : ''}
      <p><strong>Recommendation:</strong> Check database connectivity and resource usage.</p>
    `
    
    await this.sendAlert(subject, body, 'critical')
  }

  // Rate limiting alert
  async sendRateLimitAlert(ip: string, endpoint: string, attempts: number) {
    const subject = `🚫 RATE LIMIT: ${attempts} attempts from ${ip}`
    const body = `
      <h2>Rate Limit Exceeded</h2>
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>Endpoint:</strong> ${endpoint}</p>
      <p><strong>Attempts:</strong> ${attempts}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Action:</strong> IP has been temporarily blocked</p>
    `
    
    await this.sendAlert(subject, body, 'warning')
  }

  private async sendAlert(subject: string, body: string, priority: 'critical' | 'warning' | 'info') {
    const promises: Promise<any>[] = []

    // Send email alert
    if (this.config.email.enabled && this.emailTransporter) {
      promises.push(this.sendEmailAlert(subject, body))
    }

    // Send webhook alert
    if (this.config.webhook.enabled) {
      promises.push(this.sendWebhookAlert(subject, body, priority))
    }

    // Wait for all alerts to be sent
    try {
      await Promise.allSettled(promises)
    } catch (error) {
      log.api.error(error as Error, { context: 'send_alert' })
    }
  }

  private async sendEmailAlert(subject: string, body: string) {
    if (!this.emailTransporter) return

    try {
      await this.emailTransporter.sendMail({
        from: this.config.email.from,
        to: this.config.email.to.join(', '),
        subject,
        html: this.wrapEmailBody(body)
      })

      log.system.healthCheck('healthy', { 
        type: 'email_alert_sent',
        subject: subject.substring(0, 50)
      })
    } catch (error) {
      log.api.error(error as Error, { context: 'send_email_alert' })
    }
  }

  private async sendWebhookAlert(subject: string, body: string, priority: string) {
    try {
      const payload = {
        subject,
        body,
        priority,
        timestamp: new Date().toISOString(),
        service: 'ippax-pisos'
      }

      const response = await fetch(this.config.webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.webhook.secret && {
            'Authorization': `Bearer ${this.config.webhook.secret}`
          })
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
      }

      log.system.healthCheck('healthy', { 
        type: 'webhook_alert_sent',
        subject: subject.substring(0, 50)
      })
    } catch (error) {
      log.api.error(error as Error, { context: 'send_webhook_alert' })
    }
  }

  private formatErrorAlert(error: Error, context: any, severity: string): string {
    return `
      <h2>${severity} Error Alert</h2>
      <p><strong>Error:</strong> ${error.message}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Stack Trace:</strong></p>
      <pre>${error.stack}</pre>
      <p><strong>Context:</strong></p>
      <pre>${JSON.stringify(context, null, 2)}</pre>
      <p><strong>System Info:</strong></p>
      <ul>
        <li>Memory Usage: ${this.getMemoryUsageString()}</li>
        <li>Uptime: ${Math.floor(process.uptime())}s</li>
        <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
      </ul>
    `
  }

  private wrapEmailBody(body: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .alert { background: #f8f9fa; padding: 20px; border-left: 4px solid #dc3545; }
          pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
          .header { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="alert">
          <h1 class="header">IPPAX Pisos - System Alert</h1>
          ${body}
          <hr>
          <p><small>This alert was generated automatically by the IPPAX monitoring system.</small></p>
        </div>
      </body>
      </html>
    `
  }

  private getMemoryUsageString(): string {
    const usage = process.memoryUsage()
    return `${Math.round(usage.heapUsed / 1024 / 1024)}MB / ${Math.round(usage.heapTotal / 1024 / 1024)}MB`
  }

  // Method to check if we should send an alert (to avoid spam)
  shouldSendAlert(alertType: string): boolean {
    const key = `alert_${alertType}_${Date.now() - (Date.now() % (5 * 60 * 1000))}` // 5-minute window
    const count = this.errorCounts.get(key) || 0
    
    if (count < 3) { // Max 3 alerts of same type per 5 minutes
      this.errorCounts.set(key, count + 1)
      return true
    }
    
    return false
  }
}

// Export a singleton instance
const alertConfig: AlertConfig = {
  email: {
    enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: process.env.ALERT_FROM_EMAIL || 'alerts@ippaxpisos.com',
    to: (process.env.ALERT_TO_EMAILS || '').split(',').filter(Boolean)
  },
  webhook: {
    enabled: process.env.ALERT_WEBHOOK_ENABLED === 'true',
    url: process.env.ALERT_WEBHOOK_URL || '',
    secret: process.env.ALERT_WEBHOOK_SECRET
  },
  thresholds: {
    errorRate: parseInt(process.env.ALERT_ERROR_RATE_THRESHOLD || '10'),
    responseTime: parseInt(process.env.ALERT_RESPONSE_TIME_THRESHOLD || '2000'),
    memoryUsage: parseInt(process.env.ALERT_MEMORY_THRESHOLD || '500'),
    diskUsage: parseInt(process.env.ALERT_DISK_THRESHOLD || '90')
  }
}

export const alertManager = new AlertManager(alertConfig)
export default alertManager
