/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PostCSS Configuration for Next.js App
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Configure CSS processing pipeline for Next.js build
 * - Enable Tailwind CSS utility generation and autoprefixer
 * - Transform modern CSS to browser-compatible output
 *
 * Responsibilities:
 * - Owns: Plugin order (determines CSS transformation sequence)
 * - Owns: Plugin configuration (Tailwind config path, autoprefixer targets)
 * - Does NOT own: CSS file imports (handled by Next.js)
 *
 * Key Flows:
 * - CSS import → PostCSS loader → Tailwind processing → Autoprefixer → output
 * - Tailwind generates utilities, autoprefixer adds vendor prefixes
 *
 * Inputs/Outputs:
 * - Input: CSS files (globals.css, component styles)
 * - Output: Transformed CSS with utility classes and vendor prefixes
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: postcss, tailwindcss, autoprefixer
 * - Internal: Reads tailwind.config.js for content and theme
 *
 * State & Invariants:
 * - Invariant: tailwindcss plugin must run before autoprefixer
 * - Invariant: Both plugins required for proper CSS generation
 * - Assumption: Next.js webpack config injects PostCSS loader
 *
 * Error Handling:
 * - Missing plugins: Build fails with "Cannot find module" error
 * - Wrong order: Autoprefixer may miss Tailwind-generated CSS
 * - Invalid config: PostCSS fails with parse error
 *
 * Performance Notes:
 * - Tailwind JIT mode: Fast incremental builds (<100ms)
 * - Autoprefixer: Minimal overhead (only adds prefixes where needed)
 * - Production: Output is minified and purged by Next.js
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - CSS output is static (no user input)
 *
 * Testing Notes:
 * - Test: Run `npm run build`, verify CSS contains vendor prefixes
 * - Test: Check Tailwind utilities present in output
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Removing tailwindcss plugin breaks all Tailwind utilities
 * - Removing autoprefixer may break styles in older browsers
 * - Plugin order change may cause unexpected CSS output
 *
 * Owner Boundaries:
 * - Tailwind config: apps/web/tailwind.config.js
 * - CSS files: apps/web/app/globals.css
 * - Next.js build: apps/web/next.config.js
 *
 * AI Navigation Tags:
 * #build #css #postcss #tailwind #autoprefixer
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
