# Infrastructure-3: Integration Error Handling & Resilience

## Metadata

- **Task ID**: infrastructure-3-integration-resilience
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Infrastructure)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Integration resilience, error handling, THEGOAL infrastructure
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-3-webhook-security
- **Downstream Tasks**: None

## Context

Integration packages (`packages/integrations/*`) currently lack:
1. Standardized retry logic with exponential backoff
2. Circuit breaker pattern for failing integrations
3. Dead Letter Queue (DLQ) for failed requests
4. Standardized error types and logging

This addresses **Research Topic #22: Integration Package Error Handling & Retry Logic** from perplexity research.

## Dependencies

- **Upstream Task**: `security-3-webhook-security` — webhook idempotency complements retry logic
- **Required Packages**: `@repo/integrations-core`, `@repo/infra`, Redis or Postgres for circuit breaker state

## Cross-Task Dependencies & Sequencing

- **Upstream**: `security-3-webhook-security` (idempotency ensures retries are safe)
- **Parallel Work**: Can work alongside integration package development
- **Downstream**: Supports all integration packages (HubSpot, scheduling, email, etc.)

## Research

- **Primary topics**: [R-INTEGRATION](RESEARCH-INVENTORY.md#r-integration-calendly-acuity-calcom-oauth-21-tcf-v23), [R-INTEGRATION-RESILIENCE](RESEARCH-INVENTORY.md#r-integration-resilience) (new)
- **[2026-02] Research Topic #22**: Integration resilience requirements:
  - Exponential backoff retries with max attempts
  - Circuit breaker + DLQ where needed
  - Webhook-specific idempotency (complements retry logic)
- **Threat Model**: External outages or rate limits can cascade into app instability
- **References**: 
  - [docs/research/perplexity-security-2026.md](../docs/research/perplexity-security-2026.md) (Topic #22)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)

## Related Files

- `packages/integrations-core/src/client.ts` – create – HTTP client wrapper with retry/circuit breaker
- `packages/integrations-core/src/circuit-breaker.ts` – create – Circuit breaker implementation
- `packages/integrations-core/src/retry.ts` – create – Retry logic with exponential backoff
- `packages/integrations-core/src/dlq.ts` – create – Dead Letter Queue for failed requests
- `packages/integrations/hubspot/src/client.ts` – modify – Use resilience wrapper
- `packages/integrations/scheduling/src/client.ts` – modify – Use resilience wrapper
- `docs/architecture/integrations.md` – create or update – Document resilience patterns

## Acceptance Criteria

- [ ] HTTP client wrapper created:
  - Retry logic with exponential backoff
  - Configurable max attempts and backoff strategy
  - Transient error detection (429, 500-502, network errors)
- [ ] Circuit breaker implemented:
  - States: closed, open, half-open
  - Configurable failure threshold and timeout
  - Automatic recovery attempts
- [ ] Dead Letter Queue:
  - Failed requests after max retries stored in DLQ
  - DLQ entries include: request, error, timestamp, retry count
  - DLQ can be processed manually or automatically
- [ ] Standardized error types:
  - `IntegrationError`, `RateLimitError`, `CircuitBreakerOpenError`
  - Structured logging with error context
- [ ] All integration packages updated:
  - HubSpot client uses resilience wrapper
  - Scheduling clients use resilience wrapper
  - Email clients use resilience wrapper
- [ ] Documentation created: `docs/architecture/integrations.md`
- [ ] Unit tests for retry/circuit breaker logic
- [ ] Integration tests: simulate 429/5xx and verify retries/circuit breaker behavior

## Technical Constraints

- Must work with fetch/HTTP clients
- Circuit breaker state must be shared (Redis or Postgres)
- Retry logic must be idempotent-safe (complements webhook idempotency)
- DLQ storage: Redis, Postgres, or message queue

## Implementation Plan

### Phase 1: Core Resilience Utilities
- [ ] Create `packages/integrations-core/src/retry.ts`:
  ```typescript
  export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts: number;
      backoffMs: number;
      backoffMultiplier: number;
      isRetryableError: (error: Error) => boolean;
    }
  ): Promise<T> {
    // Exponential backoff retry logic
  }
  ```
- [ ] Create `packages/integrations-core/src/circuit-breaker.ts`:
  ```typescript
  export class CircuitBreaker {
    private state: 'closed' | 'open' | 'half-open';
    private failureCount: number;
    private lastFailureTime: number;
    
    async execute<T>(fn: () => Promise<T>): Promise<T> {
      // Circuit breaker logic
    }
  }
  ```

### Phase 2: HTTP Client Wrapper
- [ ] Create `packages/integrations-core/src/client.ts`:
  ```typescript
  export class ResilientHttpClient {
    async request(url: string, options: RequestInit): Promise<Response> {
      // Combine retry + circuit breaker + DLQ
    }
  }
  ```

### Phase 3: Dead Letter Queue
- [ ] Create `packages/integrations-core/src/dlq.ts`:
  - Store failed requests in DLQ
  - DLQ entries include: request, error, timestamp, retry count
  - DLQ processing utilities

### Phase 4: Integration Updates
- [ ] Update HubSpot client:
  - Use `ResilientHttpClient`
  - Configure retry/circuit breaker for HubSpot API
- [ ] Update scheduling clients (Calendly, Acuity, Cal.com):
  - Use `ResilientHttpClient`
  - Configure provider-specific retry/circuit breaker
- [ ] Update email clients (SendGrid, Mailchimp):
  - Use `ResilientHttpClient`
  - Configure retry/circuit breaker

### Phase 5: Testing & Documentation
- [ ] Unit tests:
  - Retry logic (exponential backoff, max attempts)
  - Circuit breaker (state transitions, failure threshold)
  - DLQ (storage, retrieval)
- [ ] Integration tests:
  - Simulate 429/5xx responses
  - Verify retries occur
  - Verify circuit breaker opens after threshold
- [ ] Create/update `docs/architecture/integrations.md`

## Sample code / examples

### Retry Logic
```typescript
// packages/integrations-core/src/retry.ts
export interface RetryOptions {
  maxAttempts: number;
  initialBackoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
  isRetryableError: (error: Error) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let attempt = 0;
  let backoffMs = options.initialBackoffMs;

  while (attempt < options.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt >= options.maxAttempts) {
        throw error;
      }

      if (!options.isRetryableError(error as Error)) {
        throw error;
      }

      // Exponential backoff
      await sleep(backoffMs);
      backoffMs = Math.min(
        backoffMs * options.backoffMultiplier,
        options.maxBackoffMs
      );
    }
  }

  throw new Error('Max retry attempts exceeded');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isRetryableError(error: Error): boolean {
  // Network errors, 429, 500-502 are retryable
  if (error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT')) {
    return true;
  }
  return false;
}
```

### Circuit Breaker
```typescript
// packages/integrations-core/src/circuit-breaker.ts
export interface CircuitBreakerOptions {
  failureThreshold: number;
  timeoutMs: number;
  halfOpenMaxAttempts: number;
}

export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenAttempts = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.options.timeoutMs) {
        this.state = 'half-open';
        this.halfOpenAttempts = 0;
      } else {
        throw new CircuitBreakerOpenError('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      
      if (this.state === 'half-open') {
        this.halfOpenAttempts++;
        if (this.halfOpenAttempts >= this.options.halfOpenMaxAttempts) {
          this.state = 'closed';
          this.failureCount = 0;
        }
      } else {
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.options.failureThreshold) {
        this.state = 'open';
      } else if (this.state === 'half-open') {
        this.state = 'open';
      }

      throw error;
    }
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}
```

### Resilient HTTP Client
```typescript
// packages/integrations-core/src/client.ts
import { withRetry, isRetryableError } from './retry';
import { CircuitBreaker } from './circuit-breaker';
import { addToDLQ } from './dlq';

export class ResilientHttpClient {
  private circuitBreaker: CircuitBreaker;

  constructor(
    private options: {
      retry: RetryOptions;
      circuitBreaker: CircuitBreakerOptions;
    }
  ) {
    this.circuitBreaker = new CircuitBreaker(options.circuitBreaker);
  }

  async request(url: string, init: RequestInit): Promise<Response> {
    try {
      return await this.circuitBreaker.execute(() =>
        withRetry(
          async () => {
            const response = await fetch(url, init);
            
            if (!response.ok) {
              const error = new IntegrationError(
                `HTTP ${response.status}: ${response.statusText}`,
                response.status
              );
              
              if (response.status === 429) {
                throw new RateLimitError(error.message);
              }
              
              if (response.status >= 500) {
                throw error; // Retryable
              }
              
              throw error; // Not retryable
            }

            return response;
          },
          {
            ...this.options.retry,
            isRetryableError: (error) => {
              if (error instanceof RateLimitError) return true;
              if (error instanceof IntegrationError && error.statusCode >= 500) return true;
              return isRetryableError(error);
            },
          }
        )
      );
    } catch (error) {
      // Add to DLQ after max retries
      await addToDLQ({
        url,
        method: init.method || 'GET',
        headers: init.headers,
        body: init.body,
        error: String(error),
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
}
```

### Integration Usage
```typescript
// packages/integrations/hubspot/src/client.ts
import { ResilientHttpClient } from '@repo/integrations-core/client';

const client = new ResilientHttpClient({
  retry: {
    maxAttempts: 3,
    initialBackoffMs: 1000,
    backoffMultiplier: 2,
    maxBackoffMs: 10000,
    isRetryableError,
  },
  circuitBreaker: {
    failureThreshold: 5,
    timeoutMs: 60000, // 1 minute
    halfOpenMaxAttempts: 2,
  },
});

export async function createContact(data: ContactData) {
  const response = await client.request('https://api.hubapi.com/contacts/v1/contact', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

## Testing Requirements

- **Unit Tests:**
  - Retry logic (exponential backoff, max attempts)
  - Circuit breaker (state transitions, failure threshold)
  - DLQ (storage, retrieval)
- **Integration Tests:**
  - Simulate 429 responses → retries occur
  - Simulate 5xx responses → retries occur
  - Simulate repeated failures → circuit breaker opens
  - Verify DLQ entries created after max retries

## Execution notes

- **Related files — current state:** 
  - Integration packages exist but lack resilience patterns
  - No retry/circuit breaker logic
- **Potential issues / considerations:** 
  - Circuit breaker state sharing (Redis vs Postgres)
  - DLQ storage (Redis, Postgres, message queue)
  - Idempotency (ensure retries are safe)
- **Verification:** 
  - Unit tests pass
  - Integration tests verify retry/circuit breaker behavior
  - DLQ entries created after failures

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing (unit + integration)
- [ ] Retry logic implemented (exponential backoff)
- [ ] Circuit breaker implemented (state management)
- [ ] DLQ implemented (failed request storage)
- [ ] Integration packages updated (use resilience wrapper)
- [ ] Documentation created (`docs/architecture/integrations.md`)
- [ ] Resilience verified (429/5xx handled correctly)
