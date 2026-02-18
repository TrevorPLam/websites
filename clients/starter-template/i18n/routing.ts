/**
 * @file clients/starter-template/i18n/routing.ts
 * Purpose: next-intl routing configuration for locale-based URLs.
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
