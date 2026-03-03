/**
 * @file packages/services/src/email/factory.ts
 * @summary Factory function that returns the configured {@link EmailPort} adapter.
 * @description Acts as the composition-root entry point for email delivery.
 *   Application code (Server Actions, API routes) imports only the factory and
 *   the {@link EmailPort} interface — never a concrete adapter class.
 *
 *   Provider selection is controlled by the `EMAIL_PROVIDER` environment
 *   variable:
 *   - `"resend"` (default in production) → {@link ResendAdapter}
 *   - `"native"` (default in development/test) → {@link NativeAdapter}
 *
 * @security The factory validates the provider name at call time and throws a
 *   descriptive error rather than silently falling back, which would mask
 *   misconfiguration.
 * @requirements TASK-SVC-002-REV
 *
 * @example
 * ```ts
 * // In a Server Action:
 * import { createEmailAdapter } from '@repo/services/email/factory';
 *
 * const email = createEmailAdapter();
 * await email.send({ tenantId, to, subject, html });
 * ```
 */

import type { EmailPort } from '@repo/service-ports/email';
import { NativeAdapter, type NativeAdapterOptions } from './adapters/native.adapter';
import { ResendAdapter, type ResendAdapterOptions } from './adapters/resend.adapter';

/** Union of all supported email providers. */
export type EmailProvider = 'resend' | 'native';

/** Options forwarded to the underlying adapter. */
export interface CreateEmailAdapterOptions {
  /**
   * Override the provider.
   * Defaults to the `EMAIL_PROVIDER` environment variable, or `'native'`
   * if the variable is absent.
   */
  provider?: EmailProvider;
  /** Options forwarded to {@link ResendAdapter} when `provider === 'resend'`. */
  resend?: ResendAdapterOptions;
  /** Options forwarded to {@link NativeAdapter} when `provider === 'native'`. */
  native?: NativeAdapterOptions;
}

/** Valid email provider values. */
const VALID_PROVIDERS: ReadonlySet<EmailProvider> = new Set(['resend', 'native']);

/**
 * Creates and returns the configured email adapter.
 *
 * @param options - Optional adapter overrides (provider, apiKey, etc.)
 * @returns A concrete {@link EmailPort} implementation.
 * @throws {Error} when an unrecognised `EMAIL_PROVIDER` value is supplied.
 */
export function createEmailAdapter(
  options: CreateEmailAdapterOptions = {},
): EmailPort {
  const rawProvider: string =
    options.provider ??
    process.env['EMAIL_PROVIDER'] ??
    (process.env['NODE_ENV'] === 'production' ? 'resend' : 'native');

  if (!VALID_PROVIDERS.has(rawProvider as EmailProvider)) {
    throw new Error(
      `Unknown EMAIL_PROVIDER "${rawProvider}". Valid values: ${[...VALID_PROVIDERS].join(', ')}.`,
    );
  }

  const provider = rawProvider as EmailProvider;

  switch (provider) {
    case 'resend': {
      const apiKey =
        options.resend?.apiKey ?? process.env['RESEND_API_KEY'];

      if (!apiKey && !options.resend?.resolveApiKey) {
        throw new Error(
          'EMAIL_PROVIDER=resend requires RESEND_API_KEY or a `resolveApiKey` option.',
        );
      }

      return new ResendAdapter({
        apiKey,
        ...options.resend,
      });
    }

    case 'native':
      return new NativeAdapter(options.native);

    default: {
      const _exhaustive: never = provider;
      throw new Error(
        `Unknown EMAIL_PROVIDER "${String(_exhaustive)}". Valid values: "resend", "native".`,
      );
    }
  }
}
