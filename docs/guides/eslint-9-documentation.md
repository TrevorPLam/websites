# eslint-9-documentation.md

## Overview

ESLint v9.0.0 introduced the flat config system as the default configuration format, replacing the legacy `.eslintrc` format. This migration guide covers the key changes, migration strategies, and best practices for updating your ESLint configuration.

## Key Changes in ESLint 9

### Flat Config System

The flat config system uses JavaScript modules instead of JSON/YAML files, providing better TypeScript support and more flexible configuration options.

**Default Configuration File**: `eslint.config.js` (instead of `.eslintrc.*`)

### Major Differences

1. **Plugin Import System**: Direct ES module imports instead of string-based references
2. **Configuration Structure**: Array-based configuration objects instead of single object
3. **Language Options**: Consolidated under `languageOptions` property
4. **Global Variables**: Configured in `languageOptions.globals`
5. **File-based Configuration**: Glob patterns per configuration object

## Migration Process

### Step 1: Install Migration Tool

```bash
npm install -g @eslint/migrate-config
```

### Step 2: Run Migration

```bash
# For .eslintrc files
@eslint/migrate-config .eslintrc

# For .eslintrc.json files
@eslint/migrate-config .eslintrc.json

# For .eslintrc.yml files
@eslint/migrate-config .eslintrc.yml
```

### Step 3: Manual Configuration

#### Before (Legacy .eslintrc.js)

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

#### After (Flat Config eslint.config.js)

```javascript
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  // JavaScript files
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  // React files
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
```

## Configuration Patterns

### Multi-Project Setup

```javascript
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  // Shared configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Source files only
  {
    files: ['src/**/*.{js,ts}'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },

  // Test files
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      'no-unused-expressions': 'off',
    },
  },

  // Configuration files
  {
    files: ['*.config.{js,ts}'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
]);
```

### TypeScript Integration

```javascript
import { defineConfig } from 'eslint/config';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...typescript.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
    },
  },
]);
```

## Plugin Migration

### Legacy Plugin Loading

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['react', '@typescript-eslint'],
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
};
```

### Flat Config Plugin Loading

```javascript
// eslint.config.js
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import typescript from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: react,
      '@typescript-eslint': typescript,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
```

## Global Variables Configuration

### Legacy Approach

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  globals: {
    process: 'readonly',
    Buffer: 'readonly',
  },
};
```

### Flat Config Approach

```javascript
// eslint.config.js
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
]);
```

## Ignore Files

### Legacy .eslintignore

```bash
# .eslintignore
node_modules/
dist/
coverage/
*.min.js
```

### Flat Config Ignore Patterns

```javascript
// eslint.config.js
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '**/*.min.js', 'build/**', '.next/**'],
  },
  {
    files: ['**/*.{js,ts}'],
    // Your configuration here
  },
]);
```

## CLI Changes

### Removed Flags

- `--ext`: File extensions are now determined by configuration
- `--resolve-plugins-relative-to`: Plugins are resolved relative to config file

### New Flags

- `--config`: Specify config file path (same as before)
- `--flag`: Enable experimental features

## Compatibility Issues

### Plugin Compatibility

Some plugins may not yet support ESLint v9. Check for these errors:

```
TypeError: context.getScope is not a function
```

**Solution**: Use compatibility utilities

```javascript
// eslint.config.js
import { defineConfig } from 'eslint/config';
import { LegacyPluginAPI } from '@eslint/eslintrc';

// Wrap legacy plugins
const legacyPlugin = new LegacyPluginAPI({
  rules: legacyPluginRules,
});

export default defineConfig([
  {
    plugins: {
      'legacy-plugin': legacyPlugin,
    },
  },
]);
```

## Best Practices

### 1. Use TypeScript for Configuration

```javascript
// eslint.config.ts
import { defineConfig } from 'eslint/config';
import type { Linter } from 'eslint';

export default defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
  } satisfies Linter.Config,
]);
```

### 2. Separate Configurations by Concern

```javascript
// eslint.config.js
export default defineConfig([
  // Base configuration
  baseConfig,

  // TypeScript configuration
  typescriptConfig,

  // React configuration
  reactConfig,

  // Test configuration
  testConfig,
]);
```

### 3. Use Conditional Configuration

```javascript
// eslint.config.js
import { defineConfig } from 'eslint/config';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig([
  {
    files: ['**/*.js'],
    rules: {
      'no-console': isDevelopment ? 'off' : 'warn',
      'no-debugger': isDevelopment ? 'off' : 'error',
    },
  },
]);
```

## Migration Checklist

- [ ] Install `@eslint/migrate-config` tool
- [ ] Run migration tool on existing `.eslintrc` files
- [ ] Update plugin imports to ES modules
- [ ] Convert `env` to `languageOptions.globals`
- [ ] Update `parser` to `languageOptions.parser`
- [ ] Convert `extends` to direct plugin configurations
- [ ] Update ignore patterns to `ignores` array
- [ ] Test configuration with `eslint --debug`
- [ ] Update CI/CD pipelines if needed
- [ ] Update team documentation

## Troubleshooting

### Common Issues

1. **Plugin Not Found**: Ensure plugins are installed and imported correctly
2. **Parser Errors**: Check parser compatibility with ESLint v9
3. **TypeScript Errors**: Install `@types/eslint` for better TypeScript support
4. **Performance Issues**: Use file-specific configurations to reduce scope

### Debug Commands

```bash
# Check configuration
eslint --print-config path/to/file.js

# Debug configuration loading
eslint --debug

# Test specific files
eslint src/**/*.ts --max-warnings 0
```

## References

- [ESLint v9.0.0 Release Notes](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/)
- [Flat Configuration Guide](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Migration Tool Documentation](https://npmjs.com/package/@eslint/migrate-config)
- [Compatibility Utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/)
- [ESLint TypeScript Types](https://www.npmjs.com/package/@types/eslint)
