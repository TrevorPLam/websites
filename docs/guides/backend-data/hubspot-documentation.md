# HubSpot API Documentation: CRM Integration & Lead Management

> **Reference Documentation — February 2026**

## Overview

HubSpot provides a comprehensive suite of APIs for integrating with its CRM platform.
For marketing and sales automation, the **Leads API** and **CRM Object API** are
the primary tools for managing potential customers and synchronizing data between
external platforms and HubSpot.

## Key APIs for Lead Management

### 1. Leads API (Released Aug 2024)

The Leads API is designed specifically for managing leads within the HubSpot CRM.
It allows for creating, updating, and categorizing leads based on engagement level.

- **Create a Lead**: `POST /crm/v3/objects/leads`
- **Update a Lead**: `PATCH /crm/v3/objects/leads/{leadsId}`

### 2. CRM Objects API

Manages standard objects such as **Contacts**, **Companies**, and **Deals**.

- **Contacts**: `POST /crm/v3/objects/contacts`
- **Companies**: `POST /crm/v3/objects/companies`

### 3. Associations API

Enables defining relationships between CRM records (e.g., associating a specific Contact with a Company).

## Property Management

Leads are categorized using standard properties:

- `hs_lead_name`: The name of the lead record.
- `hs_lead_label`: Categorizes leads as `Hot`, `Warm`, or `Cold`.
- `hs_lead_type`: Defines the lead source or intent (e.g., `New Business`, `Upsell`).

## Authentication & Security (2026 Updates)

HubSpot leverages **Private Apps** and **OAuth 2.0** for secure API access.

> [!IMPORTANT]
> **January 2026 Update**: HubSpot has introduced **OAuth v3 API Endpoints**
> and standardized error responses to enhance integration security and compliance.

### Legacy Support

- The **Contact Lists API (v1)** is scheduled for sunset on April 30, 2026. Developers must migrate to the **Lists v3 API**.

## Implementation Example: Syncing a Lead (2026 Standards)

```typescript
// 2026-compliant HubSpot integration with OAuth v3 and proper error handling
import { HubSpotClient } from '@hubspot/api-client';
import { z } from 'zod';
import { createLogger } from '@repo/logging';

// Type-safe lead schema validation
const LeadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  company: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CUSTOMER']).default('NEW'),
  label: z.enum(['HOT', 'WARM', 'COLD']).default('WARM'),
  source: z.string().optional(),
});

type LeadData = z.infer<typeof LeadSchema>;

// 2026 OAuth v3 token management
class HubSpotTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private redirectUri: string
  ) {}

  async getValidToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
    return this.accessToken!;
  }

  private async refreshAccessToken(): Promise<void> {
    const response = await fetch('https://api.hubapi.com/oauth/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken!,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as HubSpotError;
      throw new HubSpotIntegrationError(error.error, error.error_description, response.status);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000;
  }
}

// Enhanced HubSpot client with 2026 standards
export class HubSpotService {
  private client: HubSpotClient;
  private tokenManager: HubSpotTokenManager;
  private logger = createLogger('hubspot-service');

  constructor(clientId: string, clientSecret: string, refreshToken: string, redirectUri: string) {
    this.tokenManager = new HubSpotTokenManager(clientId, clientSecret, redirectUri);
    this.client = new HubSpotClient({
      accessToken: 'placeholder', // Will be updated dynamically
    });
  }

  async createLead(leadData: LeadData): Promise<HubSpotLead> {
    // Validate input data
    const validatedData = LeadSchema.parse(leadData);

    // Get fresh token
    const token = await this.tokenManager.getValidToken();
    this.client.setAccessToken(token);

    const leadProperties = {
      hs_lead_name: validatedData.name,
      hs_lead_status: validatedData.status,
      hs_lead_label: validatedData.label,
      email: validatedData.email,
      company: validatedData.company,
      phone: validatedData.phone,
      hs_lead_source: validatedData.source,
    };

    return this.withMonitoring('createLead', async () => {
      try {
        const apiResponse = await this.client.crm.objects.basicApi.create('leads', {
          properties: leadProperties,
        });

        this.logger.info('Lead created successfully', {
          leadId: apiResponse.id,
          email: validatedData.email,
        });

        return apiResponse;
      } catch (error) {
        const hubSpotError = handleHubSpotError(error);
        this.logger.error('Failed to create lead', {
          email: validatedData.email,
          error: hubSpotError.message,
        });
        throw hubSpotError;
      }
    });
  }

  async updateLead(leadId: string, updates: Partial<LeadData>): Promise<HubSpotLead> {
    const validatedUpdates = LeadSchema.partial().parse(updates);
    const token = await this.tokenManager.getValidToken();
    this.client.setAccessToken(token);

    return this.withMonitoring('updateLead', async () => {
      try {
        const apiResponse = await this.client.crm.objects.basicApi.update('leads', leadId, {
          properties: validatedUpdates,
        });

        this.logger.info('Lead updated successfully', { leadId });
        return apiResponse;
      } catch (error) {
        throw handleHubSpotError(error);
      }
    });
  }

  private async withMonitoring<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    const correlationId = crypto.randomUUID();

    try {
      this.logger.info('HubSpot operation started', {
        operation,
        correlationId,
      });

      const result = await fn();

      this.logger.info('HubSpot operation completed', {
        operation,
        correlationId,
        duration: Date.now() - startTime,
      });

      return result;
    } catch (error) {
      this.logger.error('HubSpot operation failed', {
        operation,
        correlationId,
        error: error.message,
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }
}

// Type definitions
interface HubSpotLead {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

interface HubSpotError {
  error: string;
  error_description: string;
  status?: string;
  message?: string;
}

export class HubSpotIntegrationError extends Error {
  constructor(
    public error: string,
    public errorDescription: string,
    public statusCode?: number
  ) {
    super(`${error}: ${errorDescription}`);
    this.name = 'HubSpotIntegrationError';
  }
}

export function handleHubSpotError(error: any): HubSpotIntegrationError {
  if (error.response?.data) {
    const hubSpotError = error.response.data as HubSpotError;
    return new HubSpotIntegrationError(
      hubSpotError.error,
      hubSpotError.error_description,
      error.response.status
    );
  }
  return new HubSpotIntegrationError('UNKNOWN_ERROR', error.message || 'An unknown error occurred');
}

// Usage example
const hubSpotService = new HubSpotService(
  process.env.HUBSPOT_CLIENT_ID!,
  process.env.HUBSPOT_CLIENT_SECRET!,
  process.env.HUBSPOT_REFRESH_TOKEN!,
  process.env.HUBSPOT_REDIRECT_URI!
);

// Create a new lead
const newLead = await hubSpotService.createLead({
  email: 'john.doe@example.com',
  name: 'John Doe',
  company: 'Acme Corp',
  status: 'NEW',
  label: 'HOT',
  source: 'website_form',
});
```

## References

- [Research Inventory](../../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [HubSpot Developer Documentation](https://developers.hubspot.com/docs/api/overview)
- [HubSpot CRM Objects API Reference](https://developers.hubspot.com/docs/api/crm/objects)
- [HubSpot Leads API Guide](https://developers.hubspot.com/docs/api/crm/leads)
- [HubSpot OAuth v3 Migration Guide](https://developers.hubspot.com/docs/api/oauth-v3)

## Best Practices

### 2026 Integration Standards

- **OAuth v3 First**: Use `/v3/token` and `/v3/introspect` endpoints for all new integrations
- **PKCE Required**: For all authorization code flows per OAuth 2.1 standards
- **Credential Security**: Never send credentials in URLs - always in request body
- **Error Handling**: Parse standard OAuth `error` and `error_description` fields per RFC 6749
- **Rate Limiting**: Implement sliding window algorithms with exponential backoff and jitter
- **Data Validation**: Validate all input data using Zod schemas before API calls
- **Audit Logging**: Log all API interactions with correlation IDs for troubleshooting
- **Post-Quantum Ready**: Design for future migration to NIST FIPS 203/204/205 algorithms

### Performance Optimization

- **Batch Operations**: Use bulk API endpoints where available (up to 100 records per batch)
- **Parallel Processing**: Process multiple objects concurrently when possible
- **Caching Strategy**: Cache frequently accessed data with 5-minute TTL using Redis
- **Connection Pooling**: Reuse HTTP connections for better performance
- **Webhook Processing**: Process webhooks asynchronously with queues (QStash/RabbitMQ)
- **Sliding Window Rate Limiting**: Implement Redis-based sliding window for smooth throttling
- **Edge Computing**: Deploy webhook handlers at edge for reduced latency
- **Request Compression**: Use gzip compression for API requests > 1KB

### Security & Compliance

- **OAuth 2.1 Compliance**: PKCE required for authorization code flows, no implicit grants
- **Token Management**: Store tokens securely using encryption at rest (AES-256-GCM)
- **Scope Minimization**: Request only necessary OAuth scopes following principle of least privilege
- **Data Privacy**: Implement GDPR/CCPA compliance for personal data with right to deletion
- **Audit Trail**: Maintain complete audit logs for data access with immutable records
- **Rate Limit Protection**: Implement client-side sliding window rate limiting to prevent API abuse
- **Post-Quantum Migration**: Prepare for NIST FIPS 203/204/205 migration with hybrid crypto
- **Zero-Trust Architecture**: Verify all requests, never trust network location

## Testing

### Unit Testing

```typescript
import { HubSpotClient } from '@hubspot/api-client';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the HubSpot client
vi.mock('@hubspot/api-client');

describe('HubSpot Integration', () => {
  let hubspotClient: HubSpotClient;

  beforeEach(() => {
    hubspotClient = new HubSpotClient({ accessToken: 'test-token' });
    vi.clearAllMocks();
  });

  it('should create a lead successfully', async () => {
    const mockResponse = {
      id: '12345',
      properties: {
        hs_lead_name: 'Test Lead',
        hs_lead_status: 'NEW',
        hs_lead_label: 'HOT',
      },
    };

    vi.mocked(hubspotClient.crm.objects.basicApi.create).mockResolvedValue(mockResponse);

    const result = await createLead({
      name: 'Test Lead',
      status: 'NEW',
      label: 'HOT',
    });

    expect(result.id).toBe('12345');
    expect(hubspotClient.crm.objects.basicApi.create).toHaveBeenCalledWith('leads', {
      properties: {
        hs_lead_name: 'Test Lead',
        hs_lead_status: 'NEW',
        hs_lead_label: 'HOT',
      },
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    vi.mocked(hubspotClient.crm.objects.basicApi.create).mockRejectedValue(mockError);

    await expect(
      createLead({
        name: 'Test Lead',
        status: 'NEW',
        label: 'HOT',
      })
    ).rejects.toThrow('API Error');
  });
});
```

### Integration Testing

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { HubSpotTestClient } from '../test-utils/hubspot-test-client';

describe('HubSpot Integration Tests', () => {
  let testClient: HubSpotTestClient;

  beforeAll(async () => {
    testClient = new HubSpotTestClient();
    await testClient.setup();
  });

  afterAll(async () => {
    await testClient.cleanup();
  });

  it('should sync lead to HubSpot end-to-end', async () => {
    const leadData = {
      email: 'test@example.com',
      name: 'Test User',
      company: 'Test Corp',
    };

    const result = await testClient.createLead(leadData);

    expect(result.id).toBeDefined();
    expect(result.properties.hs_lead_status).toBe('NEW');

    // Verify lead exists in HubSpot
    const retrieved = await testClient.getLead(result.id);
    expect(retrieved.properties.hs_lead_name).toBe(leadData.name);
  });
});
```

### E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('HubSpot Webhook Processing', () => {
  test('should process HubSpot webhook updates', async ({ request }) => {
    const webhookPayload = {
      eventType: 'lead.created',
      objectId: '12345',
      properties: {
        hs_lead_name: 'Webhook Test Lead',
        hs_lead_status: 'NEW',
      },
    };

    const response = await request.post('/api/webhooks/hubspot', {
      data: webhookPayload,
      headers: {
        'X-HubSpot-Signature': 'test-signature',
      },
    });

    expect(response.status()).toBe(200);

    // Verify lead was processed
    const leadData = await request.get(`/api/leads/12345`);
    expect(await leadData.json()).toMatchObject({
      name: 'Webhook Test Lead',
      status: 'NEW',
    });
  });
});
```

## Error Handling & Monitoring

### Standardized Error Responses

```typescript
interface HubSpotError {
  error: string;
  error_description: string;
  status?: string;
  message?: string;
}

export class HubSpotIntegrationError extends Error {
  constructor(
    public error: string,
    public errorDescription: string,
    public statusCode?: number
  ) {
    super(`${error}: ${errorDescription}`);
    this.name = 'HubSpotIntegrationError';
  }
}

export function handleHubSpotError(error: any): HubSpotIntegrationError {
  if (error.response?.data) {
    const hubSpotError = error.response.data as HubSpotError;
    return new HubSpotIntegrationError(
      hubSpotError.error,
      hubSpotError.error_description,
      error.response.status
    );
  }
  return new HubSpotIntegrationError('UNKNOWN_ERROR', error.message || 'An unknown error occurred');
}
```

### Monitoring & Alerting

```typescript
import { createLogger } from '@repo/logging';

const logger = createLogger('hubspot-integration');

export function withMonitoring<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    const correlationId = crypto.randomUUID();

    try {
      logger.info('HubSpot operation started', {
        operation,
        correlationId,
        args: args.length,
      });

      const result = await fn(...args);

      logger.info('HubSpot operation completed', {
        operation,
        correlationId,
        duration: Date.now() - startTime,
      });

      return result;
    } catch (error) {
      logger.error('HubSpot operation failed', {
        operation,
        correlationId,
        error: error.message,
        duration: Date.now() - startTime,
      });

      throw error;
    }
  };
}
```
