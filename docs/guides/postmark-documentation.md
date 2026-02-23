<!--
/**
 * @file postmark-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for postmark documentation.
 * @entrypoints docs/guides/postmark-documentation.md
 * @exports postmark documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# postmark-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


Postmark is a transactional email delivery service that provides reliable email delivery for applications. This guide covers API integration, configuration patterns, and best practices for production use.

## Overview

Postmark specializes in transactional emails (password resets, receipts, notifications) with high deliverability rates and detailed analytics. The service provides REST APIs, SMTP relay, and comprehensive webhook support.

## Authentication

### API Key Authentication

Postmark uses server API tokens for authentication:

```typescript
// Environment variables
POSTMARK_SERVER_API_TOKEN = 'server-xxxxxxxxxxxxxxxxxxxxxxxx';

// API client initialization
import postmark from 'postmark';

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);
```

### Account API Token

For account management operations:

```typescript
const accountClient = new postmark.AccountClient(process.env.POSTMARK_ACCOUNT_API_TOKEN);
```

## Core API Operations

### Sending Email

#### Basic Email Sending

```typescript
import postmark from 'postmark';

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

await client.sendEmail({
  From: 'sender@example.com',
  To: 'recipient@example.com',
  Subject: 'Welcome to our service',
  HtmlBody: '<h1>Welcome!</h1><p>Thank you for signing up.</p>',
  TextBody: 'Welcome!\n\nThank you for signing up.',
  MessageStream: 'outbound',
});
```

#### Template-Based Sending

```typescript
// Using Postmark templates
await client.sendEmailWithTemplate({
  From: 'sender@example.com',
  To: 'recipient@example.com',
  TemplateId: 123456,
  TemplateModel: {
    name: 'John Doe',
    product_name: 'Awesome App',
    action_url: 'https://example.com/verify',
  },
  MessageStream: 'outbound',
});
```

#### Batch Sending

```typescript
const emails = [
  {
    From: 'sender@example.com',
    To: 'user1@example.com',
    Subject: 'Your order is confirmed',
    HtmlBody: '<p>Order #12345 has been confirmed.</p>',
  },
  {
    From: 'sender@example.com',
    To: 'user2@example.com',
    Subject: 'Your order is confirmed',
    HtmlBody: '<p>Order #12346 has been confirmed.</p>',
  },
];

const responses = await client.sendEmailBatch(emails);
```

## Configuration Patterns

### Environment Configuration

```typescript
// config/email.ts
export const emailConfig = {
  postmark: {
    serverToken: process.env.POSTMARK_SERVER_API_TOKEN!,
    accountToken: process.env.POSTMARK_ACCOUNT_API_TOKEN,
    from: process.env.EMAIL_FROM!,
    replyTo: process.env.EMAIL_REPLY_TO,
    messageStream: 'outbound',
  },
};
```

### Email Service Wrapper

```typescript
// services/email.ts
import postmark from 'postmark';
import { emailConfig } from '../config/email';

export class EmailService {
  private client: postmark.ServerClient;
  private accountClient: postmark.AccountClient;

  constructor() {
    this.client = new postmark.ServerClient(emailConfig.postmark.serverToken);
    this.accountClient = new postmark.AccountClient(emailConfig.postmark.accountToken);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    return this.client.sendEmailWithTemplate({
      From: emailConfig.postmark.from,
      To: to,
      TemplateId: 123456,
      TemplateModel: { name: userName },
      MessageStream: emailConfig.postmark.messageStream,
    });
  }

  async sendPasswordReset(to: string, resetLink: string) {
    return this.client.sendEmailWithTemplate({
      From: emailConfig.postmark.from,
      To: to,
      TemplateId: 789012,
      TemplateModel: { reset_link: resetLink },
      MessageStream: emailConfig.postmark.messageStream,
    });
  }

  async getDeliveryStats() {
    return this.accountClient.getDeliveryStatistics();
  }
}
```

## Webhook Integration

### Webhook Handler

```typescript
// pages/api/webhooks/postmark.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: true
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-postmark-signature'] as string;
  const body = JSON.stringify(req.body);

  if (!verifyWebhookSignature(signature, body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  switch (event.Type) {
    case 'Open':
      await handleEmailOpen(event);
      break;
    case 'Click':
      await handleEmailClick(event);
      break;
    case 'Delivery':
      await handleEmailDelivery(event);
      break;
    case 'Bounce':
      await handleEmailBounce(event);
      break;
    case 'SpamComplaint':
      await handleSpamComplaint(event);
      break;
  }

  res.status(200).json({ received: true });
}

function verifyWebhookSignature(signature: string, body: string): boolean {
  const secret = process.env.POSTMARK_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return signature === expectedSignature;
}

async functionEmailOpen(event: any) {
  // Track email open analytics
  console.log(`Email opened: ${event.MessageID} by ${event.Recipient}`);
}

async function handleEmailBounce(event: any) {
  // Handle bounced emails
  if (event.Type === 'HardBounce') {
    // Permanently remove from mailing list
    await unsubscribeUser(event.Recipient);
  }
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
// services/email.ts
import { PostmarkError } from 'postmark';

export class EmailService {
  async sendEmailWithRetry(emailData: any, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.client.sendEmail(emailData);
      } catch (error) {
        if (error instanceof PostmarkError) {
          if (error.code === 422) {
            // Validation error - don't retry
            throw new Error(`Email validation failed: ${error.message}`);
          } else if (error.code >= 500) {
            // Server error - retry
            if (attempt === maxRetries) {
              throw new Error(`Email delivery failed after ${maxRetries} attempts`);
            }
            await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          } else {
            // Client error - don't retry
            throw error;
          }
        } else {
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
export function validatePostmarkConfig() {
  const serverToken = process.env.POSTMARK_SERVER_API_TOKEN;
  const accountToken = process.env.POSTMARK_ACCOUNT_API_TOKEN;

  if (!serverToken || !serverToken.startsWith('server-')) {
    throw new Error('Invalid POSTMARK_SERVER_API_TOKEN format');
  }

  if (accountToken && !accountToken.startsWith('account-')) {
    throw new Error('Invalid POSTMARK_ACCOUNT_API_TOKEN format');
  }
}
```

### Input Validation

```typescript
// Email validation
export function validateEmailData(data: {
  from: string;
  to: string | string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.from)) {
    throw new Error('Invalid sender email address');
  }

  const recipients = Array.isArray(data.to) ? data.to : [data.to];
  for (const recipient of recipients) {
    if (!emailRegex.test(recipient)) {
      throw new Error(`Invalid recipient email: ${recipient}`);
    }
  }

  if (data.subject.length > 200) {
    throw new Error('Subject too long (max 200 characters)');
  }

  if (!data.htmlBody && !data.textBody) {
    throw new Error('Either htmlBody or textBody must be provided');
  }
}
```

## Testing Strategies

### Unit Testing with Mocks

```typescript
// __tests__/email.test.ts
import { EmailService } from '../services/email';
import postmark from 'postmark';

// Mock Postmark client
jest.mock('postmark');
const mockClient = {
  sendEmail: jest.fn(),
  sendEmailWithTemplate: jest.fn(),
  sendEmailBatch: jest.fn(),
} as any;

(postmark.ServerClient as jest.Mock).mockImplementation(() => mockClient);

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
    jest.clearAllMocks();
  });

  test('should send welcome email', async () => {
    mockClient.sendEmailWithTemplate.mockResolvedValue({ MessageID: 'test-id' });

    const result = await emailService.sendWelcomeEmail('test@example.com', 'John');

    expect(mockClient.sendEmailWithTemplate).toHaveBeenCalledWith({
      From: process.env.EMAIL_FROM,
      To: 'test@example.com',
      TemplateId: 123456,
      TemplateModel: { name: 'John' },
      MessageStream: 'outbound',
    });
    expect(result.MessageID).toBe('test-id');
  });

  test('should handle API errors gracefully', async () => {
    const postmarkError = new Error('API Error') as any;
    postmarkError.code = 422;
    mockClient.sendEmailWithTemplate.mockRejectedValue(postmarkError);

    await expect(emailService.sendWelcomeEmail('test@example.com', 'John')).rejects.toThrow(
      'Email validation failed: API Error'
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
      From: 'test@example.com',
      To: 'test+integration@example.com',
      Subject: 'Integration Test',
      HtmlBody: '<p>This is a test email</p>',
    });

    expect(result.MessageID).toBeDefined();
    expect(result.SubmittedAt).toBeDefined();
  });
});
```

## Performance Optimization

### Connection Pooling

```typescript
// Optimized email service with connection reuse
export class OptimizedEmailService {
  private static instance: OptimizedEmailService;
  private client: postmark.ServerClient;

  private constructor() {
    this.client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);
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
      const batchResults = await emailService.sendEmailBatch(batch);
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

### Delivery Monitoring

```typescript
// Monitor delivery statistics
export class EmailMonitor {
  async getDeliveryMetrics() {
    const stats = await emailService.getDeliveryStats();

    return {
      totalSent: stats.Sent,
      totalBounced: stats.Bounced,
      totalSpamComplaints: stats.SpamComplaint,
      deliveryRate: (stats.Sent / (stats.Sent + stats.Bounced)) * 100,
      spamRate: (stats.SpamComplaint / stats.Sent) * 100,
    };
  }

  async checkDeliveryHealth() {
    const metrics = await this.getDeliveryMetrics();

    if (metrics.deliveryRate < 95) {
      console.warn('Low delivery rate detected:', metrics.deliveryRate);
    }

    if (metrics.spamRate > 0.1) {
      console.warn('High spam complaint rate detected:', metrics.spamRate);
    }
  }
}
```

## Best Practices

1. **Use Templates**: Leverage Postmark templates for consistent branding and easier updates
2. **Implement Webhooks**: Set up webhooks for real-time delivery status tracking
3. **Handle Bounces**: Implement proper bounce handling to maintain list hygiene
4. **Monitor Metrics**: Regularly check delivery rates and spam complaints
5. **Use Message Streams**: Organize emails by type using message streams
6. **Implement Retries**: Use exponential backoff for transient failures
7. **Validate Inputs**: Validate all email data before sending
8. **Secure API Keys**: Store API keys securely and rotate regularly
9. **Test Thoroughly**: Use both unit and integration tests
10. **Monitor Performance**: Track email delivery times and success rates

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Postmark API Documentation](https://postmarkapp.com/developer/api/overview)
- [Postmark Webhooks Guide](https://postmarkapp.com/developer/api/webhooks)
- [Postmark Templates](https://postmarkapp.com/developer/api/templates)
- [Postmark Best Practices](https://postmarkapp.com/guides/best-practices)
- [Postmark Error Codes](https://postmarkapp.com/developer/api/overview#error-codes)


## Implementation

[Add content here]
