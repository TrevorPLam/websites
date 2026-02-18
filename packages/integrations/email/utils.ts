/**
 * @file packages/integrations/email/utils.ts
 * Purpose: Shared utilities for email marketing adapters.
 */

export interface RetryOptions {
  maxRetries?: number;
  timeoutMs?: number;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const { maxRetries = 3, timeoutMs = 10000 } = retryOptions;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (e: any) {
      clearTimeout(id);
      lastError = e;
      if (e.name === 'AbortError') {
        continue;
      }
      continue;
    }
  }

  throw lastError || new Error(`Failed to fetch after ${maxRetries} attempts`);
}
