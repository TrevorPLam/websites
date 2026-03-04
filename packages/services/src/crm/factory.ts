/**
 * @file packages/services/src/crm/factory.ts
 * @summary Factory function that returns the configured {@link CrmPort} adapter.
 * @description Acts as the composition-root entry point for CRM integration.
 *   Application code (Server Actions, API routes) imports only the factory and
 *   the {@link CrmPort} interface — never a concrete adapter class.
 *
 *   Provider selection is controlled by the `CRM_PROVIDER` environment
 *   variable:
 *   - `"in-memory"` (default in development/test) → {@link InMemoryCrmAdapter}
 *
 * @security The factory validates the provider name at call time and throws a
 *   descriptive error rather than silently falling back, which would mask
 *   misconfiguration.
 * @adr none
 * @requirements TASK-SVC-001
 *
 * @example
 * ```ts
 * // In a Server Action:
 * import { createCrmAdapter } from '@repo/services/crm/factory';
 *
 * const crm = createCrmAdapter();
 * await crm.createContact({ tenantId, email, firstName });
 * ```
 */

import type { CrmPort } from '@repo/service-ports/crm';
import { InMemoryCrmAdapter, type InMemoryCrmAdapterOptions } from './adapters/in-memory.adapter';

/** Union of all supported CRM providers. */
export type CrmProvider = 'in-memory';

/** Options forwarded to the underlying adapter. */
export interface CreateCrmAdapterOptions {
  /**
   * Override the provider.
   * Defaults to the `CRM_PROVIDER` environment variable, or `'in-memory'`
   * if the variable is absent.
   */
  provider?: CrmProvider;
  /** Options forwarded to {@link InMemoryCrmAdapter} when `provider === 'in-memory'`. */
  inMemory?: InMemoryCrmAdapterOptions;
}

/** Valid CRM provider values. */
const VALID_PROVIDERS: ReadonlySet<CrmProvider> = new Set(['in-memory']);

/**
 * Creates and returns the configured CRM adapter.
 *
 * @param options - Optional adapter overrides (provider, etc.)
 * @returns A concrete {@link CrmPort} implementation.
 * @throws {Error} when an unrecognised `CRM_PROVIDER` value is supplied.
 */
export function createCrmAdapter(options: CreateCrmAdapterOptions = {}): CrmPort {
  const rawProvider: string = options.provider ?? process.env['CRM_PROVIDER'] ?? 'in-memory';

  if (!VALID_PROVIDERS.has(rawProvider as CrmProvider)) {
    throw new Error(
      `Unknown CRM_PROVIDER "${rawProvider}". Valid values: ${[...VALID_PROVIDERS].join(', ')}.`
    );
  }

  const provider = rawProvider as CrmProvider;

  switch (provider) {
    case 'in-memory':
      return new InMemoryCrmAdapter(options.inMemory);

    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown CRM_PROVIDER "${String(_exhaustive)}". Valid values: "in-memory".`);
    }
  }
}
