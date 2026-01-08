let sentryPromise: Promise<typeof import('@sentry/nextjs')> | null = null

function loadSentry() {
  if (!sentryPromise) {
    sentryPromise = import('@sentry/nextjs')
  }
  return sentryPromise
}

export async function setSentryUser(user: { id?: string; email?: string; name?: string }) {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SENTRY_DSN) return
  const Sentry = await loadSentry().catch(() => null)
  if (Sentry) {
    Sentry.setUser(user)
  }
}

export async function setSentryContext(name: string, context: Record<string, unknown>) {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SENTRY_DSN) return
  const Sentry = await loadSentry().catch(() => null)
  if (Sentry) {
    Sentry.setContext(name, context)
  }
}

export async function withSentrySpan<T>(
  options: { name: string; op?: string; attributes?: Record<string, unknown> },
  callback: () => Promise<T>,
): Promise<T> {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return callback()
  }

  const Sentry = await loadSentry().catch(() => null)
  if (!Sentry || typeof Sentry.startSpan !== 'function') {
    return callback()
  }

  return Sentry.startSpan(
    {
      name: options.name,
      op: options.op,
      attributes: options.attributes,
    },
    async () => callback(),
  )
}
