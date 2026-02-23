# steiger-linting-configuration.md

## Overview

Steiger is a universal file structure and project architecture linter for Feature-Sliced Design (FSD) methodology. This documentation covers Steiger's configuration, rule definitions, integration patterns, and best practices for maintaining clean architecture in 2026. Note: Steiger is not currently implemented in this monorepo but is documented for future adoption.

## Installation and Setup

### Basic Installation

```bash
# Install Steiger
npm install --save-dev steiger

# Install FSD plugin for Feature-Sliced Design rules
npm install --save-dev @feature-sliced/steiger-plugin

# Optional: Install ESLint integration
npm install --save-dev eslint-plugin-steiger
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint:arch": "steiger ./src",
    "lint:arch:watch": "steiger ./src --watch",
    "lint:arch:fix": "steiger ./src --fix"
  }
}
```

## Configuration Files

### TypeScript Configuration

```typescript
// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'warn',
      'fsd/no-app-in-slices': 'error',
      'fsd/no-public-api-in-slices': 'error',
      'fsd/no-index-in-slices': 'warn',
    },
  },
]);
```

### JavaScript Configuration

```javascript
// steiger.config.js
const { defineConfig } = require('steiger');
const fsd = require('@feature-sliced/steiger-plugin');

module.exports = defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'warn',
      'fsd/no-app-in-slices': 'error',
    },
  },
]);
```

## Feature-Sliced Design Rules

### Core Architecture Rules

#### fsd/no-processes

**Severity**: Error

Prevents the creation of `processes` segments in FSD architecture.

```typescript
// ❌ Incorrect
src/app/processes/user-process/
src/features/auth/processes/login-process/

// ✅ Correct (use app or features directly)
src/app/
src/features/auth/
```

#### fsd/no-shared-ui

**Severity**: Warning

Discourages shared UI components in the `shared` segment.

```typescript
// ❌ Discouraged
src/shared/ui/button/
src/shared/ui/input/

// ✅ Preferred (use ui library or feature-specific)
src/components/ui/  // External UI library
src/features/auth/ui/  // Feature-specific UI
```

#### fsd/no-app-in-slices

**Severity**: Error

Prevents `app` layer within feature slices.

```typescript
// ❌ Incorrect
src/features/auth/app/
src/features/user/app/

// ✅ Correct (app is at root level)
src/app/
src/features/auth/
```

#### fsd/no-public-api-in-slices

**Severity**: Error

Prevents `public-api` segments within feature slices.

```typescript
// ❌ Incorrect
src/features/auth/public-api/
src/features/user/public-api/

// ✅ Correct (use api segment or external layer)
src/shared/api/
src/features/auth/api/
```

### Import Rules

#### fsd/import-sources

**Severity**: Error

Enforces proper import patterns between FSD layers.

```typescript
// ❌ Incorrect (cross-layer imports)
import { UserComponent } from '../shared/ui/user';
import { authApi } from '../../features/auth/api';

// ✅ Correct (proper layering)
import { UserComponent } from '@/shared/ui';
import { authApi } from '@/features/auth';
```

#### fsd/layers-import

**Severity**: Error

Controls import directions between FSD layers.

```typescript
// ❌ Incorrect (lower layer importing from higher)
// In shared layer importing from features
import { UserFeature } from '../features/user';

// ✅ Correct (higher layers import from lower)
// In features layer importing from shared
import { apiClient } from '../shared/api';
```

### Naming Conventions

#### fsd/naming-convention

**Severity**: Warning

Enforces consistent naming patterns for FSD segments.

```typescript
// ❌ Incorrect
src/features/user-management/
src/features/authentication/
src/shared/ui-components/

// ✅ Correct
src/features/user/
src/features/auth/
src/shared/ui/
```

## Configuration Options

### Rule Configuration

```typescript
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Configure individual rules
      'fsd/no-processes': {
        severity: 'error',
        options: {
          // Rule-specific options
        },
      },

      // Disable specific rules
      'fsd/no-shared-ui': 'off',

      // Custom rule configuration
      'fsd/import-sources': {
        severity: 'error',
        options: {
          allowedPatterns: ['@shared/*', '@features/*'],
          forbiddenPatterns: ['**/processes/**'],
        },
      },
    },
  },
]);
```

### File Patterns

```typescript
export default defineConfig([
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'], // Include all source files
    exclude: ['**/*.test.*', '**/*.stories.*'], // Exclude tests and stories
    rules: {
      'fsd/no-processes': 'error',
    },
  },
  {
    files: ['packages/**/*.{js,ts,jsx,tsx}'], // Different rules for packages
    rules: {
      'fsd/no-shared-ui': 'warn',
    },
  },
]);
```

## Integration with Development Tools

### VS Code Integration

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.steiger": "explicit"
  },
  "steiger.enable": true,
  "steiger.trace.server": "verbose"
}
```

### ESLint Integration

```json
// .eslintrc.json
{
  "extends": ["@repo/eslint-config"],
  "plugins": ["steiger"],
  "rules": {
    "steiger/no-processes": "error",
    "steiger/no-shared-ui": "warn"
  }
}
```

### Pre-commit Hooks

```json
// .lintstagedrc.json
{
  "*.{js,ts,jsx,tsx}": ["steiger --fix", "eslint --fix"]
}
```

## Advanced Configuration

### Custom Rules

```typescript
// steiger.config.ts
import { defineConfig } from 'steiger';
import { createRule } from 'steiger';

const customRule = createRule({
  name: 'custom/no-direct-state-imports',
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent direct imports from state management',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.includes('store') || node.source.value.includes('state')) {
          context.report({
            node,
            message: 'Direct state imports are not allowed',
          });
        }
      },
    };
  },
});

export default defineConfig([
  fsd.configs.recommended,
  {
    rules: {
      'custom/no-direct-state-imports': 'error',
    },
  },
]);
```

### Environment-specific Configuration

```typescript
// steiger.config.ts
import { defineConfig } from 'steiger';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig([
  fsd.configs.recommended,
  {
    rules: {
      'fsd/no-shared-ui': isDevelopment ? 'warn' : 'error',
      'fsd/naming-convention': {
        severity: 'error',
        options: {
          strict: !isDevelopment,
        },
      },
    },
  },
]);
```

## Migration from 0.4.0

### Breaking Changes

Version 0.5.0 introduced a new configuration format:

```typescript
// Before 0.4.0
module.exports = {
  extends: ['@feature-sliced/steiger-plugin/recommended'],
  rules: {
    'no-processes': 'error',
  },
};

// After 0.5.0
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.recommended,
  {
    rules: {
      'fsd/no-processes': 'error',
    },
  },
]);
```

### Automated Migration

```bash
# Run the automated migration
npx @feature-sliced/steiger-plugin migrate

# Or manually update configuration
npm install --save-dev @feature-sliced/steiger-plugin@latest
```

## Best Practices

### Configuration Management

1. **Start with Recommended**: Use `fsd.configs.recommended` as baseline
2. **Gradual Adoption**: Enable rules incrementally
3. **Team Alignment**: Ensure team agrees on rule severity
4. **Documentation**: Document custom rules and exceptions
5. **Regular Updates**: Keep Steiger and plugins updated

### Rule Selection

```typescript
// Recommended starting configuration
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Critical architecture rules (error)
      'fsd/no-processes': 'error',
      'fsd/no-app-in-slices': 'error',
      'fsd/no-public-api-in-slices': 'error',

      // Important guidelines (warn)
      'fsd/no-shared-ui': 'warn',
      'fsd/naming-convention': 'warn',

      // Optional rules
      'fsd/import-sources': 'error',
    },
  },
]);
```

### Performance Optimization

1. **File Filtering**: Exclude test files and build artifacts
2. **Rule Specificity**: Enable only necessary rules
3. **Caching**: Use file system caching for large projects
4. **Parallel Execution**: Run multiple linters in parallel

```typescript
export default defineConfig([
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: ['**/*.test.*', '**/*.stories.*', '**/node_modules/**'],
    rules: {
      'fsd/no-processes': 'error',
    },
  },
]);
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/architecture-lint.yml
name: Architecture Lint

on: [push, pull_request]

jobs:
  steiger:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run architecture linting
        run: pnpm lint:arch
```

### Pre-commit Integration

```yaml
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx steiger ./src --max-warnings=0
```

## Troubleshooting

### Common Issues

1. **Configuration Not Found**: Ensure `steiger.config.ts` is in project root
2. **Plugin Not Found**: Install `@feature-sliced/steiger-plugin`
3. **Rule Conflicts**: Check for conflicting ESLint rules
4. **Performance Issues**: Exclude unnecessary files and use caching

### Debug Commands

```bash
# Check configuration
npx steiger --print-config

# Run with verbose output
npx steiger ./src --verbose

# Test specific rules
npx steiger ./src --rule=fsd/no-processes

# Generate configuration documentation
npx steiger --help
```

### Performance Issues

```bash
# Profile Steiger performance
time npx steiger ./src

# Use file system cache
npx steiger ./src --cache

# Limit file scope
npx steiger ./src --max-files=1000
```

## Integration with This Monorepo

### Current State

Steiger is not currently implemented in this marketing websites monorepo. The project uses:

- ESLint for code quality
- TypeScript for type safety
- Custom architecture patterns

### Future Implementation Plan

```typescript
// Proposed steiger.config.ts for this monorepo
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['clients/**/*.{js,ts,jsx,tsx}', 'packages/features/**/*.{js,ts,jsx,tsx}'],
    exclude: ['**/*.test.*', '**/*.stories.*', '**/node_modules/**'],
    rules: {
      // Core FSD rules
      'fsd/no-processes': 'error',
      'fsd/no-app-in-slices': 'error',
      'fsd/no-public-api-in-slices': 'error',

      // Import rules
      'fsd/import-sources': 'error',
      'fsd/layers-import': 'error',

      // Naming conventions
      'fsd/naming-convention': 'warn',
    },
  },
]);
```

### Migration Steps

1. **Install Dependencies**:

   ```bash
   pnpm add -D steiger @feature-sliced/steiger-plugin
   ```

2. **Create Configuration**: Add `steiger.config.ts` to root

3. **Update Scripts**: Add linting scripts to package.json

4. **CI Integration**: Add architecture linting to GitHub Actions

5. **Team Training**: Document FSD patterns and rules

## References

- [Steiger GitHub Repository](https://github.com/feature-sliced/steiger)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Steiger Configuration Guide](https://github.com/feature-sliced/steiger/blob/master/README.md)
- [FSD Rules Reference](https://github.com/feature-sliced/steiger/blob/master/docs/rules.md)
- [Migration Guide](https://github.com/feature-sliced/steiger/discussions/53)

## Core Configuration

### Basic Configuration Structure

```typescript
import { defineConfig } from 'steiger';

export default defineConfig([
  // Global configuration
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Rule configurations
    },
  },

  // File-specific configurations
  {
    files: ['src/**/*.test.{js,ts,jsx,tsx}'],
    rules: {
      // Test-specific rules
    },
  },
]);
```

### Plugin Integration

```typescript
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  // Recommended FSD configuration
  fsd.configs.recommended,

  // Strict FSD configuration
  fsd.configs.strict,

  // Custom configuration
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'warn',
      'fsd/no-app-in-slices': 'error',
      'fsd/layer-naming': 'error',
      'fsd/slice-naming': 'error',
    },
  },
]);
```

## Rule Configuration

### Available Rules

#### `fsd/no-processes`

Prevents processes layer in slices (processes should be app-level only).

```typescript
{
  rules: {
    'fsd/no-processes': 'error' // 'off' | 'warn' | 'error'
  }
}
```

#### `fsd/no-shared-ui`

Prevents UI components in shared layer (UI should be in slices or segments).

```typescript
{
  rules: {
    'fsd/no-shared-ui': 'warn'
  }
}
```

#### `fsd/no-app-in-slices`

Prevents app layer inside slices (app should be top-level only).

```typescript
{
  rules: {
    'fsd/no-app-in-slices': 'error'
  }
}
```

#### `fsd/layer-naming`

Enforces proper layer naming conventions.

```typescript
{
  rules: {
    'fsd/layer-naming': ['error', {
      // Custom layer naming rules
      allowedLayers: ['app', 'processes', 'shared', 'pages', 'widgets', 'features', 'entities', 'segments'],
      caseStyle: 'kebab-case'
    }]
  }
}
```

#### `fsd/slice-naming`

Enforces proper slice naming conventions.

```typescript
{
  rules: {
    'fsd/slice-naming': ['error', {
      // Custom slice naming rules
      caseStyle: 'kebab-case',
      allowNumbers: true,
      minLength: 3,
      maxLength: 50
    }]
  }
}
```

#### `fsd/import-order`

Enforces proper import order between layers.

```typescript
{
  rules: {
    'fsd/import-order': ['error', {
      // Define layer hierarchy
      layerOrder: [
        'app',
        'processes',
        'pages',
        'widgets',
        'features',
        'entities',
        'shared',
        'segments'
      ],
      // Allow same-layer imports
      allowSameLayer: true,
      // Allow cross-layer imports with restrictions
      crossLayerRules: {
        'features': ['entities', 'shared', 'segments'],
        'widgets': ['features', 'entities', 'shared', 'segments'],
        'pages': ['widgets', 'features', 'entities', 'shared', 'segments']
      }
    }]
  }
}
```

### Rule Severity Levels

```typescript
{
  rules: {
    // Error - will fail the build
    'fsd/no-processes': 'error',

    // Warning - will show warning but won't fail
    'fsd/no-shared-ui': 'warn',

    // Off - rule is disabled
    'fsd/no-app-in-slices': 'off',

    // Custom configuration with options
    'fsd/layer-naming': ['error', {
      allowedLayers: ['app', 'processes', 'shared'],
      caseStyle: 'kebab-case'
    }]
  }
}
```

## Advanced Configuration

### File Pattern Matching

```typescript
export default defineConfig([
  {
    // Apply to all TypeScript files
    files: ['**/*.{ts,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
    },
  },

  {
    // Apply only to source files (exclude tests)
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'fsd/no-shared-ui': 'error',
    },
  },

  {
    // Apply to specific directories
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'fsd/slice-naming': [
        'error',
        {
          caseStyle: 'kebab-case',
          minLength: 3,
        },
      ],
    },
  },

  {
    // Exclude certain patterns
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'src/shared/ui/**', // Allow shared UI in specific location
      'src/**/*.stories.{ts,tsx}', // Ignore Storybook files
      'src/**/*.mock.{ts,tsx}', // Ignore mock files
    ],
    rules: {
      'fsd/no-shared-ui': 'off',
    },
  },
]);
```

### Custom Rules

```typescript
// custom-rules.ts
import { Rule } from 'steiger';

export const noIndexFiles: Rule = {
  meta: {
    name: 'no-index-files',
    description: 'Prevents index.ts files in slices',
  },

  create(context) {
    return {
      visitFile(node) {
        if (node.filename.endsWith('index.ts')) {
          const pathParts = node.filename.split('/');
          const sliceIndex = pathParts.findIndex((part) =>
            ['features', 'pages', 'widgets', 'entities'].includes(part)
          );

          if (sliceIndex !== -1) {
            context.report({
              node,
              message: 'Index files are not allowed in slices',
            });
          }
        }
      },
    };
  },
};

// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';
import { noIndexFiles } from './custom-rules';

export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-index-files': 'error',
    },
    plugins: [
      {
        rules: {
          'no-index-files': noIndexFiles,
        },
      },
    ],
  },
]);
```

### Environment-Specific Configuration

```typescript
// steiger.config.dev.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // More lenient in development
      'fsd/no-shared-ui': 'warn',
      'fsd/no-processes': 'warn',
      'fsd/layer-naming': 'warn',
    },
  },
]);
```

```typescript
// steiger.config.prod.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Strict in production
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'error',
      'fsd/no-app-in-slices': 'error',
      'fsd/layer-naming': 'error',
      'fsd/slice-naming': 'error',
    },
  },
]);
```

## Integration with Build Tools

### ESLint Integration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:steiger/recommended'],
  plugins: ['steiger'],
  rules: {
    'steiger/fsd-no-processes': 'error',
    'steiger/fsd-no-shared-ui': 'warn',
    'steiger/fsd-no-app-in-slices': 'error',
  },
};
```

### TypeScript Integration

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/app/*": ["src/app/*"],
      "@/processes/*": ["src/processes/*"],
      "@/shared/*": ["src/shared/*"],
      "@/pages/*": ["src/pages/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/segments/*": ["src/segments/*"]
    }
  }
}
```

### Vite Integration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import steiger from '@feature-sliced/steiger-plugin/vite';

export default defineConfig({
  plugins: [
    steiger({
      configFile: './steiger.config.ts',
    }),
  ],
});
```

### Next.js Integration

```javascript
// next.config.js
const withSteiger = require('@feature-sliced/steiger-plugin/next');

module.exports = withSteiger({
  steigerConfig: './steiger.config.ts',
  // Other Next.js config
  reactStrictMode: true,
  swcMinify: true,
});
```

## Project Structure Examples

### Valid FSD Structure

```
src/
├── app/
│   ├── providers/
│   ├── hooks/
│   └── store/
├── processes/
│   ├── auth/
│   └── checkout/
├── shared/
│   ├── api/
│   ├── lib/
│   └── config/
├── pages/
│   └── login/
│       ├── ui/
│       ├── model/
│       └── index.ts
├── widgets/
│   └── header/
│       ├── ui/
│       ├── model/
│       └── index.ts
├── features/
│   └── authentication/
│       ├── ui/
│       ├── model/
│       └── index.ts
├── entities/
│   └── user/
│       ├── ui/
│       ├── model/
│       └── index.ts
└── segments/
    └── ui/
    └── lib/
```

### Configuration for Valid Structure

```typescript
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'error',
      'fsd/no-app-in-slices': 'error',
      'fsd/layer-naming': [
        'error',
        {
          allowedLayers: [
            'app',
            'processes',
            'shared',
            'pages',
            'widgets',
            'features',
            'entities',
            'segments',
          ],
        },
      ],
      'fsd/slice-naming': [
        'error',
        {
          caseStyle: 'kebab-case',
          minLength: 3,
        },
      ],
    },
  },
]);
```

### Handling Exceptions

```typescript
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'fsd/no-shared-ui': 'error',
    },
    // Allow exceptions for specific cases
    ignores: [
      'src/shared/ui/theme/**', // Allow theme components in shared
      'src/shared/ui/icons/**', // Allow icon components in shared
      'src/**/*.stories.{ts,tsx}', // Ignore Storybook files
    ],
  },
  {
    // More lenient rules for test files
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'fsd/no-shared-ui': 'off',
      'fsd/no-app-in-slices': 'off',
    },
  },
]);
```

## Migration Guide

### Migrating from v0.4 to v0.5

```bash
# Install codemod
npm install -g @feature-sliced/steiger-codemod

# Run automatic migration
steiger-codemod --config ./steiger.config.js
```

### Manual Migration Steps

```typescript
// Old format (v0.4)
module.exports = {
  rules: {
    'no-processes': 'error',
    'no-shared-ui': 'warn',
  },
};

// New format (v0.5)
import { defineConfig } from 'steiger';

export default defineConfig([
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'warn',
    },
  },
]);
```

## Performance Optimization

### Caching Configuration

```typescript
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    cache: true, // Enable caching
    cacheLocation: '.steiger-cache',
    rules: {
      'fsd/no-processes': 'error',
    },
  },
]);
```

### Selective Linting

```typescript
export default defineConfig([
  {
    // Only lint changed files
    files: ['**/*.{ts,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
    },
    options: {
      incremental: true,
      cache: true,
    },
  },
]);
```

### Parallel Processing

```typescript
export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
    },
    options: {
      maxWorkers: 4, // Number of parallel workers
      timeout: 30000, // Timeout in milliseconds
    },
  },
]);
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/steiger.yml
name: Steiger Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  steiger:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Steiger
        run: npx steiger lint --format=github

      - name: Upload Steiger Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: steiger-report
          path: steiger-report.json
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["steiger lint --fix", "eslint --fix"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

### Docker Integration

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Run Steiger linting
RUN npx steiger lint

# Build application
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

#### False Positives

```typescript
// Disable specific rules for certain files
export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'fsd/no-shared-ui': 'error',
    },
    ignores: [
      'src/shared/ui/theme/**', // Known exception
      'src/shared/ui/icons/**', // Known exception
    ],
  },
]);
```

#### Performance Issues

```typescript
// Optimize for large codebases
export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'fsd/no-processes': 'error',
    },
    options: {
      cache: true,
      maxWorkers: 2, // Reduce workers for memory efficiency
      timeout: 60000, // Increase timeout
    },
  },
]);
```

#### Configuration Conflicts

```typescript
// Resolve conflicts between configurations
export default defineConfig([
  fsd.configs.recommended, // Base configuration
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Override specific rules
      'fsd/no-shared-ui': 'error', // Override from 'warn' to 'error'
    },
  },
]);
```

## Best Practices

### Configuration Organization

```typescript
// configs/steiger/base.ts
export const baseConfig = {
  files: ['**/*.{ts,tsx}'],
  rules: {
    'fsd/no-processes': 'error',
    'fsd/no-app-in-slices': 'error',
  },
};

// configs/steiger/strict.ts
export const strictConfig = {
  files: ['src/**/*.{ts,tsx}'],
  rules: {
    'fsd/no-shared-ui': 'error',
    'fsd/layer-naming': 'error',
    'fsd/slice-naming': 'error',
  },
};

// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';
import { baseConfig, strictConfig } from './configs/steiger';

export default defineConfig([fsd.configs.recommended, baseConfig, strictConfig]);
```

### Team Configuration

```typescript
// steiger.config.ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  fsd.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Team-agreed rules
      'fsd/no-processes': 'error',
      'fsd/no-shared-ui': 'error',
      'fsd/no-app-in-slices': 'error',

      // Documented exceptions
      'fsd/layer-naming': [
        'error',
        {
          allowedLayers: [
            'app',
            'processes',
            'shared',
            'pages',
            'widgets',
            'features',
            'entities',
            'segments',
          ],
          caseStyle: 'kebab-case',
          // Team decision: Use kebab-case for consistency
        },
      ],
    },

    // Documented ignores
    ignores: [
      'src/shared/ui/theme/**', // Exception: Theme components in shared
      'src/shared/ui/icons/**', // Exception: Icon components in shared
    ],
  },
]);
```

## References

- [Steiger GitHub Repository](https://github.com/feature-sliced/steiger)
- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [Steiger Configuration Examples](https://github.com/feature-sliced/steiger/blob/master/CONFIG_EXAMPLES.md)
- [Steiger Migration Guide](https://github.com/feature-sliced/steiger/discussions/53)
- [FSD Layer Structure](https://feature-sliced.design/docs/getting-started/concepts)
