# turbo-json-configuration.md

## Overview

Turbo JSON configuration defines how Turborepo orchestrates tasks across your monorepo. This documentation covers the actual configuration used in this marketing websites monorepo, task definition patterns, dependency management, caching strategies, and advanced configuration patterns for optimizing build performance in 2026.

## Current Configuration

### Root turbo.json Structure

The project uses the following configuration at the repository root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SENTRY_DSN",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID"
  ],
  "globalPassThroughEnv": ["SENTRY_AUTH_TOKEN", "VERCEL_URL"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
      "cache": true,
      "inputs": ["src/**", "public/**", "package.json", "tsconfig.json", "next.config.js"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "cache": true,
      "inputs": ["src/**", "package.json", "*.config.{js,mjs,cjs}"]
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json", "*.d.ts"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "**/__tests__/**", "jest.config.js"]
    },
    "format": {
      "cache": false,
      "inputs": ["src/**", "package.json", "*.{json,md,yml,yaml}"]
    },
    "format:check": {
      "cache": false,
      "inputs": ["src/**", "package.json", "*.{json,md,yml,yaml}"]
    },
    "@repo/marketing-components#build": {
      "outputs": ["dist/**"],
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    }
  }
}
```

## Configuration Options Explained

### Global Configuration

| Option                 | Value                               | Description                                          |
| ---------------------- | ----------------------------------- | ---------------------------------------------------- |
| `$schema`              | `"https://turbo.build/schema.json"` | JSON schema for validation and autocompletion        |
| `ui`                   | `"stream"`                          | Terminal UI mode (stream vs tui)                     |
| `globalEnv`            | Environment variables array         | Variables that affect all task hashes                |
| `globalPassThroughEnv` | Environment variables array         | Variables available to tasks without affecting cache |

### Task Configuration Options

| Option           | Type     | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| `dependsOn`      | string[] | Tasks that must run before this task               |
| `outputs`        | string[] | Glob patterns for files that affect caching        |
| `cache`          | boolean  | Whether to cache task results                      |
| `inputs`         | string[] | Files that affect task hash (default: all files)   |
| `persistent`     | boolean  | Whether task runs continuously (e.g., dev servers) |
| `env`            | string[] | Environment variables that affect task hash        |
| `passThroughEnv` | string[] | Environment variables available to task            |

## Task Definitions

### Build Task

```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
    "cache": true,
    "inputs": ["src/**", "public/**", "package.json", "tsconfig.json", "next.config.js"]
  }
}
```

**Explanation:**

- `dependsOn: ["^build"]`: Runs after build tasks in dependencies complete
- `outputs`: Caches Next.js build output and distribution folders
- `cache: true`: Enables caching for faster subsequent builds
- `inputs`: Specifies which files affect the build hash

### Development Task

```json
{
  "dev": {
    "cache": false,
    "persistent": true
  }
}
```

**Explanation:**

- `cache: false`: Development servers shouldn't be cached
- `persistent: true`: Task runs continuously until manually stopped

### Lint Task

```json
{
  "lint": {
    "dependsOn": ["^lint"],
    "cache": true,
    "inputs": ["src/**", "package.json", "*.config.{js,mjs,cjs}"]
  }
}
```

**Explanation:**

- Runs after linting in dependencies completes
- Caches linting results for performance
- Only considers source files and config files for hash

### Type Check Task

```json
{
  "type-check": {
    "dependsOn": ["^type-check"],
    "cache": true,
    "inputs": ["src/**", "package.json", "tsconfig.json", "*.d.ts"]
  }
}
```

**Explanation:**

- Separate from build for faster iteration
- Includes TypeScript declaration files in inputs
- Cached for performance in large codebases

### Test Task

```json
{
  "test": {
    "dependsOn": ["^build"],
    "outputs": ["coverage/**"],
    "inputs": ["src/**/*.ts", "src/**/*.tsx", "**/__tests__/**", "jest.config.js"]
  }
}
```

**Explanation:**

- Depends on build to ensure compiled code is available
- Caches coverage reports for performance
- Only considers test files and source code for hash

### Format Tasks

```json
{
  "format": {
    "cache": false,
    "inputs": ["src/**", "package.json", "*.{json,md,yml,yaml}"]
  },
  "format:check": {
    "cache": false,
    "inputs": ["src/**", "package.json", "*.{json,md,yml,yaml}"]
  }
}
```

**Explanation:**

- Both tasks disabled from caching (formatting is fast)
- Include configuration files and documentation
- Separate check task for CI validation

## Advanced Configuration Patterns

### Package-Specific Configuration

Create package-level `turbo.json` files to override or extend root configuration:

```json
// packages/marketing-components/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    }
  }
}
```

### Environment-Specific Tasks

```json
{
  "tasks": {
    "build:production": {
      "dependsOn": ["^build"],
      "env": ["NODE_ENV", "VERCEL_ENV"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "build:development": {
      "dependsOn": ["^build"],
      "env": ["NODE_ENV"],
      "cache": false
    }
  }
}
```

### Composable Task Patterns

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build", "type-check", "lint"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "deploy": {
      "dependsOn": ["test", "build"]
    }
  }
}
```

### Conditional Task Execution

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "package.json", { "env": "NODE_ENV" }]
    }
  }
}
```

## Performance Optimization

### Caching Strategies

1. **Granular Inputs**: Specify exact input patterns to avoid unnecessary cache misses
2. **Output Patterns**: Include only build artifacts, exclude cache directories
3. **Environment Variables**: Only include env vars that actually affect output
4. **Dependency Management**: Use `^` prefix for proper dependency ordering

### Cache Optimization Examples

```json
{
  "tasks": {
    "build": {
      "outputs": [
        ".next/**",
        "!.next/cache/**", // Exclude cache directory
        "!.next/server/**", // Exclude serverless functions if not needed
        "dist/**"
      ],
      "inputs": [
        "src/**",
        "public/**",
        "package.json",
        "tsconfig.json",
        "next.config.js",
        "!src/**/*.test.ts", // Exclude test files
        "!src/**/*.stories.tsx" // Exclude story files
      ]
    }
  }
}
```

### Parallel Execution

```json
{
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "lint": {
      "cache": true,
      "inputs": ["src/**", "*.config.{js,mjs,cjs}"]
    },
    "type-check": {
      "cache": true,
      "inputs": ["src/**", "tsconfig.json", "*.d.ts"]
    }
  }
}
```

## Integration with CI/CD

### GitHub Actions Integration

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run linting
        run: pnpm lint
      - name: Run type checking
        run: pnpm type-check
      - name: Run tests
        run: pnpm test
      - name: Build packages
        run: pnpm build
```

### Remote Caching Setup

```json
{
  "remoteCache": {
    "enabled": true,
    "signature": "${TURBO_TOKEN}",
    "apiUrl": "https://cache.turborepo.com"
  }
}
```

## Environment Variables

### Global Environment Variables

```json
{
  "globalEnv": [
    "NODE_ENV", // Affects all builds
    "NEXT_PUBLIC_SITE_URL", // Public site URL
    "NEXT_PUBLIC_SENTRY_DSN", // Error tracking
    "NEXT_PUBLIC_GA_MEASUREMENT_ID" // Analytics
  ],
  "globalPassThroughEnv": [
    "SENTRY_AUTH_TOKEN", // For error reporting
    "VERCEL_URL" // For deployment URLs
  ]
}
```

### Task-Specific Environment Variables

```json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "VERCEL_ENV"],
      "passThroughEnv": ["AWS_ACCESS_KEY_ID"]
    },
    "test": {
      "env": ["NODE_ENV", "CI"]
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Cache Misses**: Check `inputs` and `outputs` patterns
2. **Dependency Cycles**: Ensure no circular dependencies in `dependsOn`
3. **Environment Variables**: Verify all required env vars are declared
4. **Performance**: Use `--filter` to limit scope during development

### Debug Commands

```bash
# Check task dependencies
turbo run build --dry-run

# Force rebuild without cache
turbo run build --force

# Limit to specific packages
turbo run build --filter=@repo/marketing-components

# Show cache information
turbo run build --summarize
```

### Performance Monitoring

```bash
# Profile task execution
turbo run build --profile

# Check cache hit rates
turbo run build --cache-dir=./.turbo

# Analyze task graph
turbo run build --graph
```

## Best Practices

### Configuration Management

1. **Schema Validation**: Always include `$schema` for autocompletion
2. **Consistent Naming**: Use clear, descriptive task names
3. **Dependency Clarity**: Explicitly declare all dependencies
4. **Cache Strategy**: Enable caching for expensive operations
5. **Input Specificity**: Be specific about input patterns

### Performance Optimization

1. **Parallel Execution**: Structure tasks to run in parallel when possible
2. **Granular Caching**: Cache at the task level, not package level
3. **Environment Management**: Minimize environment variable impact on cache
4. **Output Management**: Exclude unnecessary files from cache
5. **Input Filtering**: Exclude test files from build inputs

### Team Collaboration

1. **Documentation**: Document task purposes and dependencies
2. **Consistency**: Use similar patterns across packages
3. **Validation**: Validate configuration in CI
4. **Monitoring**: Track cache hit rates and performance
5. **Version Control**: Commit turbo.json changes with code changes

## Migration Guide

### From npm Scripts

```json
// Before (package.json)
{
  "scripts": {
    "build": "next build",
    "test": "jest",
    "lint": "eslint ."
  }
}

// After (turbo.json)
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

### From Lerna/Nx

Key differences:

- **Simpler Configuration**: Less verbose than Nx
- **Package.json First**: Uses existing package.json scripts
- **Caching Focus**: Optimized for caching over orchestration
- **Turborepo CLI**: Uses `turbo run` instead of `nx serve`

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Turborepo Official Documentation](https://turborepo.dev/docs)
- [Turbo JSON Schema](https://turbo.build/schema.json)
- [Turborepo Configuration Guide](https://turborepo.dev/docs/reference/configuration)
- [Task Configuration Patterns](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks)
- [Remote Caching Documentation](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Package Configurations](https://turborepo.dev/docs/reference/package-configurations)
  // Empty object means: run in all packages, no dependencies, no caching
  }
  }
  }

````

#### Task with Dependencies

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      // ^build means: run build in all packages this package depends on
    },
    "test": {
      "dependsOn": ["build"],
      // build means: run build in the same package first
    },
    "deploy": {
      "dependsOn": ["build", "test"],
      // Multiple dependencies run in parallel if possible
    }
  }
}
````

#### Task with Outputs Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      // These files/directories will be cached
      "outputsMode": "new-only"
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "outputsMode": "full"
    }
  }
}
```

## Advanced Configuration

### Composable Tasks

```json
{
  "pipeline": {
    "#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**", "package.json"],
      "cache": true
    },
    "build": {
      "extends": "#build",
      "outputs": ["dist/**", ".next/**"],
      "env": ["NEXT_PUBLIC_API_URL"]
    },
    "build:client": {
      "extends": "#build",
      "outputs": ["dist/client/**"],
      "env": ["VITE_CLIENT_API_URL"]
    },
    "build:server": {
      "extends": "#build",
      "outputs": ["dist/server/**"],
      "env": ["VITE_SERVER_API_URL"]
    }
  }
}
```

### Environment Variables

```json
{
  "globalEnv": ["NODE_ENV", "VERCEL_ENV", "CI", "GITHUB_ACTIONS"],
  "pipeline": {
    "build": {
      "env": ["NEXT_PUBLIC_API_URL", "DATABASE_URL", "STRIPE_SECRET_KEY"],
      "passThruEnv": ["AWS_*", "GOOGLE_*"]
    },
    "test": {
      "env": ["NODE_ENV=test", "DATABASE_URL", "REDIS_URL"]
    }
  }
}
```

### Input Configuration

```json
{
  "pipeline": {
    "build": {
      "inputs": [
        "src/**/*.{js,ts,jsx,tsx}",
        "package.json",
        "tsconfig.json",
        "tailwind.config.js",
        "vite.config.ts",
        "!src/**/*.test.{js,ts,jsx,tsx}",
        "!src/**/*.stories.{js,ts,jsx,tsx}"
      ]
    },
    "test": {
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "test/**/*.{js,ts}", "package.json", "jest.config.js"]
    },
    "lint": {
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "*.{json,js,ts}", ".eslintrc.*", ".prettierrc.*"]
    }
  }
}
```

## Package-Specific Configuration

### Package-Level turbo.json

```json
// packages/web-app/turbo.json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_APP_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": ["NEXT_PUBLIC_API_URL"]
    }
  }
}
```

### Inherited Configuration with Overrides

```json
// packages/shared/turbo.json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "extends": ["//build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**/*.{ts,js}", "package.json"]
    },
    "test": {
      "extends": ["//test"],
      "outputs": [],
      "cache": true
    }
  }
}
```

## Caching Strategies

### Output Modes

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "outputsMode": "new-only"
      // "new-only": Only cache newly created files
      // "full": Cache all files in output directory
      // "errors-only": Only cache error outputs
    },
    "test": {
      "outputs": ["coverage/**"],
      "outputsMode": "full"
    }
  }
}
```

### Cache Hashing

```json
{
  "globalDependencies": [
    "**/.env.*local",
    ".env",
    "turbo.json",
    "package.json",
    "yarn.lock",
    "pnpm-lock.yaml"
  ],
  "pipeline": {
    "build": {
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "package.json", "tsconfig.json"],
      // These files affect the cache hash
      "outputs": ["dist/**"]
    }
  }
}
```

### Cache Strategies by Task Type

```json
{
  "pipeline": {
    // Build tasks - cache aggressively
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true,
      "outputsMode": "new-only"
    },

    // Test tasks - cache with environment awareness
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true,
      "env": ["NODE_ENV"]
    },

    // Lint tasks - cache with input awareness
    "lint": {
      "outputs": [],
      "cache": true,
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "*.{json,js,ts}"]
    },

    // Dev tasks - no caching
    "dev": {
      "cache": false,
      "persistent": true
    },

    // Deploy tasks - no caching for security
    "deploy": {
      "dependsOn": ["build", "test"],
      "cache": false,
      "env": ["DEPLOY_TOKEN", "VERCEL_TOKEN"]
    }
  }
}
```

## Performance Optimization

### Dependency Management

```json
{
  "pipeline": {
    // Parallel execution
    "lint": {
      "outputs": [],
      "cache": true
      // No dependsOn means can run in parallel with other tasks
    },
    "type-check": {
      "outputs": [],
      "cache": true
      // Can run in parallel with lint
    },

    // Sequential execution
    "build": {
      "dependsOn": ["^build", "type-check"],
      "outputs": ["dist/**"]
      // Depends on type-check in same package
    },

    // Complex dependency graph
    "test:integration": {
      "dependsOn": ["build", "test:unit"],
      "outputs": []
    },
    "deploy": {
      "dependsOn": ["build", "test:integration"],
      "cache": false
    }
  }
}
```

### Task Filtering and Execution

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "filter": "packages/*/src"
      // Only run in packages with src directory
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "filter": ["packages/*/test", "apps/*/test"]
      // Only run in packages with test directory
    }
  }
}
```

### Environment-Specific Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV"],
      "passThruEnv": false
    },
    "build:production": {
      "extends": ["build"],
      "env": ["NODE_ENV=production", "API_URL"],
      "outputs": ["dist/**", "!dist/**/*.map"]
    },
    "build:development": {
      "extends": ["build"],
      "env": ["NODE_ENV=development"],
      "cache": false
    }
  }
}
```

## Advanced Patterns

### Conditional Task Execution

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "condition": "process.env.SKIP_BUILD !== 'true'"
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "condition": "process.env.CI === 'true' || process.env.NODE_ENV === 'test'"
    }
  }
}
```

### Runtime Dependencies

```json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"],
      "runtimeDependencies": ["database", "redis"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "runtimeDependencies": ["database", "test-server"],
      "outputs": []
    }
  }
}
```

### Side Effects Management

```json
{
  "pipeline": {
    "deploy": {
      "dependsOn": ["build", "test"],
      "cache": false,
      "doNotPersist": true
      // Task has side effects, don't persist outputs
    },
    "publish": {
      "dependsOn": ["build", "test"],
      "cache": false,
      "doNotPersist": true
    },
    "clean": {
      "cache": false,
      "doNotPersist": true,
      "outputs": []
    }
  }
}
```

## Integration Examples

### Next.js Application

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "inputs": [
        "src/**/*.{js,ts,jsx,tsx}",
        "pages/**/*.{js,ts,jsx,tsx}",
        "public/**",
        "package.json",
        "next.config.js",
        "tailwind.config.js"
      ],
      "env": ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_APP_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": ["NEXT_PUBLIC_API_URL"]
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false,
      "persistent": true,
      "env": ["PORT", "NODE_ENV"]
    }
  }
}
```

### React Library

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": [
        "src/**/*.{js,ts,jsx,tsx}",
        "package.json",
        "tsconfig.json",
        "rollup.config.js",
        "vite.config.ts"
      ]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "test/**/*.{js,ts}", "package.json", "jest.config.js"]
    },
    "storybook": {
      "dependsOn": ["build"],
      "outputs": ["storybook-static/**"],
      "cache": false,
      "persistent": true
    }
  }
}
```

### Full-Stack Monorepo

```json
{
  "globalDependencies": ["**/.env.*local", ".env"],
  "globalEnv": ["NODE_ENV", "VERCEL_ENV"],

  "pipeline": {
    // Shared packages build first
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "package.json"]
    },

    // Type checking
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "package.json", "tsconfig.json"]
    },

    // Linting
    "lint": {
      "outputs": [],
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "*.{json,js,ts}", ".eslintrc.*", ".prettierrc.*"]
    },

    // Testing
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.{js,ts,jsx,tsx}", "test/**/*.{js,ts}", "package.json"]
    },

    // E2E Testing
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": [],
      "runtimeDependencies": ["database"],
      "env": ["E2E_BASE_URL"]
    },

    // Development
    "dev": {
      "cache": false,
      "persistent": true,
      "runtimeDependencies": ["database", "redis"]
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Cache Misses

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": [
        "src/**/*.{js,ts,jsx,tsx}",
        "package.json",
        "tsconfig.json"
        // Make sure all relevant files are in inputs
      ]
    }
  }
}
```

#### Dependency Cycles

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
      // Remove circular dependencies
      // Don't depend on tasks in the same package
    },
    "test": {
      "dependsOn": ["build"]
      // This is fine - test depends on build in same package
    }
  }
}
```

#### Environment Variables

```json
{
  "globalEnv": ["NODE_ENV", "CI"],
  "pipeline": {
    "build": {
      "env": ["API_URL"],
      "passThruEnv": false
      // Set passThruEnv to false to avoid unexpected env vars
    }
  }
}
```

## Best Practices

### Configuration Organization

```json
{
  // Use composable configurations
  "#build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**"],
    "cache": true
  },

  "#test": {
    "dependsOn": ["build"],
    "outputs": ["coverage/**"],
    "cache": true
  },

  "#lint": {
    "outputs": [],
    "cache": true
  },

  // Extend base configurations
  "build:client": {
    "extends": ["#build"],
    "env": ["CLIENT_API_URL"]
  },

  "build:server": {
    "extends": ["#build"],
    "env": ["SERVER_API_URL"]
  }
}
```

### Performance Optimization

```json
{
  "pipeline": {
    // Minimize dependencies for faster parallel execution
    "lint": {
      "outputs": [],
      "cache": true
      // No dependsOn = can run in parallel
    },

    // Use specific outputs to avoid over-caching
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!.next/cache/**"],
      "outputsMode": "new-only"
    },

    // Use environment-specific caching
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV"],
      "cache": true
    }
  }
}
```

## References

- [Turborepo Configuration Documentation](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks)
- [Turborepo Configuration Reference](https://turborepo.dev/docs/reference/configuration)
- [Turborepo Caching](https://turborepo.dev/docs/core-concepts/caching)
- [Turborepo Task Dependencies](https://turborepo.dev/docs/core-concepts/monorepos/running-tasks)

## Implementation

[Add content here]

## Testing

[Add content here]
