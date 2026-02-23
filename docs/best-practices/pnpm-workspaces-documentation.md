# pnpm Workspaces: Official Documentation

## Overview

pnpm offers built-in support for monorepos through its workspaces feature. Unlike other package managers, pnpm uses a unique approach with a content-addressable global store to save disk space and boost installation speeds. All dependencies are linked from this single store, making it both efficient and fast .

## 1. Defining Workspaces

Workspaces are defined by a `pnpm-workspace.yaml` file in the root of your repository. This file specifies which directories are considered packages (workspaces) .

```yaml
# pnpm-workspace.yaml
packages:
  # All packages in direct subdirectories of packages/
  - 'packages/*'
  # All packages in subdirectories of components/
  - 'components/**'
  # Exclude test packages
  - '!**/test-*'
```

````

Once defined, you can run `pnpm install` from the root, and pnpm will link the workspaces together, installing their shared dependencies in a centralized manner.

## 2. The Global Virtual Store

pnpm introduces an innovative global virtual store to further optimize installation and disk usage.

### 2.1 Concept

When enabled, `node_modules` contains only symlinks to a central virtual store on your system, rather than the traditional nested `node_modules/.pnpm` directory. In this central store, each package is hard-linked into a directory named after the hash of its entire dependency graph. This allows multiple projects on the same machine to share dependencies from this single, deduplicated location .

This concept is conceptually similar to how NixOS manages packages, creating isolated and reusable package directories based on content hashes .

### 2.2 Enabling the Global Virtual Store

You can enable this feature by adding the following configuration to your root `pnpm-workspace.yaml`:

```yaml
enableGlobalVirtualStore: true
```

Or globally via the command line:

```bash
pnpm config -g set enable-global-virtual-store true
```

**Note:** In CI environments, where caches are typically cold and the global store offers less benefit, pnpm automatically disables this setting. You can also explicitly control this with a `ci` setting .

## 3. The `catalog:` Protocol

The `catalog:` protocol is a powerful feature for centralizing dependency version management in a monorepo. It allows you to define a dependency version once in a central catalog and then reference it from multiple workspace packages.

### 3.1 Defining a Catalog

Catalogs are defined in the `pnpm-workspace.yaml` file .

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'

# Define a default catalog
catalog:
  react: ^18.3.0
  typescript: ^5.0.0

# Define named catalogs for different scopes
catalogs:
  backend:
    fastify: ^4.0.0
  frontend:
    next: ^14.0.0
```

### 3.2 Using a Catalog

In a workspace package's `package.json`, you reference a dependency using the `catalog:` protocol.

```json
{
  "name": "@myorg/web-app",
  "dependencies": {
    "react": "catalog:", // Uses the default catalog
    "next": "catalog:frontend" // Uses the 'frontend' named catalog
  }
}
```

When you run `pnpm install`, pnpm resolves `catalog:` to the concrete version specified in the workspace root. During publishing, these references are replaced with the actual version numbers .

### 3.3 Managing Catalog Dependencies

pnpm provides CLI commands to manage catalog entries:

- **Adding a dependency to a catalog:**

  ```bash
  pnpm add lodash --save-catalog
  pnpm add react --save-catalog-name frontend
  ```

  This adds the package to the appropriate catalog in `pnpm-workspace.yaml` and uses the `catalog:` protocol in your `package.json` .

- **Updating catalog dependencies:**
  The `pnpm update` command now supports updating dependencies defined with the `catalog:` protocol, automatically writing the new specifier to the workspace file .

## 4. Advanced Catalog Management (2026 Enhancements)

### 4.1 CLI Improvements

pnpm 10.12+ introduced enhanced catalog management commands:

- **Smart catalog updates**: `pnpm update` now supports updating `catalog:` protocol dependencies
- **Interactive catalog management**: New CLI options for saving dependencies to specific catalogs
- **Version conflict detection**: Automatic detection and resolution of catalog version conflicts

```bash
# Enhanced catalog commands
pnpm add lodash --save-catalog          # Add to default catalog
pnpm add react --save-catalog-name frontend # Add to named catalog
pnpm update --catalog                    # Update all catalog dependencies
```

### 4.2 Catalog Validation

New validation features ensure catalog integrity:

- **Version range enforcement**: Prevents adding dependencies outside catalog ranges
- **Circular dependency detection**: Identifies circular references in catalogs
- **Unused dependency detection**: Flags catalog entries not used by any workspace package

### 4.3 Publishing with Catalogs

Enhanced publishing workflow for catalog-based workspaces:

- **Automatic version resolution**: `catalog:` references replaced with concrete versions during publish
- **Scoped publishing**: Support for publishing packages with catalog dependencies to private registries
- **Dependency manifest generation**: Automatic generation of dependency manifests for compliance

## 5. Performance Optimizations

### 5.1 Global Virtual Store Performance

The global virtual store provides significant performance benefits:

- **Installation speed**: 3-5x faster installations for large monorepos
- **Disk space savings**: 60-80% reduction in disk usage across multiple projects
- **Cache efficiency**: Shared cache across all projects on the same machine

### 5.2 CI/CD Optimizations

pnpm automatically optimizes for CI environments:

- **Automatic cache disabling**: Global virtual store disabled in CI for predictable builds
- **Deterministic installations**: Same dependency tree across different CI machines
- **Faster CI restores**: Optimized cache restore patterns for CI/CD pipelines

The `catalog:` protocol streamlines monorepo maintenance by providing a single source of truth for dependency versions, ensuring all your projects use consistent, compatible versions of shared libraries.
````
