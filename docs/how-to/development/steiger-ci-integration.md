---
title: "Steiger Ci Integration"
description: "> **Reference Documentation — February 2026**"
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: intermediate
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "steiger", "integration"]
legacy_path: "linting\steiger-ci-integration.md"
---
# Steiger Ci Integration

> **Reference Documentation — February 2026**

## Overview

Steiger is the official FSD linter. Integrating it into CI ensures that architectural violations — wrong layer imports, missing `index.ts` public APIs, insignificant slices — are caught automatically before merging. [github](https://github.com/feature-sliced/documentation)

---

## Installation

```bash
pnpm add -D steiger @feature-sliced/steiger-plugin
```

---

## Configuration

```typescript
// .steiger.config.ts (repo root)
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // Error on any slice that is never imported anywhere
      '@feature-sliced/insignificant-slice': 'error',

      // Error on direct cross-layer imports not using @x
      '@feature-sliced/no-cross-imports': 'error',

      // Error on missing public API (index.ts)
      '@feature-sliced/public-api': 'error',

      // Error on imports skipping a layer
      '@feature-sliced/layers-slices': 'error',

      // Warn on ambiguously named slices (should be noun for entities, verb for features)
      '@feature-sliced/ambiguous-slice-names': 'warn',
    },
  },
  {
    // Exclude auto-generated files
    files: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    rules: {
      '@feature-sliced/no-cross-imports': 'off',
    },
  },
]);
```

---

## Running Steiger

```bash
# Check a specific app
pnpm steiger apps/marketing/src

# Check all apps
pnpm steiger apps/*/src packages/*/src

# Add to turbo.json pipeline
```

```json
// turbo.json
{
  "tasks": {
    "lint:arch": {
      "dependsOn": [],
      "cache": true,
      "inputs": ["src/**/*.ts", "src/**/*.tsx", ".steiger.config.ts"]
    }
  }
}
```

---

## GitHub Actions Integration

```yaml
# .github/workflows/ci.yml (additions)
- name: FSD Architecture Check (Steiger)
  run: pnpm steiger apps/*/src packages/*/src
  # Reports all violations; fails CI on any 'error' level rule
```

---

## Common Violations and Fixes

| Violation             | Cause                                      | Fix                                         |
| --------------------- | ------------------------------------------ | ------------------------------------------- |
| `insignificant-slice` | Slice has no importers                     | Delete or merge into an existing slice      |
| `no-cross-imports`    | `features/a` imports `features/b` directly | Use `@x` notation or lift to `entities/`    |
| `public-api`          | Slice missing `index.ts`                   | Create `index.ts` and export public surface |
| `layers-slices`       | `shared/` importing from `entities/`       | Move shared code down to `shared/lib/`      |

---

## References

- Steiger GitHub — https://github.com/feature-sliced/steiger
- FSD Steiger Plugin — https://github.com/feature-sliced/steiger/tree/main/packages/steiger-plugin-fsd
- FSD CI Integration — https://feature-sliced.design/docs/guides/tech/with-steiger

---