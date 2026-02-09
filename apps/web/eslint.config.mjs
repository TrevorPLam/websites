/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ESLint Configuration for Next.js App
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Extend shared Next.js-specific ESLint configuration from @repo/eslint-config
 * - Inherit linting rules without duplication
 * - Enable consistent code quality across the app
 *
 * Responsibilities:
 * - Owns: Config inheritance (delegates to shared config)
 * - Does NOT own: Actual linting rules (defined in packages/config/eslint-config/next.js)
 *
 * Key Flows:
 * - ESLint reads this file → imports shared config → applies rules to workspace
 * - CI/dev: Runs `eslint .` → validates code → reports issues
 *
 * Inputs/Outputs:
 * - Input: Source files (.ts, .tsx, .js, .jsx)
 * - Output: Lint warnings/errors
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: eslint (linter)
 * - Internal: @repo/eslint-config/next (shared Next.js rules)
 *
 * State & Invariants:
 * - Invariant: Must import from @repo/eslint-config/next (not /library)
 * - Invariant: File must use .mjs extension (ESM module)
 * - Assumption: Shared config is properly published to monorepo
 *
 * Error Handling:
 * - Missing shared config: ESLint fails with "Cannot find module" error
 * - Invalid syntax: ESLint fails with parse error
 * - Lint violations: Reports errors based on shared rules
 *
 * Performance Notes:
 * - Minimal overhead (delegates to shared config)
 * - Caching enabled by default in ESLint
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - Linting rules help catch security issues (XSS, injection)
 *
 * Testing Notes:
 * - Test: Run `npm run lint`, verify no errors
 * - Test: Introduce lint violation, verify it's caught
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Changing import path breaks linting
 * - Removing config leaves app unlinted (dangerous)
 * - Wrong extension (.js vs .mjs) breaks ESM import
 *
 * Owner Boundaries:
 * - Shared rules: packages/config/eslint-config/next.js
 * - Base rules: packages/config/eslint-config/library.js
 * - CI linting: .github/workflows/ci.yml
 *
 * AI Navigation Tags:
 * #eslint #lint #config #nextjs #code-quality
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Extend from shared Next.js ESLint configuration
import config from '@repo/eslint-config/next';

export default config;
