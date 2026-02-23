<!--
/**
 * @file steiger-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for steiger documentation.
 * @entrypoints docs/guides/steiger-documentation.md
 * @exports steiger documentation
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

# Steiger: Official Documentation

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Introduction

Steiger is the official architectural linter for Feature-Sliced Design (FSD). It is a universal file structure and project architecture linter designed to help teams enforce and maintain compliance with FSD conventions. It is currently in active development and is considered production-ready .

## 1. Installation

You can add Steiger to your project using your preferred package manager .

```bash
# Using npm
npm i -D steiger @feature-sliced/steiger-plugin

# Using pnpm
pnpm add -D steiger @feature-sliced/steiger-plugin

# Using yarn
yarn add -D steiger @feature-sliced/steiger-plugin
```

The `@feature-sliced/steiger-plugin` package contains the ruleset for validating FSD compliance.

## 2. Basic Usage

To run Steiger on your source code, use the following command :

```bash
npx steiger ./src
```

For a better development experience, you can run Steiger in watch mode. It will automatically re-run when files change .

```bash
npx steiger ./src --watch
```

## 3. Configuration

Steiger is designed to be **zero-config**. It works out of the box with the recommended FSD ruleset. However, for projects that need to disable or customize rules, Steiger offers a flexible configuration system powered by `cosmiconfig` .

You can create a configuration file in the root of your project, such as `steiger.config.js` or `steiger.config.ts`.

### 3.1 Configuration File Syntax

The configuration file uses a syntax heavily inspired by ESLint. You import the `defineConfig` helper and the FSD plugin to build your config array .

```typescript
// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  // Start with the recommended FSD configuration
  ...fsd.configs.recommended,

  // Customize rules for specific files
  {
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off', // Disable the public-api rule for the Shared layer
    },
  },

  // Ignore entire directories
  {
    ignores: ['**/__mocks__/**', '**/*.test.ts'],
  },

  // More specific overrides with their own ignore patterns
  {
    files: ['./src/widgets/**'],
    ignores: ['**/deprecated-widget/**'],
    rules: {
      'fsd/no-segmentless-slices': 'off',
    },
  },
]);
```

## 4. Rules

Steiger includes a comprehensive set of rules to validate your project's structure. The following table details the built-in rules .

| Rule Name                              | Description                                                                                                                                |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **`fsd/ambiguous-slice-names`**        | Forbids slice names that match segment names in the Shared layer (e.g., `shared/ui/my-button` is ambiguous).                               |
| **`fsd/excessive-slicing`**            | Flags layers that have too many ungrouped slices or too many slices in a group, promoting navigability.                                    |
| **`fsd/forbidden-imports`**            | Enforces the core FSD import rule by forbidding imports from higher layers and cross-imports between slices on the same layer.             |
| **`fsd/no-cross-imports`**             | A more granular rule that specifically forbids cross-imports between slices on the same layer.                                             |
| **`fsd/no-higher-level-imports`**      | Specifically forbids imports from higher layers (e.g., a `feature` importing from a `page`).                                               |
| **`fsd/inconsistent-naming`**          | Ensures all entities are named consistently, particularly in terms of pluralization (e.g., `user` vs `users`).                             |
| **`fsd/insignificant-slice`**          | Detects slices (e.g., in `features` or `entities`) that have very few or zero references, suggesting they should be merged into a page .   |
| **`fsd/no-layer-public-api`**          | Forbids having `index` files on the layer level (e.g., `features/index.ts`), which can create unwanted coupling.                           |
| **`fsd/no-public-api-sidestep`**       | Prevents imports that bypass a slice's public API to access internal modules directly.                                                     |
| **`fsd/no-reserved-folder-names`**     | Forbids creating subfolders in segments that have the same name as other conventional segments.                                            |
| **`fsd/no-segmentless-slices`**        | Requires that slices have internal segments (`ui`, `model`, etc.), rather than putting files directly in the slice folder.                 |
| **`fsd/no-segments-on-sliced-layers`** | Forbids placing segment folders directly inside a layer that is meant for slices (e.g., putting a `ui` folder directly inside `features`). |
| **`fsd/no-ui-in-app`**                 | Prevents the creation of a `ui` segment on the `app` layer, as the app layer is for composition, not UI components.                        |
| **`fsd/public-api`**                   | Requires that every slice (and segments on sliceless layers like `shared`) have a public API definition (an `index.ts` file).              |
| **`fsd/repetitive-naming`**            | Flags unnecessarily repetitive naming patterns within a slice or layer.                                                                    |
| **`fsd/segments-by-purpose`**          | Encourages grouping code by purpose rather than by technical essence.                                                                      |
| **`fsd/shared-lib-grouping`**          | Forbids having too many ungrouped modules in the `shared/lib` directory, encouraging further organization.                                 |
| **`fsd/typo-in-layer-name`**           | Ensures that all layer names are spelled correctly (e.g., `entitise` → `entities`).                                                        |
| **`fsd/no-processes`**                 | Discourages the use of the deprecated `processes` layer from older versions of FSD.                                                        |
| **`fsd/import-locality`**              | Enforces that imports from within the same slice are relative, while imports from other slices are absolute.                               |

## 5. Migration

Steiger uses a codemod to help migrate configuration files from older versions (pre-0.5.0) to the new format. Refer to the project's `MIGRATION_GUIDE.md` for detailed instructions .

## 5. Tool Integration

### 5.1 VS Code Extension

Steiger provides an official VS Code extension available on the Visual Studio Marketplace and Open VSX Registry:

- **Visual Studio Marketplace**: [biomejs.biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) (recommended for VS Code users)
- **Open VSX Registry**: [biomejs.biome](https://open-vsx.org/extension/biomejs/biome) (recommended for VSCodium users)

The extension provides real-time linting, error highlighting, and quick fixes directly in your editor.

### 5.2 CI/CD Integration

For automated enforcement in your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Steiger architectural linting
  run: npx steiger ./src --format=github
```

### 5.3 Pre-commit Hooks

Add Steiger to your pre-commit hooks for local enforcement:

```json
// package.json
{
  "simple-git-hooks": {
    "pre-commit": "npx steiger ./src && npm run lint"
  }
}
```

## 6. Migration from Pre-0.5.0

Version 0.5.0 introduced a new configuration file format. Use the provided codemod to automatically update your configuration:

```bash
npx @feature-sliced/steiger-plugin-codemod steiger.config.js
```

See the [Migration Guide](https://github.com/feature-sliced/steiger/blob/master/MIGRATION_GUIDE.md) for detailed instructions.

## 7. Conclusion

Steiger is an essential tool for any team adopting Feature-Sliced Design. By automating architectural linting, it ensures consistency, prevents accidental violations of dependency rules, and helps keep the codebase maintainable as it grows. Its configuration flexibility allows teams to tailor it to their specific needs without losing the benefits of a standardized structure.


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
