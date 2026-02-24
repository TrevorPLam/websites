/**
 * Multi-Tenant Email System
 * Client routing, unified send function, and template management
 */

import { z } from 'zod';
import { Transporter, createTransport } from 'nodemailer';
import { randomUUID } from 'crypto';

// Email configuration schemas
export const TenantEmailConfigSchema = z.object({
  tenantId: z.string().uuid(),
  provider: z.enum(['smtp', 'sendgrid', 'resend', 'ses']),
  settings: z.object({
    smtp: z
      .object({
        host: z.string(),
        port: z.number(),
        secure: z.boolean(),
        auth: z.object({
          user: z.string(),
          pass: z.string(),
        }),
      })
      .optional(),
    sendgrid: z
      .object({
        apiKey: z.string(),
        from: z.object({
          email: z.string().email(),
          name: z.string(),
        }),
      })
      .optional(),
    resend: z
      .object({
        apiKey: z.string(),
        from: z.string().email(),
      })
      .optional(),
    ses: z
      .object({
        region: z.string(),
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
        from: z.string().email(),
      })
      .optional(),
  }),
  branding: z.object({
    logo: z.string().url().optional(),
    primaryColor: z.string(),
    footerText: z.string(),
    unsubscribeUrl: z.string().url(),
  }),
  limits: z.object({
    dailyLimit: z.number().default(1000),
    hourlyLimit: z.number().default(100),
    perMinuteLimit: z.number().default(10),
  }),
});

export type TenantEmailConfig = z.infer<typeof TenantEmailConfigSchema>;

// Email message schema
export const EmailMessageSchema = z.object({
  tenantId: z.string().uuid(),
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string(),
  template: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.union([z.string(), z.any()]),
        contentType: z.string().optional(),
      })
    )
    .optional(),
  headers: z.record(z.string()).optional(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  trackOpens: z.boolean().default(true),
  trackClicks: z.boolean().default(true),
});

export type EmailMessage = z.infer<typeof EmailMessageSchema>;

// Email delivery status
export interface EmailDeliveryStatus {
  id: string;
  messageId: string;
  tenantId: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  provider: string;
  providerMessageId?: string;
  error?: string;
  timestamp: Date;
  deliveryAttempts: number;
  lastDeliveryAttempt: Date;
}

/**
 * Multi-tenant Email Client
 */
export class MultiTenantEmailClient {
  private configs = new Map<string, TenantEmailConfig>();
  private transports = new Map<string, Transporter>();
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  addTenantConfig(config: TenantEmailConfig): void {
    this.configs.set(config.tenantId, config);
    this.createTransport(config);
  }

  removeTenantConfig(tenantId: string): void {
    this.configs.delete(tenantId);
    this.transports.delete(tenantId);
    this.rateLimits.delete(tenantId);
  }

  private createTransport(config: TenantEmailConfig): void {
    let transport: Transporter;

    switch (config.provider) {
      case 'smtp':
        if (!config.settings.smtp) {
          throw new Error('SMTP settings required for SMTP provider');
        }
        transport = createTransport({
          host: config.settings.smtp.host,
          port: config.settings.smtp.port,
          secure: config.settings.smtp.secure,
          auth: config.settings.smtp.auth,
        });
        break;

      case 'sendgrid':
        // SendGrid transport implementation
        transport = createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: config.settings.sendgrid?.apiKey || '',
          },
        });
        break;

      case 'resend':
        // Resend transport implementation
        transport = createTransport({
          host: 'smtp.resend.com',
          port: 587,
          secure: false,
          auth: {
            user: 'resend',
            pass: config.settings.resend?.apiKey || '',
          },
        });
        break;

      case 'ses':
        // AWS SES transport implementation
        transport = createTransport({
          host: `email.${config.settings.ses?.region}.amazonaws.com`,
          port: 587,
          secure: false,
          auth: {
            user: config.settings.ses?.accessKeyId || '',
            pass: config.settings.ses?.secretAccessKey || '',
          },
        });
        break;

      default:
        throw new Error(`Unsupported email provider: ${config.provider}`);
    }

    this.transports.set(config.tenantId, transport);
  }

  private checkRateLimit(tenantId: string): boolean {
    const config = this.configs.get(tenantId);
    if (!config) return false;

    const now = Date.now();
    const rateLimit = this.rateLimits.get(tenantId);

    if (!rateLimit || now > rateLimit.resetTime) {
      // Reset or initialize rate limit
      this.rateLimits.set(tenantId, {
        count: 1,
        resetTime: now + 60000, // 1 minute from now
      });
      return true;
    }

    if (rateLimit.count >= config.limits.perMinuteLimit) {
      return false; // Rate limit exceeded
    }

    rateLimit.count++;
    return true;
  }

  async sendEmail(message: EmailMessage): Promise<EmailDeliveryStatus> {
    const config = this.configs.get(message.tenantId);
    const transport = this.transports.get(message.tenantId);

    if (!config || !transport) {
      throw new Error(`No email configuration found for tenant: ${message.tenantId}`);
    }

    if (!this.checkRateLimit(message.tenantId)) {
      throw new Error(`Rate limit exceeded for tenant: ${message.tenantId}`);
    }

    try {
      const mailOptions = {
        from: this.getFromAddress(config),
        to: message.to.join(', '),
        cc: message.cc?.join(', '),
        bcc: message.bcc?.join(', '),
        subject: this.applyBranding(message.subject, config),
        html: message.html,
        text: message.text,
        attachments: message.attachments,
        headers: {
          ...message.headers,
          'X-Tenant-ID': message.tenantId,
          'X-Priority': message.priority,
        },
      };

      const result = await transport.sendMail(mailOptions);

      return {
        id: randomUUID(),
        messageId: (result as any).messageId || '',
        tenantId: message.tenantId,
        status: 'sent',
        provider: config.provider,
        providerMessageId: (result as any).messageId,
        timestamp: new Date(),
        deliveryAttempts: 1,
        lastDeliveryAttempt: new Date(),
      };
    } catch (error) {
      return {
        id: randomUUID(),
        messageId: '',
        tenantId: message.tenantId,
        status: 'failed',
        provider: config.provider,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        deliveryAttempts: 1,
        lastDeliveryAttempt: new Date(),
      };
    }
  }

  private getFromAddress(config: TenantEmailConfig): string {
    switch (config.provider) {
      case 'sendgrid':
        return `${config.settings.sendgrid?.from.name} <${config.settings.sendgrid?.from.email}>`;
      case 'resend':
        return config.settings.resend?.from || '';
      case 'ses':
        return config.settings.ses?.from || '';
      case 'smtp':
      default:
        return config.settings.smtp?.auth.user || '';
    }
  }

  private applyBranding(_subject: string, _config: TenantEmailConfig): string {
    // Apply any subject branding logic here
    return _subject;
  }

  async getDeliveryStatus(_messageId: string): Promise<EmailDeliveryStatus | null> {
    // This would typically query a database for delivery status
    // For now, return a placeholder implementation
    return null;
  }
}

/**
 * Unified Send Function
 */
export class UnifiedEmailSender {
  private client: MultiTenantEmailClient;

  constructor(client: MultiTenantEmailClient) {
    this.client = client;
  }

  async sendLeadNotification(
    tenantId: string,
    leadData: {
      name: string;
      email: string;
      phone?: string;
      message?: string;
      source: string;
    }
  ): Promise<EmailDeliveryStatus> {
    const message: EmailMessage = {
      tenantId,
      to: ['notifications@company.com'], // Would be tenant-specific
      subject: `New Lead: ${leadData.name}`,
      template: 'lead-notification',
      templateData: leadData,
      priority: 'high',
    };

    return this.client.sendEmail(message);
  }

  async sendWelcomeEmail(
    tenantId: string,
    recipientEmail: string,
    recipientName: string
  ): Promise<EmailDeliveryStatus> {
    const message: EmailMessage = {
      tenantId,
      to: [recipientEmail],
      subject: 'Welcome to Our Service',
      template: 'welcome-email',
      templateData: { name: recipientName },
      priority: 'normal',
    };

    return this.client.sendEmail(message);
  }

  async sendNewsletter(
    tenantId: string,
    recipients: string[],
    subject: string,
    content: string
  ): Promise<EmailDeliveryStatus> {
    const message: EmailMessage = {
      tenantId,
      to: recipients,
      subject,
      html: content,
      priority: 'low',
    };

    return this.client.sendEmail(message);
  }
}

/**
 * Email Template System
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category: 'marketing' | 'transactional' | 'notification';
}

export class EmailTemplateManager {
  private templates = new Map<string, EmailTemplate>();

  addTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): EmailTemplate | null {
    return this.templates.get(id) || null;
  }

  renderTemplate(templateId: string, data: Record<string, any>): { html?: string; text?: string } {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const rendered: { html?: string; text?: string } = {};

    if (template.htmlTemplate) {
      rendered.html = this.processTemplate(template.htmlTemplate, data);
    }

    if (template.textTemplate) {
      rendered.text = this.processTemplate(template.textTemplate, data);
    }

    return rendered;
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    // Simple template processing - replace {{variable}} with data
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  listTemplates(category?: EmailTemplate['category']): EmailTemplate[] {
    const templates = Array.from(this.templates.values());
    return category ? templates.filter((t) => t.category === category) : templates;
  }
}

// Validation functions
export function validateTenantEmailConfig(config: unknown): TenantEmailConfig {
  return TenantEmailConfigSchema.parse(config);
}

export function validateEmailMessage(message: unknown): EmailMessage {
  return EmailMessageSchema.parse(message);
}

// Utility functions
export function createEmailClient(): MultiTenantEmailClient {
  return new MultiTenantEmailClient();
}

export function createUnifiedSender(client: MultiTenantEmailClient): UnifiedEmailSender {
  return new UnifiedEmailSender(client);
}

export function createTemplateManager(): EmailTemplateManager {
  return new EmailTemplateManager();
}
