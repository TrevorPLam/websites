'use client';

/**
 * Root layout error boundary — last-resort fallback when the root layout itself fails.
 * Uses inline styles because Tailwind/CSS may not be available at this level.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 * @task 1.4.2
 */

// [Task 0.26] Added error reporting to last-resort error boundary
import { logError } from '@repo/infra/client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError('Global error boundary caught error', error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2>Something went wrong</h2>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
