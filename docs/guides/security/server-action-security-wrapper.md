<!--
/**
 * @file server-action-security-wrapper.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for server action security wrapper.
 * @entrypoints docs/guides/server-action-security-wrapper.md
 * @exports server action security wrapper
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

# server-action-security-wrapper.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


> **Reference Documentation — February 2026**

## Overview

Server Actions in Next.js 13+ require security hardening to prevent unauthorized access, ensure proper tenant isolation, and maintain audit trails. This wrapper implements defense-in-depth security patterns including input validation, authentication checks, rate limiting, and comprehensive logging following 2026 security standards. [nextjs](https://nextjs.org/docs/app/api-reference/functions/server-actions)

---

## Secure Server Action Wrapper

```typescript
// packages/security/src/server-actions.ts
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auditLogger } from './audit-logger';
import { rateLimitServerAction } from './rate-limiting';

interface SecureActionOptions<TInput, TResult> {
  inputSchema?: z.ZodSchema<TInput>;
  requireAuth?: boolean;
  requireTenant?: boolean;
  rateLimit?: {
    requests: number;
    window: number;
  };
  auditEvent?: string;
  onSuccess?: (result: TResult, input: TInput) => void;
  onError?: (error: Error, input: TInput) => void;
}

export function createSecureAction<TInput, TResult>(
  options: SecureActionOptions<TInput, TResult> = {}
) {
  return async function secureAction(input: TInput): Promise<TResult> {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // 1. Authentication check
      if (options.requireAuth) {
        const authResult = await verifyAuthentication();
        if (!authResult.valid) {
          auditLogger.warn('unauthorized_server_action', {
            requestId,
            action: options.auditEvent || 'unknown',
            reason: authResult.reason,
          });

          throw new Error('Unauthorized');
        }
      }

      // 2. Tenant validation
      if (options.requireTenant) {
        const tenantResult = await verifyTenantAccess();
        if (!tenantResult.valid) {
          auditLogger.warn('unauthorized_tenant_access', {
            requestId,
            action: options.auditEvent || 'unknown',
            reason: tenantResult.reason,
          });

          throw new Error('Unauthorized tenant access');
        }
      }

      // 3. Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = await rateLimitServerAction(
          options.rateLimit.requests,
          options.rateLimit.window
        );

        if (!rateLimitResult.allowed) {
          auditLogger.warn('server_action_rate_limit_exceeded', {
            requestId,
            action: options.auditEvent || 'unknown',
            limit: options.rateLimit.requests,
            remaining: rateLimitResult.remaining,
          });

          throw new Error('Rate limit exceeded');
        }
      }

      // 4. Input validation
      let validatedInput: TInput;
      if (options.inputSchema) {
        try {
          validatedInput = options.inputSchema.parse(input);
        } catch (error) {
          auditLogger.warn('server_action_validation_failed', {
            requestId,
            action: options.auditEvent || 'unknown',
            error: error instanceof Error ? error.message : 'Validation failed',
            input,
          });

          throw new Error('Invalid input');
        }
      } else {
        validatedInput = input;
      }

      // 5. Execute the action (this would be the actual server action logic)
      const result = await executeAction<TResult>(validatedInput, {
        requestId,
        tenantId: options.requireTenant ? getTenantId() : undefined,
        userId: options.requireAuth ? getUserId() : undefined,
      });

      // 6. Success callback
      if (options.onSuccess) {
        options.onSuccess(result, validatedInput);
      }

      // 7. Audit logging
      auditLogger.info('server_action_completed', {
        requestId,
        action: options.auditEvent || 'unknown',
        duration: Date.now() - startTime,
        success: true,
        tenantId: options.requireTenant ? getTenantId() : undefined,
        userId: options.requireAuth ? getUserId() : undefined,
      });

      return result;
    } catch (error) {
      // Error callback
      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error('Unknown error'), input);
      }

      // Error logging
      auditLogger.error('server_action_failed', {
        requestId,
        action: options.auditEvent || 'unknown',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        tenantId: options.requireTenant ? getTenantId() : undefined,
        userId: options.requireAuth ? getUserId() : undefined,
      });

      throw error;
    }
  };
}

// Helper functions
async function verifyAuthentication(): Promise<{ valid: boolean; reason?: string }> {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader) {
    return { valid: false, reason: 'Missing authorization header' };
  }

  try {
    // Verify JWT token with your auth service
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { valid: false, reason: 'Invalid token' };
    }

    const data = await response.json();
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: 'Authentication service unavailable' };
  }
}

async function verifyTenantAccess(): Promise<{ valid: boolean; reason?: string }> {
  const tenantId = getTenantId();

  if (!tenantId) {
    return { valid: false, reason: 'Missing tenant context' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/tenants/${tenantId}/access-check`,
      {
        method: 'GET',
        headers: {
          Authorization: headers().get('authorization') || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { valid: false, reason: 'Tenant access denied' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, reason: 'Tenant check failed' };
  }
}

function getTenantId(): string | null {
  const headersList = headers();
  return headersList.get('x-tenant-id') || null;
}

function getUserId(): string | null {
  const headersList = headers();
  return headersList.get('x-user-id') || null;
}

// This would be replaced with your actual server action logic
async function executeAction<TResult>(input: any, context: any): Promise<TResult> {
  // Placeholder for actual server action implementation
  return input as TResult;
}
```

---

## Usage Examples

### **Basic Server Action with Authentication**

```typescript
// apps/portal/src/app/api/leads/create/route.ts
import { createSecureAction } from '@repo/security/server-actions';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1).max(1000),
});

export const createLead = createSecureAction({
  inputSchema: createLeadSchema,
  requireAuth: true,
  requireTenant: true,
  rateLimit: { requests: 10, window: 60000 }, // 10 requests per minute
  auditEvent: 'lead_created',
  async onSuccess(result, input) {
    console.log(`Lead created: ${result.id} for ${input.email}`);
  },
  async onError(error, input) {
    console.error(`Failed to create lead for ${input.email}:`, error);
  },
});

// In your component:
async function handleCreateLead(formData: FormData) {
  'use server';

  const lead = await createLead({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  });

  redirect(`/leads/${lead.id}`);
}
```

### **Server Action with File Upload**

```typescript
// apps/portal/src/app/api/upload/route.ts
import { createSecureAction } from '@repo/security/server-actions';
import { z } from 'zod';

const uploadSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['document', 'image', 'video']),
  description: z.string().max(500),
});

export const uploadFile = createSecureAction({
  inputSchema: uploadSchema,
  requireAuth: true,
  requireTenant: true,
  rateLimit: { requests: 5, window: 60000 }, // 5 uploads per minute
  auditEvent: 'file_uploaded',
});

async function handleFileUpload(formData: FormData) {
  'use server';

  const file = formData.get('file') as File;
  const result = await uploadFile({
    file,
    category: formData.get('category') as 'document' | 'image' | 'video',
    description: formData.get('description'),
  });

  return { success: true, fileId: result.id };
}
```

### **Server Action with Database Operations**

```typescript
// packages/db/src/actions/leads.ts
import { createSecureAction } from '@repo/security/server-actions';
import { z } from 'zod';
import { db } from './client';

const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']),
  notes: z.string().optional(),
});

export const updateLeadStatus = createSecureAction({
  inputSchema: updateLeadStatusSchema,
  requireAuth: true,
  requireTenant: true,
  auditEvent: 'lead_status_updated',
});

async function handleStatusUpdate(formData: FormData) {
  'use server';

  const result = await updateLeadStatus({
    leadId: formData.get('leadId'),
    status: formData.get('status') as 'new' | 'contacted' | 'qualified' | 'closed',
    notes: formData.get('notes'),
  });

  redirect(`/leads/${result.leadId}`);
}
```

---

## Rate Limiting Implementation

```typescript
// packages/security/src/rate-limiting.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function rateLimitServerAction(
  requests: number,
  window: number
): Promise<{ allowed: boolean; remaining: number }> {
  const userId = getUserId() || 'anonymous';
  const key = `server_action_rate_limit:${userId}`;

  try {
    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;
    const remaining = Math.max(0, requests - count - 1);

    if (count >= requests) {
      return { allowed: false, remaining: 0 };
    }

    await redis.set(key, (count + 1).toString(), { ex: window / 1000 });

    return { allowed: true, remaining };
  } catch (error) {
    console.error('Rate limiting error:', error);
    return { allowed: true, remaining: requests - 1 };
  }
}
```

---

## Error Handling and Validation

```typescript
// packages/security/src/error-handling.ts
export class ServerActionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ServerActionError';
  }
}

export class ValidationError extends ServerActionError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class AuthenticationError extends ServerActionError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class AuthorizationError extends ServerActionError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

export class RateLimitError extends ServerActionError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT_ERROR', 429);
  }
}
```

---

## Testing Secure Server Actions

```typescript
// packages/security/__tests__/server-actions.test.ts
import { createSecureAction } from '../server-actions';
import { z } from 'zod';

describe('Secure Server Actions', () => {
  it('should validate input with schema', async () => {
    const schema = z.object({
      name: z.string().min(1),
    });

    const action = createSecureAction({
      inputSchema: schema,
      requireAuth: false,
      requireTenant: false,
    });

    // Mock the execution function
    const mockExecute = jest.fn().mockResolvedValue({ success: true });

    // This would need to be integrated with your testing setup
    expect(() => action({ name: 'test' })).not.toThrow();
    expect(() => action({ name: '' })).toThrow();
  });

  it('should handle rate limiting', async () => {
    const action = createSecureAction({
      rateLimit: { requests: 1, window: 60000 },
    });

    // First call should succeed
    await action({ test: 'data' });

    // Second call should fail
    await expect(action({ test: 'data' })).rejects.toThrow('Rate limit exceeded');
  });
});
```

---

## Integration with Middleware

```typescript
// apps/portal/src/middleware.ts
import { NextResponse } from 'next/server';
import { securityMiddleware } from '@repo/security/middleware';

export default function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(request);

  // Add user context for server actions
  if (securityResponse.headers.get('x-tenant-id')) {
    securityResponse.headers.set(
      'Cookie',
      `tenant_id=${securityResponse.headers.get('x-tenant-id')}; Path=/; HttpOnly; SameSite=Strict`
    );
  }

  return securityResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Next.js Server Actions Documentation — https://nextjs.org/docs/app/api-reference/functions/server-actions
- Zod Validation Documentation — https://zod.dev/
- OWASP Server Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet/
- Next.js Authentication Patterns — https://nextjs.org/docs/app/building-your-application/authentication
- Rate Limiting Best Practices — https://owasp.org/www-project-rate-limiting/

---


## Implementation

[Add content here]


## Best Practices

[Add content here]
