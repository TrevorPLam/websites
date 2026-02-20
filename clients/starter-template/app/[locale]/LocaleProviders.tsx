'use client';

/**
 * @file clients/starter-template/app/[locale]/LocaleProviders.tsx
 * Purpose: Client-side provider composition for [locale] layout.
 * Composes NextIntlClientProvider and ThemeInjector via ProviderComposer.
 * Add more providers to the array as needed (e.g. TooltipProvider).
 */
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeInjector } from '@repo/ui';
import { ProviderComposer } from '@repo/infra/composition';
import type { ThemeColors } from '@repo/types';

type LocaleProvidersProps = {
  messages: React.ComponentProps<typeof NextIntlClientProvider>['messages'];
  theme: ThemeColors;
  children: React.ReactNode;
};

export function LocaleProviders({ messages, theme, children }: LocaleProvidersProps) {
  const providers = React.useMemo(
    () => [
      ({ children: c }: { children: React.ReactNode }) =>
        React.createElement(NextIntlClientProvider, { messages }, c),
      ({ children: c }: { children: React.ReactNode }) =>
        React.createElement(ThemeInjector, { theme }, c),
    ],
    [messages, theme]
  );
  return React.createElement(ProviderComposer, { providers, children });
}
