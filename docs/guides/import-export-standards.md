# Import/Export Standards Guide 2026

## Overview

This guide defines the standards and best practices for managing imports and exports in the marketing websites monorepo, following 2026 industry standards and TypeScript best practices.

## Import Order Standards

### 1. Import Grouping
Imports must be ordered in the following sequence:

```typescript
// 1. Node.js built-ins
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 2. External packages (npm packages)
import express from 'express';
import { z } from 'zod';
import React from 'react';

// 3. Internal packages (@repo/*)
import { Email } from '@repo/core';
import { Button } from '@repo/ui';
import { secureAction } from '@repo/infrastructure';

// 4. Relative imports (../)
import { localHelper } from '../utils/local-helper';
import type { LocalType } from '../types';

// 5. Type imports (import type)
import type { ExternalType } from 'external-package';
import type { InternalType } from '@repo/types';
```

### 2. Import Style Rules

#### Use Absolute Imports for Cross-Package Dependencies
```typescript
// ✅ Good - Use @repo/* absolute imports
import { Email } from '@repo/core';
import { Button } from '@repo/ui';

// ❌ Bad - Avoid relative imports for cross-package dependencies
import { Email } from '../../core/value-objects/Email';
import { Button } from '../../../ui/src/components/Button';
```

#### Use Type Imports for Types Only
```typescript
// ✅ Good - Use import type for type-only imports
import type { Email, TenantId } from '@repo/core';
import type { ButtonProps } from '@repo/ui';

// ❌ Bad - Regular import for types
import { Email, TenantId } from '@repo/core';
import { ButtonProps } from '@repo/ui';
```

#### Group Related Imports
```typescript
// ✅ Good - Group related imports
import {
  Button,
  Input,
  Select,
  Textarea
} from '@repo/ui';

import type {
  ButtonProps,
  InputProps,
  SelectProps,
  TextareaProps
} from '@repo/ui';
```

## Export Standards

### 1. Barrel Export Patterns

#### Main Index File Structure
```typescript
// packages/ui/src/index.ts

// Core exports first
export { Button, Card, Input } from './components';
export type { ButtonProps, CardProps, InputProps } from './components';

// Grouped by category
export * from './layout';
export * from './navigation';
export * from './forms';

// Specialized exports
export * from './client'; // Client-safe exports only
export * from './server'; // Server-only exports
```

#### Client/Server Separation
```typescript
// packages/ui/src/index.client.ts
// Only exports safe for client-side use
export { Button, Input } from './components';
export type { ButtonProps, InputProps } from './components';

// packages/ui/src/index.server.ts
// Server-only exports
export { ServerComponent } from './server-components';
export { serverOnlyFunction } from './server-utils';
```

### 2. Export Organization

#### Group Exports by Category
```typescript
// ✅ Good - Grouped exports with clear comments

// Error boundaries and fallback UI
export {
  ErrorBoundary,
  EnhancedErrorBoundary,
  useErrorBoundary
} from './components/ErrorBoundary';
export type { ErrorContext } from './components/ErrorBoundary';

// Form components
export {
  Form,
  FormField,
  FormLabel
} from './components/Form';
export type { FormProps, FormFieldProps } from './components/Form';

// Design tokens
export {
  themeTokens,
  generateCSSVariables
} from './design-tokens';
export type { ThemeTokens } from './design-tokens';
```

#### Avoid Deep Re-exports
```typescript
// ✅ Good - Direct exports
export { Button } from './components/Button';

// ❌ Bad - Deep re-exports
export { Button as UIButton } from './ui/components/Button';
```

## Path Mapping Standards

### 1. TypeScript Configuration
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/ui": ["packages/ui/src/index.ts"],
      "@repo/ui/*": ["packages/ui/src/*"],
      "@repo/core": ["packages/core/src/index.ts"],
      "@repo/core/*": ["packages/core/src/*"]
    }
  }
}
```

### 2. Package.json Exports
```json
// packages/ui/package.json
{
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "require": "./dist/index.js",
      "types": "./src/index.ts"
    },
    "./client": {
      "import": "./src/index.client.ts",
      "require": "./dist/client.js",
      "types": "./src/index.client.ts"
    },
    "./server": {
      "import": "./src/index.server.ts",
      "require": "./dist/server.js",
      "types": "./src/index.server.ts"
    }
  }
}
```

## Validation Rules

### 1. ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error'
  }
};
```

### 2. Dependency Cruiser Rules
```javascript
// .dependency-cruiser.js
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: { path: '^packages' },
      to: { circular: true }
    },
    {
      name: 'no-relative-import-in-packages',
      severity: 'warn',
      from: { path: '^packages' },
      to: { path: '^\\.\\.' }
    }
  ]
};
```

## Performance Optimization

### 1. Import Resolution
- Use absolute imports for faster resolution
- Avoid deep relative imports
- Group related imports in barrel exports

### 2. Bundle Optimization
- Export tree-shakeable modules
- Use proper package.json exports
- Separate client/server exports

### 3. TypeScript Compilation
- Use `moduleResolution: "bundler"` for modern bundlers
- Enable `allowImportingTsExtensions` for TypeScript projects
- Configure proper `paths` mapping

## Tools and Automation

### 1. Validation Scripts
```bash
# Validate import patterns
pnpm validate:imports

# Check for circular dependencies
pnpm analyze:deps

# Validate package types
pnpm check:types

# Lint import rules
pnpm lint:imports
```

### 2. IDE Configuration
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## Migration Guide

### 1. Converting Relative to Absolute Imports
```typescript
// Before
import { Email } from '../../core/value-objects/Email';

// After
import { Email } from '@repo/core';
```

### 2. Adding Type Imports
```typescript
// Before
import { ButtonProps } from '@repo/ui';

// After
import type { ButtonProps } from '@repo/ui';
```

### 3. Organizing Imports
```typescript
// Before
import { Button } from '@repo/ui';
import { readFileSync } from 'fs';
import React from 'react';
import { Email } from '@repo/core';

// After
import { readFileSync } from 'fs';
import React from 'react';
import { Email } from '@repo/core';
import { Button } from '@repo/ui';
```

## Best Practices

### 1. Do's
- ✅ Use absolute imports for cross-package dependencies
- ✅ Group imports by category
- ✅ Use `import type` for type-only imports
- ✅ Organize exports with clear comments
- ✅ Separate client/server exports
- ✅ Use barrel exports for related functionality

### 2. Don'ts
- ❌ Use deep relative imports
- ❌ Mix value and type imports unnecessarily
- ❌ Create circular dependencies
- ❌ Export unused symbols
- ❌ Use inconsistent import ordering
- ❌ Ignore TypeScript path mapping

## Troubleshooting

### 1. Common Issues
- **Module not found**: Check TypeScript path mapping
- **Circular dependency**: Use dependency-cruiser to identify
- **Import resolution slow**: Use absolute imports
- **Type errors**: Ensure proper type imports

### 2. Debugging Tools
- `dependency-cruiser` for dependency analysis
- `madge` for circular dependency detection
- `eslint-plugin-import` for import pattern validation
- TypeScript compiler for path mapping issues

## Resources

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser)
- [Are The Types Wrong](https://arethetypeswrong.github.io/)

This guide should be followed by all developers working in the monorepo to ensure consistent, maintainable, and performant import/export patterns.
