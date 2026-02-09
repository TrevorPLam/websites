/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ESLint Configuration for UI Package
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Extend shared base ESLint configuration from @repo/eslint-config
 * - Apply library-specific linting rules (not Next.js-specific)
 * - Ensure consistent code quality for reusable UI components
 *
 * Responsibilities:
 * - Owns: Config inheritance (delegates to shared config)
 * - Does NOT own: Actual linting rules (defined in packages/config/eslint-config/library.js)
 *
 * Key Flows:
 * - ESLint reads this file → imports shared config → applies rules to package
 * - CI/dev: Runs `eslint .` → validates component code → reports issues
 *
 * Inputs/Outputs:
 * - Input: React component files (.tsx), utility files (.ts)
 * - Output: Lint warnings/errors
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: eslint (linter)
 * - Internal: @repo/eslint-config (shared library rules)
 *
 * State & Invariants:
 * - Invariant: Must import from @repo/eslint-config (not /next variant)
 * - Invariant: File must use .mjs extension (ESM module)
 * - Assumption: UI package is framework-agnostic (no Next.js rules)
 *
 * Error Handling:
 * - Missing shared config: ESLint fails with "Cannot find module" error
 * - Invalid syntax: ESLint fails with parse error
 * - Lint violations: Reports errors based on shared rules
 *
 * Performance Notes:
 * - Fast linting (small package scope)
 * - ESLint caching speeds up repeated runs
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - Linting rules help catch React-specific issues (hooks, props)
 *
 * Testing Notes:
 * - Test: Run `npm run lint`, verify no errors
 * - Test: Introduce lint violation, verify it's caught
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Changing to /next import adds unnecessary Next.js rules
 * - Removing config leaves package unlinted (dangerous)
 * - Wrong extension (.js vs .mjs) breaks ESM import
 *
 * Owner Boundaries:
 * - Shared rules: packages/config/eslint-config/library.js
 * - Component source: packages/ui/src/components/
 * - CI linting: .github/workflows/ci.yml
 *
 * AI Navigation Tags:
 * #eslint #lint #config #ui #library #react
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Extend from shared base ESLint configuration
import config from '@repo/eslint-config';

export default config;
