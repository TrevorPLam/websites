<!--
/**
 * @file react-compiler-docs.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for react compiler docs.
 * @entrypoints docs/guides/react-compiler-docs.md
 * @exports react compiler docs
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# React Compiler v1.0 — Official Documentation Reference

> **Version Reference:** React Compiler 1.0 (October 7, 2025) | babel-plugin-react-compiler@1.x
> **Purpose:** AI agent reference for React Compiler installation, lint-first rollout strategy,
> annotation mode, incremental adoption, and advanced configuration.

---

## Table of Contents

1. [What is React Compiler?](#what-is-react-compiler)
2. [How It Works](#how-it-works)
3. [Installation](#installation)
4. [Framework Integration](#framework-integration)
5. [Lint-First Rollout Strategy](#lint-first-rollout-strategy)
6. [Compilation Modes](#compilation-modes)
7. [Annotations (use memo / use no memo)](#annotations-use-memo--use-no-memo)
8. [Compiler Configuration Reference](#compiler-configuration-reference)
9. [Backwards Compatibility](#backwards-compatibility)
10. [What Happens to useMemo / useCallback / React.memo?](#what-happens-to-usememo--usecallback--reactmemo)
11. [Incremental Adoption Guide](#incremental-adoption-guide)
12. [swc Support (Experimental)](#swc-support-experimental)
13. [ESLint Compiler Rules](#eslint-compiler-rules)
14. [Verifying Compilation](#verifying-compilation)
15. [Production Results](#production-results)
16. [Upgrading the Compiler](#upgrading-the-compiler)
17. [Best Practices](#best-practices)

---

## What is React Compiler?

React Compiler is a **build-time optimizing compiler** that automatically memoizes your React
components and hooks. It eliminates the need for manual `useMemo`, `useCallback`, and `React.memo`
calls by analyzing your component's data flow and generating precisely scoped memoization at
compile time.

**Key characteristics:**

- Zero runtime overhead — memoization decisions made at build time
- Compatible with React 17, 18, and 19+
- Works with React Native
- Battle-tested on major Meta production apps (Meta Quest Store)
- Compiler-powered lint rules ship with `eslint-plugin-react-hooks@latest`
- Stable v1.0 released October 7, 2025 alongside React Conf 2025

**What the compiler does NOT do:**

- It does not run your components at build time
- It does not replace Suspense, Server Components, or Actions
- It does not change how you write React — you write the same idiomatic code
- It does not require adopting any new patterns

---

## How It Works

React Compiler operates as a Babel plugin (with experimental SWC support) and transforms your
source code through multiple analysis passes:

```
Source Code (JSX/TSX)
       │
       ▼
Babel AST → Compiler HIR (High-Level Intermediate Representation)
       │         Control Flow Graph (CFG) based
       ▼
Data Flow Analysis
  - Mutability tracking
  - Dependency detection
  - Optional chain resolution
  - Array index dependencies
       │
       ▼
Memoization Generation
  - Granular memo() calls
  - Conditional memoization (not possible with useMemo)
  - Automatic cache key derivation
       │
       ▼
Validation Passes
  - Rules of React enforcement
  - Diagnostics (surfaced via ESLint)
       │
       ▼
Transformed Output → Bundler
```

### What the Compiler Can Do That useMemo Cannot

```typescript
// Manual useMemo: cannot memoize after a conditional return
function ThemeProvider({ children, theme, isEnabled }) {
  if (!isEnabled) return null;  // Early return
  // useMemo cannot be called here due to Rules of Hooks
  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);  // Must be before return
  return <ThemeContext value={mergedTheme}>{children}</ThemeContext>;
}

// React Compiler: CAN memoize after a conditional return
function ThemeProvider({ children, theme, isEnabled }) {
  if (!isEnabled) return null;  // Compiler handles this correctly
  // Compiler generates precise memoization here automatically
  const mergedTheme = mergeTheme(theme);
  return <ThemeContext value={mergedTheme}>{children}</ThemeContext>;
}
```

---

## Installation

```bash
# npm
npm install --save-dev --save-exact babel-plugin-react-compiler@latest

# pnpm
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest

# yarn
yarn add --dev --exact babel-plugin-react-compiler@latest
```

> **Use `--save-exact`** — The compiler may change memoization behavior between versions in ways
> that can affect `useEffect` dependencies. Pin to an exact version in production.

### Verify Installation

```bash
npx react-compiler-healthcheck@latest
```

This tool checks:

- Whether your codebase is compatible
- How many components can be compiled
- Whether you're on a supported React version

---

## Framework Integration

### Next.js 16

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // OR for incremental adoption:
  reactCompiler: {
    compilationMode: 'annotation', // Only compile files with 'use memo'
  },
};

export default nextConfig;
```

```bash
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

### Vite (React)

```bash
npm install --save-dev vite-plugin-react babel-plugin-react-compiler@latest
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              target: '19', // '17' | '18' | '19'
            },
          ],
        ],
      },
    }),
  ],
});
```

### Remix

```bash
npm install --save-dev vite-plugin-babel babel-plugin-react-compiler@latest
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    remix(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
```

### Expo (SDK 54+)

```bash
# React Compiler is ENABLED BY DEFAULT in Expo SDK 54+
npx create-expo-app@latest
# No additional configuration needed
```

To explicitly configure in existing Expo apps:

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['babel-plugin-react-compiler', { target: '18' }]],
  };
};
```

### Standalone Babel

```bash
npm install --save-dev babel-plugin-react-compiler@latest
```

```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19', // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // MUST RUN FIRST
      // ... other plugins after
    ],
  };
};
```

> **Critical:** `babel-plugin-react-compiler` MUST run **first** in the Babel plugin pipeline.
> The compiler requires the original source information for sound analysis.

---

## Lint-First Rollout Strategy

The **recommended way to start adopting React Compiler** is to enable the ESLint rules first,
fix violations, then enable compilation. This lets you validate your codebase without changing
runtime behavior.

### Phase 1: Install ESLint Rules (Zero Risk)

```bash
npm install --save-dev eslint-plugin-react-hooks@latest
```

```javascript
// eslint.config.js (Flat Config — default for eslint-plugin-react-hooks v6)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
  // 'recommended' now includes compiler-powered rules
]);
```

```json
// .eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"]
}
```

> The compiler lint rules do NOT require the compiler to be installed. The linter is fully
> decoupled. There is zero risk in upgrading the ESLint plugin.

### Phase 2: Run and Fix Lint Errors

```bash
npx eslint src/ --rule 'react-hooks/react-compiler/*: error'
```

Common violations to fix before enabling the compiler:

```typescript
// ❌ setState in render (causes infinite loops)
function BadComponent({ items }) {
  const [count, setCount] = useState(0);
  setCount(items.length);  // Compiler lint: set-state-in-render
  return <div>{count}</div>;
}

// ✅ Fixed
function GoodComponent({ items }) {
  return <div>{items.length}</div>;  // Just use the prop directly
}
```

```typescript
// ❌ Expensive work inside effect + setState
function BadEffect({ data }) {
  const [processed, setProcessed] = useState([]);
  useEffect(() => {
    const result = data.map(expensiveTransform);  // Compiler lint: set-state-in-effect
    setProcessed(result);
  }, [data]);
  return <List items={processed} />;
}

// ✅ Fixed: compute during render (compiler will memoize automatically)
function GoodEffect({ data }) {
  const processed = data.map(expensiveTransform);  // Compiler memoizes this
  return <List items={processed} />;
}
```

```typescript
// ❌ Ref accessed during render
function BadRef() {
  const ref = useRef(null);
  console.log(ref.current);  // Compiler lint: refs — unsafe during render
  return <div ref={ref} />;
}
```

### Phase 3: Enable Compiler in Annotation Mode

Add `'use memo'` to a subset of files/components and enable annotation mode:

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: { compilationMode: 'annotation' },
};
```

```typescript
// components/heavy/DataGrid.tsx — opt this file in
'use memo';

export function DataGrid({ rows, columns }: DataGridProps) {
  // Entire file compiled automatically
}
```

### Phase 4: Gradually Enable Globally

After confirming no regressions in annotated files, enable globally:

```typescript
const nextConfig = {
  reactCompiler: true,
};
```

### Phase 5: Monitor for Regressions

- Run end-to-end tests after enabling globally
- Watch for unexpected `useEffect` firing frequency changes
- Check that `useMemo` values used as effect dependencies still behave correctly

---

## Compilation Modes

| Mode           | Config                            | Behavior                                        |
| -------------- | --------------------------------- | ----------------------------------------------- |
| **off**        | `reactCompiler: false` or omitted | Compiler disabled                               |
| **global**     | `reactCompiler: true`             | All components compiled                         |
| **annotation** | `compilationMode: 'annotation'`   | Only files/functions with `'use memo'` compiled |

```typescript
// Annotation mode configuration
const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
};
```

---

## Annotations (use memo / use no memo)

### Opt IN to compilation (annotation mode)

```typescript
// File-level: entire file compiled
'use memo';

export function Component() { ... }
export function AnotherComponent() { ... }
```

```typescript
// Function-level: only this function compiled
export function DataTable({ data }: Props) {
  'use memo';
  // Only this component is compiled
  return <table>...</table>;
}
```

### Opt OUT of compilation (global mode)

```typescript
// File-level: entire file skipped
'use no memo';

export function ComponentWithSideEffects() { ... }
```

```typescript
// Function-level: skip specific components
export function LiveMetrics() {
  'use no memo';
  // This component intentionally bypasses compilation
  // e.g., uses real-time subscriptions that should never memoize
}
```

### When to Use `'use no memo'`

- Components using third-party state managers that depend on reference equality
- Components with known Rules of React violations that haven't been fixed yet
- Components using legacy patterns incompatible with strict memoization
- Components where you need full control over render timing

---

## Compiler Configuration Reference

```typescript
// babel.config.js or as passed to framework plugins
const ReactCompilerConfig = {
  // Target React version compatibility
  // '17' | '18' | '19'
  // Default: auto-detected from package.json
  target: '19',

  // Compilation mode
  // 'infer' (default) | 'annotation' | 'all'
  compilationMode: 'infer',

  // Directories to include/exclude from compilation
  // Glob patterns relative to project root
  sources: (filename) => {
    // Compile everything except test files
    return !filename.includes('.test.') && !filename.includes('.spec.');
  },

  // Enable strict mode (errors instead of skipping problematic code)
  // Default: false
  panicThreshold: 'NONE', // 'NONE' | 'CRITICAL_ERRORS' | 'ALL_ERRORS'

  // Runtime import (for React <19 compatibility)
  // Required when target is '17' or '18'
  // runtimeModule: 'react-compiler-runtime',
};
```

### Per-Directory Configuration (Monorepos)

```javascript
// babel.config.js
const ReactCompilerConfig = {
  sources: (filename) => {
    // Only compile packages that have been audited
    return filename.includes('/packages/ui/') || filename.includes('/packages/features/');
  },
};
```

---

## Backwards Compatibility

React Compiler is compatible with React 17+. For React 17/18 targets:

```bash
npm install react-compiler-runtime
```

```typescript
// babel.config.js
const ReactCompilerConfig = {
  target: '18', // or '17'
  // runtimeModule auto-detected from react-compiler-runtime
};
```

The `react-compiler-runtime` package polyfills the `useMemoCache` hook used internally by the
compiler's generated memoization code.

---

## What Happens to useMemo / useCallback / React.memo?

### Short Answer

**Keep them for now.** The compiler works alongside existing manual memoization.

### Detailed Guidance

| Code                                             | Recommendation                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| `useMemo` for complex computation                | **Compiler takes over.** Can remove after validating with tests.        |
| `useCallback` for stable callbacks               | **Compiler takes over.** Can remove after validating.                   |
| `React.memo` on components                       | **Compiler takes over.** Can remove after validating.                   |
| `useMemo` for `useEffect` dependency stability   | **Keep as escape hatch** — compiler may or may not memoize the same way |
| Manual memoization of third-party library inputs | **Keep** — third-party libraries may depend on reference equality       |

```typescript
// BEFORE compiler
const filteredItems = useMemo(() => items.filter((item) => item.active), [items]);
const handleClick = useCallback(() => onSelect(id), [onSelect, id]);
const MemoizedCard = React.memo(Card);

// AFTER compiler (compiler handles above automatically)
// These are now redundant but still work — remove gradually with testing
const filteredItems = items.filter((item) => item.active); // Compiler memoizes this
const handleClick = () => onSelect(id); // Compiler memoizes this
// React.memo wrapper can be removed; component is auto-memoized
```

> **Important:** Removing existing memoization can change compilation output. Always test before
> removing `useMemo`/`useCallback` from existing code.

---

## Incremental Adoption Guide

### Step 1: Health Check

```bash
npx react-compiler-healthcheck@latest
```

Output includes:

- Number of components that can be compiled out of total
- Violations of Rules of React found
- Recommended next steps

### Step 2: Fix Rules of React Violations

Address all errors from `eslint-plugin-react-hooks` `recommended` preset before enabling the
compiler. The compiler cannot correctly optimize code that breaks the Rules of React.

Key rules to verify:

- `react-hooks/rules-of-hooks` — Hooks called at top level only
- `react-hooks/exhaustive-deps` — All effect dependencies declared
- `react-hooks/react-compiler/set-state-in-render` — No setState during render
- `react-hooks/react-compiler/refs` — No ref access during render

### Step 3: Enable with Annotation Mode

```typescript
// next.config.ts or babel.config.js
reactCompiler: {
  compilationMode: 'annotation';
}
```

Start with the most performance-critical, well-tested components. Add `'use memo'` progressively.

### Step 4: Validate with Tests

Before going global, run your test suite with annotation mode enabled on your entire component
library. Watch for:

- `useEffect` firing more or fewer times than expected
- Values that were previously stable references becoming unstable
- Third-party components that expect reference equality

### Step 5: Enable Globally

```typescript
reactCompiler: true;
```

### Step 6: Monitor in Production

- Track interaction latency (should improve 2-12% on average)
- Watch for any new crash reports from memoization changes
- Compare memory usage before/after (should stay neutral)

---

## swc Support (Experimental)

The React team is collaborating with `@kdy1dev` (Kang Dongyoon) from the swc team on a native
SWC plugin for React Compiler. This will eliminate the Babel dependency and significantly improve
build performance:

```bash
# Not yet stable; for Next.js apps use:
npm install next@latest  # 15.3.1+ includes improved swc integration
```

When the SWC plugin stabilizes, migration will be:

```javascript
// Future: vite.config.ts with oxc/rolldown
import reactCompiler from '@react-compiler/plugin-oxc';

export default defineConfig({
  plugins: [reactCompiler()],
});
```

---

## ESLint Compiler Rules

### Setup

```bash
# Remove old plugin (if installed)
npm uninstall eslint-plugin-react-compiler

# Install updated hooks plugin (includes all compiler rules)
npm install --save-dev eslint-plugin-react-hooks@latest
```

### Full Rule Reference

```javascript
// eslint.config.js — all compiler rules available
import reactHooks from 'eslint-plugin-react-hooks';

export defaul

```

---

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

## Overview

[Add content here]

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]

## Verifying Compilation

[Add content here]

## Production Results

[Add content here]

## Upgrading the Compiler

[Add content here]
