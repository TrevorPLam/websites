/**
 * @file packages/features/src/localization/routing.ts
 * Purpose: Locale routing config — supported locales, default, RTL list.
 * Task: 2.36, C.11
 */

/** RTL locales (Right-to-Left writing direction) */
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;

export type Locale = 'en' | 'fr' | 'de' | 'es' | (typeof RTL_LOCALES)[number];

export interface LocaleConfig {
  locales: readonly string[];
  defaultLocale: string;
}

/** Default routing config — extend per client if needed */
export const routing: LocaleConfig = {
  locales: ['en'],
  defaultLocale: 'en',
};

/** Check if locale uses RTL direction */
export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as (typeof RTL_LOCALES)[number]);
}
