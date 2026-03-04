/**
 * @file sd.config.js
 * @summary Style Dictionary v4 configuration for design token compilation.
 * @description Reads source tokens from `packages/design-tokens/tokens/` and
 *   generates platform-specific outputs:
 *
 *   - CSS custom properties  → `packages/design-tokens/generated/tokens.css`
 *   - JavaScript constants   → `packages/design-tokens/generated/tokens.cjs`
 *   - TypeScript declarations → `packages/design-tokens/generated/tokens.d.ts`
 *
 *   Changing a token value in `tokens/tokens.json` and running
 *   `pnpm build:tokens` will propagate the change to all output files
 *   without any code changes in consumer packages.
 *
 * @see https://styledictionary.com/
 * @security Build-time configuration only; no secrets or runtime data processed.
 * @adr none
 * @requirements TASK-DS-001
 *
 * @example
 * ```sh
 * # Compile all token platforms
 * npx style-dictionary build --config sd.config.js
 *
 * # Or via package script
 * pnpm build:tokens
 * ```
 */

/** @type {import('style-dictionary').Config} */
export default {
  // ─── Sources ──────────────────────────────────────────────────────────────
  // All JSON files inside the tokens directory are merged into one token tree.
  source: ['packages/design-tokens/tokens/**/*.json'],

  // ─── Log level ────────────────────────────────────────────────────────────
  log: {
    verbosity: 'default',
    warnings: 'warn',
  },

  // ─── Platforms ────────────────────────────────────────────────────────────
  platforms: {
    // ── CSS custom properties ──────────────────────────────────────────────
    css: {
      transformGroup: 'css',
      prefix: 'dt',
      buildPath: 'packages/design-tokens/generated/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            // Wrap all variables in :root for global availability.
            selector: ':root',
            outputReferences: true,
            // 'generatedFileHeader' is a Style Dictionary built-in that emits
            // a "Do not edit — auto-generated" comment block at the top of the file.
            fileHeader: 'generatedFileHeader',
          },
        },
        {
          // Dark-mode overrides using the `color.dark.*` token group.
          destination: 'tokens.dark.css',
          format: 'css/variables',
          filter: (token) => token.path[0] === 'color' && token.path[1] === 'dark',
          options: {
            selector: '[data-theme="dark"], .dark',
            outputReferences: false,
            // 'generatedFileHeader' is a Style Dictionary built-in that emits
            // a "Do not edit — auto-generated" comment block at the top of the file.
            fileHeader: 'generatedFileHeader',
          },
        },
      ],
    },

    // ── JavaScript (CommonJS) constants ────────────────────────────────────
    js: {
      transformGroup: 'js',
      buildPath: 'packages/design-tokens/generated/',
      files: [
        {
          destination: 'tokens.cjs',
          format: 'javascript/module-flat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },

    // ── TypeScript declarations ────────────────────────────────────────────
    ts: {
      transformGroup: 'js',
      buildPath: 'packages/design-tokens/generated/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
          options: {
            outputReferences: false,
          },
        },
      ],
    },

    // ── JSON (raw resolved values, useful for Figma sync) ─────────────────
    json: {
      transformGroup: 'js',
      buildPath: 'packages/design-tokens/generated/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
          options: {
            outputReferences: false,
          },
        },
      ],
    },
  },
};
