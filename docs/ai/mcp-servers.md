# MCP Servers Reference

This document describes expected Model Context Protocol (MCP) integrations for AI-assisted development in this repository.

## Recommended MCP categories

1. **Repository context server**
   - Exposes task files, architecture docs, and package maps.
2. **CI/CD status server**
   - Exposes workflow runs and status checks.
3. **Issue tracker server**
   - Exposes issues, labels, and milestones.
4. **Observability server**
   - Exposes logs/metrics dashboards for debugging.

## Usage guidelines

- Prefer MCP resource reads over broad scans when available.
- Keep context minimal and task-scoped.
- Avoid exposing secrets in MCP resources.

## Required governance

- Access must be least-privilege.
- Resource responses should be auditable.
- High-risk actions should require explicit confirmation in agent workflows.
