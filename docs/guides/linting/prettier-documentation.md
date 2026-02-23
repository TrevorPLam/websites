# prettier-documentation.md

## Overview

Prettier is an opinionated code formatter that enforces a consistent style across your entire codebase. This documentation covers the Prettier configuration used in this marketing websites monorepo, integration patterns, and best practices for maintaining consistent code formatting in 2026.

## Supported Languages

Prettier in this project supports:

- JavaScript (including experimental features)
- TypeScript
- JSX/React components
- JSON
- YAML
- Markdown (including GFM)
- CSS, Less, and SCSS
- HTML
- GraphQL

## Current Configuration

### .prettierrc

The project uses a JSON configuration file at the repository root:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Configuration Options Explained

| Option          | Value      | Description                                                     |
| --------------- | ---------- | --------------------------------------------------------------- |
| `semi`          | `true`     | Add semicolons at the end of statements                         |
| `singleQuote`   | `true`     | Use single quotes instead of double quotes                      |
| `trailingComma` | `"es5"`    | Add trailing commas where valid in ES5 (objects, arrays, etc.)  |
| `printWidth`    | `100`      | Specify the line length that the printer will wrap on           |
| `tabWidth`      | `2`        | Specify the number of spaces per indentation-level              |
| `useTabs`       | `false`    | Indent lines with spaces instead of tabs                        |
| `arrowParens`   | `"always"` | Include parentheses around a single arrow function parameter    |
| `endOfLine`     | `"lf"`     | Specify line ending style (LF for consistency across platforms) |

## Integration with Development Tools

### VS Code Integration

The project includes VS Code settings for automatic formatting:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Pre-commit Hooks

Prettier is integrated with Husky and lint-staged for pre-commit formatting:

```json
// .lintstagedrc.json
{
  "*.{js,jsx,ts,tsx,json,md,yml,yaml}": ["prettier --write"],
  "*.{css,scss,less}": ["prettier --write"]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## File-specific Configurations

### Overrides for Different File Types

```json
// .prettierrc (extended example)
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 80,
        "proseWrap": "always"
      }
    },
    {
      "files": "*.json",
      "options": {
        "printWidth": 120
      }
    },
    {
      "files": "*.yml",
      "options": {
        "tabWidth": 2,
        "singleQuote": false
      }
    }
  ]
}
```

## Advanced Configuration

### TypeScript Configuration Support

For TypeScript projects, you can use a typed configuration file:

```typescript
// prettier.config.ts
import { type Config } from 'prettier';

const config: Config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugin configurations (if needed)
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  // Import sorting configuration
  importOrder: ['^react/(.*)$', '^next/(.*)$', '^@repo/(.*)$', '^[./]', '^[./]../(.*)$'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
```

### EditorConfig Integration

The project respects EditorConfig settings when available:

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
max_line_length = 100

[*.md]
max_line_length = 80
trim_trailing_whitespace = false
```

## CI/CD Integration

### GitHub Actions

Prettier formatting is checked in CI:

```yaml
# .github/workflows/prettier.yml
name: Prettier Check
on: [push, pull_request]

jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
```

## Performance Optimization

### Large Repository Performance

For large monorepos, consider these optimizations:

1. **Cache Prettier configuration**: Use `.prettierrc` JSON for faster parsing
2. **Limit file scope**: Use `.prettierignore` for generated files
3. **Parallel execution**: Run Prettier on multiple files concurrently

### .prettierignore

```text
# Dependencies
node_modules
pnpm-lock.yaml

# Build outputs
dist
build
.next
out

# Generated files
*.generated.ts
*.generated.js

# Logs
*.log

# Environment files
.env*
.env.local

# Cache directories
.cache
.turbo

# Documentation build
.docusaurus
```

## Troubleshooting

### Common Issues

1. **Conflicting ESLint rules**: Disable formatting rules in ESLint
2. **Different line endings**: Ensure consistent `endOfLine` configuration
3. **Performance issues**: Use `.prettierignore` and limit scope
4. **Team inconsistencies**: Share configuration via package.json

### ESLint Integration

```json
// .eslintrc.json
{
  "extends": ["@repo/eslint-config"],
  "rules": {
    "prettier/prettier": "error"
  },
  "plugins": ["prettier"]
}
```

## Best Practices

1. **Consistent Configuration**: Use the same Prettier config across all packages
2. **Pre-commit Hooks**: Enforce formatting before commits
3. **CI Validation**: Check formatting in CI/CD pipelines
4. **Team Alignment**: Ensure all team members use the same configuration
5. **Documentation**: Document any project-specific formatting decisions

## Migration Guide

### Upgrading Prettier Versions

When upgrading Prettier:

1. Check breaking changes in release notes
2. Test on a subset of files first
3. Update CI configuration if needed
4. Communicate changes to the team

### Adopting New Options

```bash
# Test new formatting options
npx prettier@next --write --experimental-ternaries src/

# Check differences
git diff
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Official Prettier Documentation](https://prettier.io/docs/)
- [Prettier Options Reference](https://prettier.io/docs/options)
- [Prettier Configuration](https://prettier.io/docs/configuration)
- [Prettier Playground](https://prettier.io/playground)
- [EditorConfig Documentation](https://editorconfig.org/)
- [Lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Husky Documentation](https://typicode.github.io/husky/)
  {
  files: "_.json",
  options: {
  tabWidth: 2
  }
  },
  {
  files: "_.md",
  options: {
  printWidth: 80,
  proseWrap: "always"
  }
  },
  {
  files: "\*.test.ts",
  options: {
  semi: false
  }
  }
  ]
  };

export default config;

````

#### YAML Configuration

```yaml
# .prettierrc.yml
trailingComma: "es5"
tabWidth: 2
semi: true
singleQuote: true
printWidth: 120
bracketSpacing: true
arrowParens: "avoid"
endOfLine: "lf"

overrides:
  - files: "*.json"
    options:
      tabWidth: 2
  - files: "*.md"
    options:
      printWidth: 80
      proseWrap: "always"
````

### Configuration Overrides

Overrides allow different formatting rules for specific file patterns:

```typescript
const config: Config = {
  // Global settings
  semi: true,
  singleQuote: true,
  tabWidth: 2,

  overrides: [
    // Test files - different formatting
    {
      files: '*.test.{js,ts}',
      options: {
        semi: false,
        singleQuote: false,
      },
    },

    // Configuration files
    {
      files: '*.{json,yaml,yml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },

    // Markdown files
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },

    // CSS and SCSS
    {
      files: '*.{css,scss,sass}',
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },

    // Specific directories
    {
      files: 'legacy/**/*.js',
      options: {
        tabWidth: 4,
        semi: false,
      },
    },
  ],
};
```

## Editor Integration

### VS Code Integration

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.formatOnType": false,

  // Language-specific formatting
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Disable formatting for certain files
  "[plaintext]": {
    "editor.formatOnSave": false
  }
}
```

### Vim Integration

```vim
" .vimrc
" Install vim-prettier plugin
Plug 'prettier/vim-prettier', {
  \ 'do': 'yarn install',
  \ 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue', 'svelte', 'yaml', 'html', 'go']
  \ }

" Prettier configuration
let g:prettier#config#bracket_spacing = 'true'
let g:prettier#config#jsx_bracket_same_line = 'false'
let g:prettier#config#jsx_single_quote = 'true'
let g:prettier#config#print_width = '120'
let g:prettier#config#semi = 'true'
let g:prettier#config#single_quote = 'true'
let g:prettier#config#tab_width = '2'
let g:prettier#config#trailing_comma = 'es5'

" Auto-format on save
autocmd BufWritePre *.js,*.ts,*.jsx,*.tsx,*.css,*.scss,*.json,*.md PrettierAsync
```

### Emacs Integration

```elisp
;; .emacs.d/init.el
(use-package prettier
  :ensure t
  :hook ((js-mode . prettier-mode)
         (typescript-mode . prettier-mode)
         (json-mode . prettier-mode)
         (markdown-mode . prettier-mode))
  :config
  (setq prettier-pre-warn nil)
  (setq prettier-show-errors nil))
```

## Plugin System

### Popular Plugins

#### Tailwind CSS Plugin

```typescript
// prettier.config.ts
import { type Config } from 'prettier';

const config: Config = {
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind-specific options
  tailwindConfig: './tailwind.config.js',
  plugins: ['prettier-plugin-tailwindcss'],

  overrides: [
    {
      files: '*.{css,scss,html,js,ts,jsx,tsx}',
      options: {
        tailwindConfig: './tailwind.config.js',
        plugins: ['prettier-plugin-tailwindcss'],
      },
    },
  ],
};
```

#### XML/HTML Plugin

```typescript
import { type Config } from 'prettier';

const config: Config = {
  plugins: ['@prettier/plugin-xml'],

  overrides: [
    {
      files: '*.{xml,html,xhtml}',
      options: {
        xmlWhitespaceSensitivity: 'ignore',
        xmlSelfClosingSpace: true,
      },
    },
  ],
};
```

#### Package.json Plugin

```typescript
import { type Config } from 'prettier';

const config: Config = {
  plugins: ['prettier-plugin-packagejson'],

  overrides: [
    {
      files: 'package.json',
      options: {
        tabWidth: 2,
        sortOrder: [
          'name',
          'version',
          'description',
          'keywords',
          'license',
          'author',
          'contributors',
          'repository',
          'bugs',
          'homepage',
          'engines',
          'main',
          'module',
          'types',
          'exports',
          'files',
          'scripts',
          'dependencies',
          'devDependencies',
          'peerDependencies',
          'optionalDependencies',
          'bundledDependencies',
        ],
      },
    },
  ],
};
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/prettier.yml
name: Prettier Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  prettier:
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

      - name: Check Prettier formatting
        run: npm run format:check

      - name: Run Prettier if needed
        if: failure()
        run: npm run format:write

      - name: Commit formatting changes
        if: failure()
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Apply Prettier formatting" || exit 0
          git push
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.{css,scss,sass}": ["prettier --write"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
prettier:
  stage: test
  image: node:20
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run format:check
  artifacts:
    reports:
      junit: prettier-report.xml
  only:
    - merge_requests
    - main
```

## Advanced Configuration

### Conditional Formatting

```typescript
import { type Config } from 'prettier';

const config: Config = {
  // Environment-specific configuration
  ...(process.env.NODE_ENV === 'production'
    ? {
        printWidth: 100,
        tabWidth: 2,
      }
    : {
        printWidth: 120,
        tabWidth: 4,
      }),

  overrides: [
    // Development vs production files
    {
      files: ['*.dev.js', '*.dev.ts'],
      options: {
        semi: false,
        singleQuote: true,
      },
    },
    {
      files: ['*.prod.js', '*.prod.ts'],
      options: {
        semi: true,
        singleQuote: false,
      },
    },
  ],
};
```

### Custom Parser Configuration

```typescript
import { type Config } from 'prettier';

const config: Config = {
  overrides: [
    // Custom parser for TypeScript
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
        tsxBracketSameLine: false,
        jsxBracketSameLine: false,
      },
    },

    // Custom parser for JSON with comments
    {
      files: '*.jsonc',
      options: {
        parser: 'json',
      },
    },

    // Custom parser for GraphQL
    {
      files: '*.graphql',
      options: {
        parser: 'graphql',
      },
    },
  ],
};
```

### Performance Optimization

```typescript
import { type Config } from 'prettier';

const config: Config = {
  // Performance settings for large codebases
  overrides: [
    {
      files: ['**/*.min.js', '**/*.bundle.js'],
      options: {
        // Skip formatting for minified files
        parser: 'babel',
        requirePragma: true,
      },
    },
  ],

  // Use pragmas to selectively format
  requirePragma: false,
  insertPragma: false,

  // Performance optimizations
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
};
```

## Language-Specific Configuration

### JavaScript/TypeScript

```typescript
const jsConfig: Config = {
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        // JavaScript/TypeScript specific options
        arrowParens: 'avoid',
        bracketSameLine: false,
        bracketSpacing: true,
        jsxBracketSameLine: false,
        jsxSingleQuote: true,
        quoteProps: 'as-needed',
        semi: true,
        singleQuote: true,

        // Import/export formatting
        importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@shared/(.*)$', '^[./]', '(.*)'],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
      },
    },
  ],
};
```

### CSS/SCSS

```typescript
const cssConfig: Config = {
  overrides: [
    {
      files: '*.{css,scss,sass,less}',
      options: {
        singleQuote: false,
        tabWidth: 2,

        // CSS-specific options
        singleQuotePerProperty: false,
        quoteProps: 'as-needed',
      },
    },
  ],
};
```

### JSON/YAML

```typescript
const dataConfig: Config = {
  overrides: [
    {
      files: '*.{json,jsonc}',
      options: {
        tabWidth: 2,
        trailingComma: 'es5',
      },
    },
    {
      files: '*.{yaml,yml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
```

### Markdown

```typescript
const mdConfig: Config = {
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,

        // Markdown-specific options
        parser: 'markdown',
      },
    },
  ],
};
```

## Best Practices

### Team Collaboration

```typescript
// Team-wide configuration with documentation
const teamConfig: Config = {
  // Documented configuration choices
  trailingComma: 'es5', // Required for ES5 compatibility
  tabWidth: 2, // Standard for modern web development
  semi: true, // Prevents ASI issues
  singleQuote: true, // Consistent with JSX

  // Team-specific overrides
  overrides: [
    {
      files: '*.test.{js,ts}',
      options: {
        semi: false, // Test files use semicolon-free style
      },
      // Team decision documented
      description: 'Test files use semicolon-free style for readability',
    },
  ],

  // Plugin configuration
  plugins: [
    'prettier-plugin-tailwindcss', // Required for Tailwind CSS projects
    '@prettier/plugin-xml', // Required for XML formatting
  ],
};
```

### Migration Strategy

```bash
# Step 1: Install Prettier
npm install --save-dev prettier

# Step 2: Create configuration file
echo '{"semi": true, "singleQuote": true, "tabWidth": 2}' > .prettierrc

# Step 3: Add scripts to package.json
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.format:check="prettier --check ."

# Step 4: Format existing codebase
npm run format

# Step 5: Add to CI/CD
# (See CI/CD Integration section)
```

### Performance Tips

```typescript
// Performance-optimized configuration
const perfConfig: Config = {
  // Use requirePragma for selective formatting
  requirePragma: true,
  insertPragma: false,

  // Skip large files
  overrides: [
    {
      files: ['**/*.min.js', '**/*.bundle.js', '**/dist/**'],
      options: {
        parser: 'babel',
      },
    },
  ],

  // Optimize for large codebases
  tabWidth: 2,
  printWidth: 120,
};
```

## Troubleshooting

### Common Issues

#### Conflicting Formatters

```typescript
// Resolve conflicts with ESLint
const config: Config = {
  // Prettier configuration that works with ESLint
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',

  // Use eslint-config-prettier to disable conflicting ESLint rules
  // Install: npm install --save-dev eslint-config-prettier
};
```

#### Performance Issues

```bash
# Check Prettier performance
time npx prettier --write "src/**/*.{js,ts}"

# Use --cache for better performance
npx prettier --write --cache "src/**/*.{js,ts}"

# Exclude large directories
npx prettier --write "src/**/*.{js,ts}" --ignore-path .gitignore
```

#### Configuration Conflicts

```typescript
// Debug configuration issues
const debugConfig: Config = {
  // Use explicit parser to avoid conflicts
  overrides: [
    {
      files: '*.{js,jsx}',
      options: {
        parser: 'babel',
      },
    },
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
```

## References

- [Prettier Documentation](https://prettier.io/docs/)
- [Prettier Configuration Options](https://prettier.io/docs/options)
- [Prettier Editor Integration](https://prettier.io/docs/editors)
- [Prettier Plugins](https://prettier.io/docs/plugins)
- [Prettier CLI](https://prettier.io/docs/cli)

## Implementation

[Add content here]

## Testing

[Add content here]
