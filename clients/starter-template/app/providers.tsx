'use client';

/**
 * @file clients/starter-template/app/providers.tsx
 * Purpose: Client-boundary wrapper for all context providers used in the root layout.
 *          This file MUST have 'use client' to create a proper Next.js App Router
 *          server/client boundary. Server Components (layout.tsx) import this as an
 *          opaque client reference — the provider code only runs on the client.
 *
 * Pattern: "Providers wrapper" — canonical Next.js App Router pattern for wrapping
 *          client-only providers (context, themes, consent, etc.) inside a Server layout.
 *
 * Exports: Providers component
 * Used by: app/layout.tsx
 */

import { ConsentProvider } from '@repo/ui';
import type { SiteConfig } from '@repo/types';

interface ProvidersProps {
  children: React.ReactNode;
  cmpProvider: NonNullable<SiteConfig['consent']>['cmpProvider'];
}

export function Providers({ children, cmpProvider }: ProvidersProps) {
  return <ConsentProvider cmpProvider={cmpProvider ?? 'custom'}>{children}</ConsentProvider>;
}
