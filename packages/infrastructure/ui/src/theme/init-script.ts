/**
 * @file packages/infrastructure/ui/src/theme/init-script.ts
 * Task: [f-37] Theme System — server-safe theme init script
 *
 * Purpose: Generates an inline script string for flicker-free theme initialization.
 *          This module is intentionally server-safe (no 'use client') so it can be
 *          imported directly from Server Components (e.g., layout.tsx) to inject a
 *          synchronous <script> tag into <head> before hydration.
 *
 * Exports / Entry: getThemeInitScript
 * Used by: layout.tsx — inlined via dangerouslySetInnerHTML in <head>
 *
 * Invariants:
 *   - No React imports; no browser APIs at module level; pure function
 *   - Must remain server-safe: importing this file must never trigger 'use client' evaluation
 *
 * Status: @public
 */

const STORAGE_KEY = 'theme-color-mode';

/**
 * Generate an inline script string that sets the color mode attribute before
 * React hydrates. Include this in <head> via dangerouslySetInnerHTML to prevent
 * the flash of incorrect theme on first render.
 *
 * @example
 * // In your layout.tsx (Server Component):
 * import { getThemeInitScript } from '@repo/infrastructure-ui/theme/init-script';
 * <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
 */
export function getThemeInitScript(): string {
  return `
(function(){
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var valid = ['light','dark','system'];
    var pref = valid.indexOf(stored) !== -1 ? stored : 'system';
    var mode = pref === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : pref;
    document.documentElement.setAttribute('data-color-mode', mode);
  } catch(e) {}
})();
`.trim();
}
