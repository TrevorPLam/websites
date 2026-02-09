/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ESLint Configuration for Utils Package
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Extend shared base ESLint configuration from @repo/eslint-config
 * - Apply library-specific linting rules for utility functions
 * - Ensure consistent code quality for shared utilities
 *
 * Responsibilities:
 * - Owns: Config inheritance (delegates to shared config)
 * - Does NOT own: Actual linting rules (defined in packages/config/eslint-config/library.js)
 *
 * Key Flows:
 * - ESLint reads this file → imports shared config → applies rules to package
 * - CI/dev: Runs `eslint .` → validates utility code → reports issues
 *
 * Inputs/Outputs:
 * - Input: TypeScript utility files (.ts), test files (.test.ts)
 * - Output: Lint warnings/errors
 * - Side effects: None (readonly config)
 *
 * Dependencies:
 * - External: eslint (linter)
 * - Internal: @repo/eslint-config (shared library rules)
 *
 * State & Invariants:
 * - Invariant: Must import from @repo/eslint-config (base library config)
 * - Invariant: File must use .mjs extension (ESM module)
 * - Assumption: Utils package is framework-agnostic (pure functions)
 *
 * Error Handling:
 * - Missing shared config: ESLint fails with "Cannot find module" error
 * - Invalid syntax: ESLint fails with parse error
 * - Lint violations: Reports errors based on shared rules
 *
 * Performance Notes:
 * - Very fast linting (minimal code scope)
 * - ESLint caching speeds up repeated runs
 *
 * Security Notes:
 * - No security implications (build-time config)
 * - Linting rules help catch TypeScript issues
 *
 * Testing Notes:
 * - Test: Run `npm run lint`, verify no errors
 * - Test: Introduce lint violation, verify it's caught
 * - Mock: Not applicable (declarative config)
 *
 * Change Risks:
 * - Removing config leaves package unlinted (dangerous)
 * - Wrong extension (.js vs .mjs) breaks ESM import
 * - Changing import path breaks linting
 *
 * Owner Boundaries:
 * - Shared rules: packages/config/eslint-config/library.js
 * - Utility source: packages/utils/src/
 * - CI linting: .github/workflows/ci.yml
 *
 * AI Navigation Tags:
 * #eslint #lint #config #utils #library #typescript
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Extend from shared base ESLint configuration
import config from "@repo/eslint-config";

export default config;
