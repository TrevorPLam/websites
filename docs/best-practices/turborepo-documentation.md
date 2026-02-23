# Turborepo Documentation: Core Concepts and Configuration

## Introduction

Turborepo is a high-performance build system for JavaScript and TypeScript monorepos. It optimizes build processes through content-aware caching and parallel task execution, drastically reducing build times. By understanding the dependency graph of your workspace, Turborepo ensures that you never do the same work twice .

## 1. Core Concepts

### 1.1 Workspace Structure

A typical Turborepo is organized into two main directories: `apps/` for deployable applications and `packages/` for shared libraries and configurations. The workspace is defined in the root `package.json` (for npm/yarn) or `pnpm-workspace.yaml` (for pnpm) .

```

my-turborepo/
├── apps/
│ ├── web/
│ └── docs/
├── packages/
│ ├── ui/
│ └── typescript-config/
├── turbo.json
└── package.json

```

### 1.2 Task Pipelines

The `turbo.json` file is the heart of Turborepo configuration. It defines a **pipeline** of tasks, their dependencies, and their outputs. This tells Turborepo how to run, cache, and orchestrate your scripts .

Key pipeline concepts include:

- **`dependsOn`**: Defines task relationships.
  - `"dependsOn": ["^build"]`: Means the `build` task for a workspace depends on the `build` tasks of its **dependencies** (the `^` caret signifies "dependencies first"). This ensures your UI library is built before the app that uses it.
  - `"dependsOn": ["build"]`: Means this task depends on the `build` task of the **same** workspace.
- **`outputs`**: An array of glob patterns for files Turborepo should cache (e.g., `["dist/**", ".next/**"]`).
- **`inputs`**: (Optional) Specifies which files affect a task's cache key. By default, it uses all files in the package. You can customize this to ignore documentation or test files for a build task .
- **`cache`**: A boolean (`true`/`false`) to enable or disable caching for a task. Long-running processes like dev servers should set `"cache": false` .
- **`persistent`**: Marks a task as long-running (e.g., `dev` server), telling Turborepo not to wait for it to finish .

## 2. Pipeline Configuration Examples

### 2.1 Basic Root `turbo.json`

This example shows a standard setup for building, linting, and testing .

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 2.2 Package-Specific Pipeline

You can override or extend the root pipeline by placing a `turbo.json` file in a specific package .

```json
// apps/web/turbo.json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_API_URL"]
    }
  }
}
```

## 3. Remote Caching

Remote caching shares build artifacts across your team and CI/CD machines, so only one person or machine ever needs to build a given hash. Everyone else can download the result instantly .

### 3.1 Setup with Vercel

1.  **Login:** Run `npx turbo login` to authenticate with your Vercel account.
2.  **Link:** Run `npx turbo link` to connect your local repository to a Vercel project.
3.  **Use:** Subsequent `turbo run` commands will automatically upload and download cache artifacts .

### 3.2 Self-Hosted Remote Cache

For teams with specific infrastructure requirements, Turborepo can be configured to use a custom remote cache server by setting the `--api`, `--token`, and `--team` flags or environment variables .

```bash
# Example using a self-hosted cache server
turbo build --api="http://localhost:3000" --token="my-token" --team="my-team"
```

## 4. Filtering and Scoping

Turborepo provides powerful `--filter` flags to run tasks on specific subsets of your workspace .

- `turbo build --filter=@myorg/web`: Build only the `web` package.
- `turbo build --filter=@myorg/ui...`: Build `ui` and everything that depends on it.
- `turbo build --filter='...[origin/main]'`: Build all packages changed since the `main` branch.

### 4.2 2026 Performance Innovations

Turborepo's 2026 release introduces major performance improvements powered by a new
Rust-based engine and enhanced caching algorithms.

- **Build speed**: 2-3x faster builds for large monorepos
- **Memory efficiency**: 50% reduction in memory usage during builds
- **Startup time**: Near-instant command initialization
- **Parallel processing**: Enhanced CPU utilization for multi-core systems

### 5.1 Rust-Powered Engine

Turborepo's core rewrite in Rust delivers significant performance improvements:

- **Build speed**: 2-3x faster builds for large monorepos
- **Memory efficiency**: 50% reduction in memory usage during builds
- **Startup time**: Near-instant command initialization
- **Parallel processing**: Enhanced CPU utilization for multi-core systems

### 5.2 OIDC Security Integration

New security features for enterprise environments:

- **OIDC authentication**: Secure authentication without API tokens
- **Role-based access control**: Granular permissions for cache access
- **Audit logging**: Comprehensive tracking of cache operations
- **Zero-trust architecture**: Security-first design for remote caching

### 5.3 Enhanced Remote Caching

Improved remote caching capabilities:

- **Intelligent cache compression**: Reduced bandwidth usage
- **Predictive caching**: AI-powered cache preloading
- **Cross-region cache replication**: Global cache distribution
- **Cache analytics**: Detailed insights into cache performance

## 6. Enterprise Features

### 6.1 Team Collaboration

Enhanced features for team development:

- **Real-time build status**: Live build progress across teams
- **Conflict detection**: Automatic detection of overlapping changes
- **Team dashboards**: Centralized view of build performance
- **Integration with IDEs**: VS Code and JetBrains extensions

### 6.2 Compliance and Governance

Enterprise-grade compliance features:

- **Dependency scanning**: Automated security vulnerability detection
- **License compliance**: Open source license management
- **Build reproducibility**: Guaranteed consistent builds across environments
- **Audit trails**: Complete history of build operations

By leveraging these concepts, Turborepo transforms monorepo management from a slow, complex process into a fast, efficient, and scalable one.
