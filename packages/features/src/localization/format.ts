/**
 * @file packages/features/src/localization/format.ts
 * Purpose: Locale-aware formatting — currency, numbers, dates.
 * Task: 2.36, Priority 6
 */

/**
 * Format a number as currency using Intl.NumberFormat
 */
export function formatCurrency(
  value: number,
  options: {
    locale?: string;
    currency?: string;
  } = {}
): string {
  const { locale = 'en', currency = 'USD' } = options;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a number with locale-appropriate separators
 */
export function formatNumber(value: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale).format(value);
}
