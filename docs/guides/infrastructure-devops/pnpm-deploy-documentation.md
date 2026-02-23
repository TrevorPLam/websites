<!--
/**
 * @file pnpm-deploy-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for pnpm deploy documentation.
 * @entrypoints docs/guides/pnpm-deploy-documentation.md
 * @exports pnpm deploy documentation
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

# Official Guide: pnpm deploy for Slim Production Bundles

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Introduction

`pnpm deploy` is a powerful command designed to create a slim copy of a workspace package for production deployment. It copies the specified package and all its necessary dependencies (production-only) into a new, standalone directory, excluding any unnecessary source code, `devDependencies`, or other workspace collateral. This is essential for creating efficient Docker images and streamlined deployment artifacts .

## 1. Core Concept

In a monorepo, a single application often depends on multiple internal workspace packages (e.g., `packages/ui`, `packages/utils`). Deploying the entire monorepo to a production server is inefficient and can include sensitive or unnecessary development files.

`pnpm deploy` solves this by:

1.  Creating a target directory.
2.  Copying the target application/package and its workspace dependencies into it.
3.  Merging the `package.json` files of the workspace dependencies into the target's structure.
4.  Rewriting `"workspace:*"` dependencies to their actual, concrete versions.
5.  Running a production-only installation (`pnpm install --prod`) in the target directory.

The result is a minimal, self-contained folder ready for packaging and deployment.

## 2. Basic Usage

The basic syntax is:

```bash
pnpm deploy <target-directory> --filter <package-name>
```

- `<target-directory>`: The path where the slimmed-down package will be created.
- `--filter <package-name>`: The name of the workspace package you want to deploy (as defined in its `package.json`).

For example, to deploy a package named `app1` into a `deploy/app1` folder:

```bash
pnpm deploy --filter=app1 --prod /prod/app1
```

The `--prod` flag ensures only production dependencies are installed, omitting `devDependencies`.

## 3. Real-World Use Case: Multi-Stage Docker Builds

The most common and powerful use case for `pnpm deploy` is within multi-stage Docker builds. This technique allows you to build your application in a "builder" stage and then copy only the production necessities to the final, slim image .

Consider a monorepo with this structure:

- `packages/app1/` - A Node.js application.
- `packages/app2/` - Another Node.js application.
- `packages/common/` - A shared library used by both apps.

### 3.1 The Dockerfile

A multi-stage `Dockerfile` at the root of your monorepo can build images for both applications efficiently.

```dockerfile
# Stage 1: Build
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app

# Copy only the files needed for installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages

# Install all dependencies (including dev) and build the projects
RUN pnpm install --frozen-lockfile
RUN pnpm run -r build

# Create deployment artifacts for each app
RUN pnpm deploy --filter=app1 --prod /prod/app1
RUN pnpm deploy --filter=app2 --prod /prod/app2

# Stage 2: Final image for app1
FROM node:20-slim AS app1
# Copy the pre-built artifact from the build stage
COPY --from=base /prod/app1 /prod/app1
WORKDIR /prod/app1
EXPOSE 8000
CMD ["pnpm", "start"]

# Stage 3: Final image for app2
FROM node:20-slim AS app2
COPY --from=base /prod/app2 /prod/app2
WORKDIR /prod/app2
EXPOSE 8001
CMD ["pnpm", "start"]
```

### 3.2 Building the Images

You can then build the specific image you need by targeting the stage:

```bash
# Build the image for app1
docker build . --target app1 --tag app1:latest

# Build the image for app2
docker build . --target app2 --tag app2:latest
```

### 3.3 Why This is Effective

- **Speed:** The build stage leverages Docker layer caching. The `pnpm deploy` step creates a minimal artifact.
- **Security & Size:** The final image for `app1` contains `app1`'s code, the compiled `common` library, and production `node_modules`. It contains **no** source code from `app2`, no `devDependencies`, and no `node_modules` from the `common` package's development dependencies. This results in a significantly smaller and more secure image.
- **Simplicity:** You manage a single `Dockerfile` for your entire monorepo, and each application's deployment is consistent and reproducible.

## 4. Alternative for CI/CD: `pnpm fetch`

For CI/CD environments where you want to leverage Docker layer caching without the complexity of `pnpm deploy`, `pnpm fetch` is a great alternative. It uses only the `pnpm-lock.yaml` file to download dependencies into the `node_modules` directory. This layer will only be invalidated if the `lock` file changes, making subsequent builds extremely fast .

```dockerfile
FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS prod
COPY pnpm-lock.yaml /app
# This layer caches the dependencies
RUN pnpm fetch --prod
COPY . /app
RUN pnpm run build
# ... rest of the Dockerfile
```

## 5. Advanced Deployment Patterns

### 5.1 BuildKit Cache Mount Integration

For optimal Docker layer caching, pnpm deploy integrates with Docker BuildKit cache mounts:

```dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-slim AS base
RUN corepack enable
WORKDIR /app

# Use BuildKit cache mount for pnpm store
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/root/.cache/pnpm \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Deploy with cache mount optimization
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm deploy --filter=app1 --prod /prod/app1
```

### 5.2 Multi-Platform Deployment

For teams targeting multiple platforms (linux/amd64, linux/arm64), pnpm deploy ensures consistent dependency resolution:

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

### 5.3 Security Hardening

Production deployments benefit from pnpm deploy's security advantages:

- **Minimal attack surface**: Only production dependencies included
- **No development tools**: Build tools and devDependencies excluded
- **Deterministic output**: Same hash across builds for security scanning
- **Dependency transparency**: Clear view of production dependencies

## 6. Performance Optimization

### 6.1 Cache Strategies

- **Local caching**: Leverage pnpm's content-addressable store
- **Remote caching**: Use pnpm's store server for team sharing
- **Layer caching**: Optimize Docker layers for CI/CD efficiency

### 6.2 Size Optimization

Typical size reductions with pnpm deploy:

- **Node.js applications**: 40-70% size reduction
- **Docker images**: 200MB+ savings per image
- **CI artifacts**: Faster upload/download times

By combining `pnpm deploy` and `pnpm fetch`, teams can create highly optimized, fast, and secure deployment pipelines for their pnpm-based monorepos.


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
