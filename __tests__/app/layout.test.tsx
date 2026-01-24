import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RootLayout from '@/app/layout'
import { createCspNonce } from '@/lib/csp'
import { logError, logWarn } from '@/lib/logger'

let nonceHeaderValue: string | null = 'header-nonce'

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => {
      if (key === 'x-csp-nonce') {
        return nonceHeaderValue
      }
      return null
    },
  }),
}))

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  IBM_Plex_Sans: () => ({ variable: '--font-plex' }),
}))

vi.mock('@/lib/csp', async () => {
  const actual = await vi.importActual<typeof import('@/lib/csp')>('@/lib/csp')
  return {
    ...actual,
    createCspNonce: vi.fn(),
  }
})

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}))

vi.mock('@/lib/search', () => ({
  getSearchIndex: () => [],
}))

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation" />,
}))

vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer" />,
}))

vi.mock('@/components/SkipToContent', () => ({
  default: () => <div data-testid="skip-to-content" />,
}))

vi.mock('@/components/InstallPrompt', () => ({
  default: () => <div data-testid="install-prompt" />,
}))

vi.mock('@/components/AnalyticsConsentBanner', () => ({
  default: ({ nonce }: { nonce: string }) => (
    <div data-testid="analytics-banner" data-nonce={nonce} />
  ),
}))

vi.mock('@/app/providers', () => ({
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}))

describe('RootLayout CSP nonce fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses the header nonce when available (happy path)', async () => {
    // Use the header nonce to prove we respect the middleware-provided value.
    nonceHeaderValue = 'header-nonce'
    vi.mocked(createCspNonce).mockReturnValue('unused-nonce')

    const markup = renderToStaticMarkup(
      await RootLayout({
        children: <div>child</div>,
      })
    )

    expect(markup).toContain('nonce="header-nonce"')
    expect(markup).toContain('data-nonce="header-nonce"')
    expect(logWarn).not.toHaveBeenCalled()
    expect(logError).not.toHaveBeenCalled()
  })

  it('creates a fallback nonce when the header is missing (empty header)', async () => {
    // Missing header should log a warning and create a new nonce.
    nonceHeaderValue = null
    vi.mocked(createCspNonce).mockReturnValue('generated-fallback')

    const markup = renderToStaticMarkup(
      await RootLayout({
        children: <div>child</div>,
      })
    )

    expect(markup).toContain('nonce="generated-fallback"')
    expect(markup).toContain('data-nonce="generated-fallback"')
    expect(logWarn).toHaveBeenCalledTimes(1)
    expect(logError).not.toHaveBeenCalled()
  })

  it('uses a static fallback nonce if nonce creation fails (error path)', async () => {
    // If crypto fails, we still render to avoid hard crashes.
    nonceHeaderValue = null
    vi.mocked(createCspNonce).mockImplementation(() => {
      throw new Error('crypto unavailable')
    })

    const markup = renderToStaticMarkup(
      await RootLayout({
        children: <div>child</div>,
      })
    )

    expect(markup).toContain('nonce="fallback-nonce"')
    expect(markup).toContain('data-nonce="fallback-nonce"')
    expect(logWarn).toHaveBeenCalledTimes(1)
    expect(logError).toHaveBeenCalledTimes(1)
  })
})
