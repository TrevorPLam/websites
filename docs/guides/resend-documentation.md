# resend-documentation.md

Resend is a modern email API platform that provides a developer-friendly interface for sending emails. This guide covers API integration, configuration patterns, and best practices for production use.

## Overview

Resend offers a simple API-first approach to email delivery with built-in analytics, templates, and webhook support. It focuses on developer experience with TypeScript support and modern tooling.

## Authentication

### API Key Authentication

Resend uses API keys for authentication:

```typescript
// Environment variables
RESEND_API_KEY = 're_xxxxxxxxxxxxxxxxxxxxxxxx';

// API client initialization
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

### Domain Verification

Before sending emails, verify your sending domain:

```typescript
// Verify domain configuration
async function verifyDomain() {
  const { data } = await resend.domains.list();

  return data.some((domain) => domain.name === 'yourdomain.com' && domain.status === 'verified');
}
```

## Core API Operations

### Sending Email

#### Basic Email Sending

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['delivered@resend.dev'],
  subject: 'Hello World',
  html: '<p>Congrats on sending your first email!</p>',
  text: 'Congrats on sending your first email!',
});
```

#### Template-Based Sending

```typescript
// Using Resend templates
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: ['user@example.com'],
  subject: 'Welcome to our service',
  template: 'welcome-template',
  variables: {
    name: 'John Doe',
    product_name: 'Awesome App',
    action_url: 'https://example.com/verify',
  },
});
```

#### Batch Sending

```typescript
const emails = [
  {
    from: 'noreply@yourdomain.com',
    to: ['user1@example.com'],
    subject: 'Your order is confirmed',
    html: '<p>Order #12345 has been confirmed.</p>',
  },
  {
    from: 'noreply@yourdomain.com',
    to: ['user2@example.com'],
    subject: 'Your order is confirmed',
    html: '<p>Order #12346 has been confirmed.</p>',
  },
];

// Send emails in parallel
const results = await Promise.all(emails.map((email) => resend.emails.send(email)));
```

## Configuration Patterns

### Environment Configuration

```typescript
// config/email.ts
export const emailConfig = {
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    from: process.env.EMAIL_FROM!,
    replyTo: process.env.EMAIL_REPLY_TO,
    defaultDomain: process.env.RESEND_DOMAIN!,
  },
};
```

### Email Service Wrapper

```typescript
// services/email.ts
import { Resend } from 'resend';
import { emailConfig } from '../config/email';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(emailConfig.resend.apiKey);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const { data, error } = await this.resend.emails.send({
      from: emailConfig.resend.from,
      to: [to],
      subject: 'Welcome to our service',
      html: this.getWelcomeTemplate(userName),
      text: `Welcome ${userName}!\n\nThank you for signing up.`,
    });

    if (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }

    return data;
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const { data, error } = await this.resend.emails.send({
      from: emailConfig.resend.from,
      to: [to],
      subject: 'Reset your password',
      html: this.getPasswordResetTemplate(resetLink),
      text: `Reset your password: ${resetLink}`,
    });

    if (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }

    return data;
  }

  private getWelcomeTemplate(name: string): string {
    return `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for signing up for our service.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      </p>
    `;
  }

  private getPasswordResetTemplate(resetLink: string): string {
    return `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="${resetLink}" 
           style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 1 hour.</p>
    `;
  }
}
```

## Template Management

### Creating Templates

```typescript
// services/templates.ts
export class TemplateService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async createWelcomeTemplate() {
    const { data, error } = await this.resend.templates.create({
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}',
      html: `
        <h1>Welcome, {{name}}!</h1>
        <p>Thank you for signing up for {{company_name}}.</p>
        <p>
          <a href="{{action_url}}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Get Started
          </a>
        </p>
      `,
      text: `
        Welcome, {{name}}!
        
        Thank you for signing up for {{company_name}}.
        
        Get Started: {{action_url}}
      `,
    });

    if (error) {
      throw new Error(`Template creation failed: ${error.message}`);
    }

    return data;
  }

  async updateTemplate(templateId: string, updates: any) {
    const { data, error } = await this.resend.templates.update(templateId, updates);

    if (error) {
      throw new Error(`Template update failed: ${error.message}`);
    }

    return data;
  }

  async listTemplates() {
    const { data, error } = await this.resend.templates.list();

    if (error) {
      throw new Error(`Template list failed: ${error.message}`);
    }

    return data;
  }
}
```

## Webhook Integration

### Webhook Handler

```typescript
// pages/api/webhooks/resend.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { Resend } from 'resend';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['resend-signature'] as string;
  const body = JSON.stringify(req.body);

  if (!verifyWebhookSignature(signature, body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    switch (event.type) {
      case 'email.sent':
        await handleEmailSent(event);
        break;
      case 'email.delivered':
        await handleEmailDelivered(event);
        break;
      case 'email.opened':
        await handleEmailOpened(event);
        break;
      case 'email.clicked':
        await handleEmailClicked(event);
        break;
      case 'email.bounced':
        await handleEmailBounced(event);
        break;
      case 'email.complained':
        await handleEmailComplained(event);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function verifyWebhookSignature(signature: string, body: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  return signature === expectedSignature;
}

async function handleEmailSent(event: any) {
  console.log(`Email sent: ${event.data.id}`);
  // Update database with sent status
}

async function handleEmailDelivered(event: any) {
  console.log(`Email delivered: ${event.data.id}`);
  // Update database with delivered status
}

async function handleEmailBounced(event: any) {
  console.log(`Email bounced: ${event.data.id}, reason: ${event.data.reason}`);
  // Handle bounced email - update user status
  if (event.data.reason === 'permanent') {
    await unsubscribeUser(event.data.to);
  }
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
// services/email.ts
export class EmailService {
  async sendEmailWithRetry(emailData: any, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await this.resend.emails.send(emailData);

        if (error) {
          throw new Error(`Resend API error: ${error.message}`);
        }

        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('rate limit')) {
          // Rate limit error - wait and retry
          if (attempt === maxRetries) {
            throw new Error(`Rate limit exceeded after ${maxRetries} attempts`);
          }
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        } else if (errorMessage.includes('validation')) {
          // Validation error - don't retry
          throw new Error(`Email validation failed: ${errorMessage}`);
        } else if (errorMessage.includes('server error')) {
          // Server error - retry
          if (attempt === maxRetries) {
            throw new Error(`Email delivery failed after ${maxRetries} attempts`);
          }
          await this.delay(Math.pow(2, attempt) * 1000);
        } else {
          // Other errors - don't retry
          throw error;
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## Security Considerations

### API Key Security

```typescript
// Secure API key validation
export function validateResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !apiKey.startsWith('re_')) {
    throw new Error('Invalid RESEND_API_KEY format');
  }

  if (apiKey.length !== 32) {
    throw new Error('Invalid RESEND_API_KEY length');
  }
}
```

### Input Validation

```typescript
// Email validation
export function validateEmailData(data: {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.from)) {
    throw new Error('Invalid sender email address');
  }

  for (const recipient of data.to) {
    if (!emailRegex.test(recipient)) {
      throw new Error(`Invalid recipient email: ${recipient}`);
    }
  }

  if (data.subject.length > 200) {
    throw new Error('Subject too long (max 200 characters)');
  }

  if (!data.html && !data.text) {
    throw new Error('Either html or text content must be provided');
  }

  // Check for HTML injection in text content
  if (data.text && /<[^>]*>/.test(data.text)) {
    throw new Error('HTML tags detected in text content');
  }
}
```

### Rate Limiting

```typescript
// Rate limiting implementation
export class RateLimitedEmailService extends EmailService {
  private lastSendTime = 0;
  private sendCount = 0;
  private readonly rateLimitWindow = 60000; // 1 minute
  private readonly maxSendsPerWindow = 100;

  async sendEmail(emailData: any) {
    const now = Date.now();

    // Reset counter if window has passed
    if (now - this.lastSendTime > this.rateLimitWindow) {
      this.sendCount = 0;
      this.lastSendTime = now;
    }

    // Check rate limit
    if (this.sendCount >= this.maxSendsPerWindow) {
      const waitTime = this.rateLimitWindow - (now - this.lastSendTime);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds`);
    }

    this.sendCount++;
    return super.sendEmail(emailData);
  }
}
```

## Testing Strategies

### Unit Testing with Mocks

```typescript
// __tests__/email.test.ts
import { EmailService } from '../services/email';
import { Resend } from 'resend';

// Mock Resend client
jest.mock('resend');
const mockResend = {
  emails: {
    send: jest.fn(),
    sendBatch: jest.fn(),
  },
} as any;

(Resend as jest.Mock).mockImplementation(() => mockResend);

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
    jest.clearAllMocks();
  });

  test('should send welcome email', async () => {
    const mockResponse = { id: 'test-id' };
    mockResend.emails.send.mockResolvedValue({ data: mockResponse, error: null });

    const result = await emailService.sendWelcomeEmail('test@example.com', 'John');

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      to: ['test@example.com'],
      subject: 'Welcome to our service',
      html: expect.stringContaining('Welcome, John!'),
      text: expect.stringContaining('Welcome John!'),
    });
    expect(result).toEqual(mockResponse);
  });

  test('should handle API errors gracefully', async () => {
    const mockError = { message: 'API Error' };
    mockResend.emails.send.mockResolvedValue({ data: null, error: mockError });

    await expect(emailService.sendWelcomeEmail('test@example.com', 'John')).rejects.toThrow(
      'Email send failed: API Error'
    );
  });
});
```

### Integration Testing

```typescript
// __tests__/email.integration.test.ts
import { EmailService } from '../services/email';

describe('EmailService Integration', () => {
  let emailService: EmailService;

  beforeAll(() => {
    emailService = new EmailService();
  });

  test('should send real email to test address', async () => {
    if (process.env.NODE_ENV !== 'test') {
      return; // Skip in non-test environments
    }

    const result = await emailService.sendEmail({
      from: 'test@yourdomain.com',
      to: ['test+integration@example.com'],
      subject: 'Integration Test',
      html: '<p>This is a test email</p>',
    });

    expect(result.id).toBeDefined();
  });
});
```

## Performance Optimization

### Connection Pooling

```typescript
// Optimized email service with connection reuse
export class OptimizedEmailService {
  private static instance: OptimizedEmailService;
  private resend: Resend;

  private constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  static getInstance(): OptimizedEmailService {
    if (!OptimizedEmailService.instance) {
      OptimizedEmailService.instance = new OptimizedEmailService();
    }
    return OptimizedEmailService.instance;
  }
}
```

### Batch Processing

```typescript
// Batch email processing for high volume
export async function processBulkEmails(emails: any[], batchSize = 100) {
  const results = [];

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    try {
      const batchPromises = batch.map((email) => emailService.sendEmail(email));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    } catch (error) {
      console.error(`Batch ${i / batchSize + 1} failed:`, error);
      // Handle failed batch
    }
  }

  return results;
}
```

## Monitoring and Analytics

### Email Analytics

```typescript
// Monitor email performance
export class EmailMonitor {
  async getEmailAnalytics() {
    const { data, error } = await resend.analytics.list({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
    });

    if (error) {
      throw new Error(`Analytics fetch failed: ${error.message}`);
    }

    return data;
  }

  async checkEmailHealth() {
    const analytics = await this.getEmailAnalytics();

    const metrics = {
      totalSent: analytics.reduce((sum, item) => sum + item.sent, 0),
      totalDelivered: analytics.reduce((sum, item) => sum + item.delivered, 0),
      totalOpened: analytics.reduce((sum, item) => sum + item.opened, 0),
      totalClicked: analytics.reduce((sum, item) => sum + item.clicked, 0),
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
    };

    metrics.deliveryRate = (metrics.totalDelivered / metrics.totalSent) * 100;
    metrics.openRate = (metrics.totalOpened / metrics.totalDelivered) * 100;
    metrics.clickRate = (metrics.totalClicked / metrics.totalOpened) * 100;

    if (metrics.deliveryRate < 95) {
      console.warn('Low delivery rate detected:', metrics.deliveryRate);
    }

    if (metrics.openRate < 20) {
      console.warn('Low open rate detected:', metrics.openRate);
    }

    return metrics;
  }
}
```

## Best Practices

1. **Use Templates**: Leverage Resend templates for consistent branding and easier updates
2. **Implement Webhooks**: Set up webhooks for real-time delivery status tracking
3. **Handle Bounces**: Implement proper bounce handling to maintain list hygiene
4. **Monitor Metrics**: Regularly check delivery rates, open rates, and click rates
5. **Validate Inputs**: Validate all email data before sending
6. **Secure API Keys**: Store API keys securely and rotate regularly
7. **Implement Rate Limiting**: Respect API rate limits to avoid throttling
8. **Test Thoroughly**: Use both unit and integration tests
9. **Use Environment Variables**: Never hardcode API keys or sensitive data
10. **Monitor Performance**: Track email delivery times and success rates

## References

- [Resend API Documentation](https://resend.com/docs/api-reference/introduction)
- [Resend Webhooks Guide](https://resend.com/docs/api-reference/webhooks)
- [Resend Templates](https://resend.com/docs/api-reference/templates)
- [Resend Best Practices](https://resend.com/docs/guides/getting-started)
- [Resend Error Codes](https://resend.com/docs/api-reference/error-codes)
