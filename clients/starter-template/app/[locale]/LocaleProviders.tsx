'use client';

/**
 * @file clients/starter-template/app/[locale]/LocaleProviders.tsx
 * Purpose: Client-side provider composition for [locale] layout.
 * Uses ProviderComposer for context providers (NextIntlClientProvider, etc.).
 * ThemeInjector renders as a style-injecting sibling — it is NOT a context provider.
 * Add more context providers to the `providers` array as the app grows (e.g. TooltipProvider).
 */
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeInjector } from '@repo/ui';
import { ProviderComposer } from '@repo/infra/composition';
import type { ThemeColors } from '@repo/types';

type WithChildren = { children: React.ReactNode };

type LocaleProvidersProps = {
  messages: React.ComponentProps<typeof NextIntlClientProvider>['messages'];
  theme: ThemeColors;
  children: React.ReactNode;
};

export function LocaleProviders({ messages, theme, children }: LocaleProvidersProps) {
  // Context providers only — ThemeInjector is a style injector and must not wrap content.
  const providers = React.useMemo(
    (): React.ComponentType<WithChildren>[] => [
      ({ children: c }: WithChildren) => (
        <NextIntlClientProvider messages={messages}>{c}</NextIntlClientProvider>
      ),
      // Add more context providers here as needed, e.g.:
      // ({ children: c }: WithChildren) => <TooltipProvider>{c}</TooltipProvider>,
    ],
    [messages]
  );

  return (
    <ProviderComposer providers={providers}>
      {/* ThemeInjector injects CSS custom properties as a <style> tag — sibling of content */}
      <ThemeInjector theme={theme} />
      {children}
    </ProviderComposer>
  );
}
