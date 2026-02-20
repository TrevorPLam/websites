'use client';

/**
 * @file clients/starter-template/app/[locale]/LocaleProviders.tsx
 * Purpose: Client-side provider composition for [locale] layout.
 * Uses ProviderComposer for context providers (NextIntlClientProvider, ThemeProvider, etc.).
 * ThemeInjector renders as a style-injecting sibling — it is NOT a context provider.
 *
 * Task 4.3: ThemeProvider from @repo/infrastructure-ui wired here so that useTheme()
 * is available throughout the subtree. Enables color mode toggle + persistence.
 * ThemeConfig is derived from the resolved siteConfig theme colors.
 */
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeInjector } from '@repo/ui';
import { ProviderComposer } from '@repo/infra/composition';
import { ThemeProvider } from '@repo/infrastructure-ui/theme';
import type { ThemeConfig, ThemeColors as InfraThemeColors } from '@repo/infrastructure-ui/theme';
import type { ThemeColors } from '@repo/types';

type WithChildren = { children: React.ReactNode };

type LocaleProvidersProps = {
  messages: React.ComponentProps<typeof NextIntlClientProvider>['messages'];
  theme: ThemeColors;
  children: React.ReactNode;
};

export function LocaleProviders({ messages, theme, children }: LocaleProvidersProps) {
  // Build a ThemeConfig for ThemeProvider from the resolved siteConfig theme colors.
  // ThemeColors from @repo/types and @repo/infrastructure-ui are structurally identical
  // (same keys, same HSL-without-hsl() format) — cast is safe.
  const themeConfig = React.useMemo<ThemeConfig>(
    () => ({
      id: 'site-theme',
      name: 'Site Theme',
      colors: theme as unknown as InfraThemeColors,
      // Dark mode color overrides applied on toggle (via applyTheme in ThemeProvider).
      darkColors: {
        background: '220 20% 8%',
        foreground: '220 14% 96%',
        card: '220 20% 12%',
        'card-foreground': '220 14% 96%',
        muted: '220 20% 16%',
        'muted-foreground': '220 10% 60%',
        border: '220 14% 20%',
        input: '220 14% 20%',
      },
      borderRadius: 'medium',
      shadows: 'medium',
    }),
    [theme]
  );

  // Context providers only — ThemeInjector is a style injector and must not wrap content.
  const providers = React.useMemo(
    (): React.ComponentType<WithChildren>[] => [
      ({ children: c }: WithChildren) => (
        <NextIntlClientProvider messages={messages}>{c}</NextIntlClientProvider>
      ),
      // Task 4.3: ThemeProvider enables useTheme() hook + dark/light mode toggle + persistence.
      ({ children: c }: WithChildren) => <ThemeProvider theme={themeConfig}>{c}</ThemeProvider>,
      // Add more context providers here as needed, e.g.:
      // ({ children: c }: WithChildren) => <TooltipProvider>{c}</TooltipProvider>,
    ],
    [messages, themeConfig]
  );

  return (
    <ProviderComposer providers={providers}>
      {/* ThemeInjector injects CSS custom properties as a <style> tag — sibling of content */}
      <ThemeInjector theme={theme} />
      {children}
    </ProviderComposer>
  );
}
