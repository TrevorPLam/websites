/**
 * @file packages/features/src/localization/rtl.ts
 * Purpose: RTL (Right-to-Left) support — dir attribute for html element.
 * Task: 2.36, C.11
 */

import { isRtlLocale } from './routing';

/** Returns 'rtl' for RTL locales, 'ltr' otherwise */
export function getLocaleDir(locale: string): 'rtl' | 'ltr' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}
