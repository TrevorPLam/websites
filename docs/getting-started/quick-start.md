---
title: Quick Start Guide
description: Get up and running with the marketing websites monorepo in minutes
last_updated: 2026-02-26
tags: [#getting-started #setup #quick-start]
estimated_read_time: 10 minutes
difficulty: beginner
---

# Quick Start Guide

## Overview

This guide helps you get the marketing websites monorepo running on your local machine in under 10 minutes. Perfect for developers who want to start contributing immediately.

## Prerequisites

- **Node.js 20.9.0+** - Required for Next.js 16
- **pnpm 9.0+** - Package manager for monorepo
- **Git** - Version control
- **VS Code** (recommended) - With extensions for TypeScript and React

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd marketing-websites

# Install dependencies
pnpm install

# Copy environment template
cp .env.template .env.local
```

### 2. Start Development

```bash
# Start all development servers
pnpm dev

# Or start specific apps
pnpm dev:web     # Marketing website
pnpm dev:portal  # Admin portal
```

### 3. Verify Installation

Open http://localhost:3000 in your browser to see the marketing website.

## Next Steps

- [Development Setup](./development-setup.md) - Complete development environment
- [First Project](./first-project.md) - Create your first marketing site
- [Common Tasks](../how-to/common-tasks/) - Daily development workflows

## Troubleshooting

**Port already in use?**
```bash
# Kill processes on ports 3000-3010
pnpm kill-ports
```

**Dependency issues?**
```bash
# Clear and reinstall
pnpm clean
pnpm install
```

## Related Resources

- [Architecture Overview](../guides-new/architecture/)
- [Development Patterns](../guides-new/development/)
- [Troubleshooting Guide](../how-to/troubleshooting/)
