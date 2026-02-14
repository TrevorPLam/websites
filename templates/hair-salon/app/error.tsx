'use client';

/**
 * Route-level error boundary for the hair-salon template.
 * Captures rendering errors via Sentry and displays a recovery UI.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 * @task 1.4.1
 */

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">We&apos;re sorry for the inconvenience.</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
