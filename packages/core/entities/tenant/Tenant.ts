/**
 * @file packages/core/entities/tenant/Tenant.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.

 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { TenantDomainError } from './errors';
import type { TenantId } from '@repo/core';

export interface TenantProps {
  id: TenantId;
  slug: string;
  customDomain: string | null;
  settings: Record<string, unknown>;
  isSuspended: boolean;
}

/**
 * export class Tenant.
 */
export class Tenant {
  private constructor(private props: TenantProps) {}

  static create(props: Omit<TenantProps, 'isSuspended'>): Tenant {
    return new Tenant({ ...props, isSuspended: false });
  }

  updateSettings(settings: Record<string, unknown>): void {
    if (this.props.isSuspended) {
      throw new TenantDomainError('Cannot update settings for suspended tenant.');
    }

    this.props.settings = { ...this.props.settings, ...settings };
  }

  suspend(): void {
    this.props.isSuspended = true;
  }

  toJSON(): TenantProps {
    return { ...this.props };
  }
}
