/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Tailwind CSS Configuration for Next.js App
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Configure Tailwind CSS utility-first styling system
 * - Define content sources for class name scanning (PurgeCSS)
 * - Enable design tokens and custom theme extensions
 *
 * Responsibilities:
 * - Owns: Content glob patterns (determines which files Tailwind scans)
 * - Owns: Theme customization (colors, fonts, spacing)
 * - Owns: Plugin registration (forms, typography, etc.)
 * - Does NOT own: CSS file imports (handled by PostCSS/Next.js)
 *
 * Key Flows:
 * - Build time: Tailwind scans content files → generates CSS → purges unused
 * - Dev time: JIT compiler watches files → regenerates CSS on change
 *
 * Inputs/Outputs:
 * - Input: TSX/JSX files with className="..." attributes
 * - Output: Generated CSS file with only used utility classes
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: tailwindcss (CSS framework)
 * - Internal: Scans apps/web and packages/ui source files
 *
 * State & Invariants:
 * - Invariant: content patterns must include packages/ui (shared components)
 * - Invariant: Pattern must match all component directories (app/, components/, features/)
 * - Assumption: All styled files use .tsx or .jsx extensions
 *
 * Error Handling:
 * - Missing content paths: Classes not purged, bloated CSS output
 * - Invalid globs: Tailwind warns, may miss files
 * - Typo in className: Class included in output (dead CSS)
 *
 * Performance Notes:
 * - JIT mode: Faster dev builds (generates only used classes on demand)
 * - Production: PurgeCSS removes unused classes (typical 3MB → 10KB)
 * - Hot path: className changes trigger sub-second CSS rebuild
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - User input should never touch className (XSS risk)
 *
 * Testing Notes:
 * - Test: Run `npm run build`, verify CSS size <50KB
 * - Test: Check no unused classes in production bundle
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Removing content paths may break styles (classes purged unexpectedly)
 * - Theme changes may affect existing components (visual regression)
 * - Plugin addition may increase bundle size
 *
 * Owner Boundaries:
 * - PostCSS config: apps/web/postcss.config.js
 * - Global styles: apps/web/app/globals.css
 * - Design tokens: packages/ui/src/tokens/ (future)
 *
 * AI Navigation Tags:
 * #styling #tailwind #css #ui #build #purge
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
