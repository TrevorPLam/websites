/**
 * @file packages/infrastructure/context/tenant-context.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantContextValue {
  tenantId: string;
  requestId?: string;
  userId?: string;
}

const tenantContextStore = new AsyncLocalStorage<TenantContextValue>();

/**
 * export class TenantContext.
 */
export class TenantContext {
  run<T>(context: TenantContextValue, callback: () => T): T {
    if (!context.tenantId) {
      throw new Error('tenantId is required to start tenant context.');
    }

    return tenantContextStore.run(context, callback);
  }

  get(): TenantContextValue | undefined {
    return tenantContextStore.getStore();
  }

  getTenantId(): string | undefined {
    return tenantContextStore.getStore()?.tenantId;
  }
}

export const tenantContext = new TenantContext();

/**
 * export function withTenant<T>(tenantId: string, callback: () => T): T.
 */
export function withTenant<T>(tenantId: string, callback: () => T): T {
  return tenantContext.run({ tenantId }, callback);
}

/**
 * export function getTenantContext(): TenantContextValue | undefined.
 */
export function getTenantContext(): TenantContextValue | undefined {
  return tenantContext.get();
}
