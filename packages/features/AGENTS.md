# packages/features — AI Agent Context

## Scope

Applies to `packages/features/**`.

## Purpose

- Maintain package-level boundaries and stable public exports
- Keep changes aligned with Domain 3 FSD architecture requirements
- **2026:** Enable MCP and A2A protocol integration where applicable

## Structure Guidance

- Prefer `src/` as implementation root
- Keep internals private; export through `src/index.ts` only
- Avoid deep imports from other packages
- **2026:** Use MCP servers for external tool access
- **2026:** Support A2A protocol for agent coordination

## MCP Integration (if applicable)

This package does not provide MCP servers.

## A2A Protocol Support (if applicable)

This package does not support A2A protocol.

## Package-Specific Rules

- Export business logic, not UI components
- Use repository pattern for data access
- Include comprehensive error handling
- Test with Vitest and mock repositories

## QA Checklist

1. Run package-local lint/tests when available
2. Verify exports and type checks for touched files
3. Update relevant task docs when behavior or structure changes
4. **2026:** Validate MCP server configurations where used
5. **2026:** Test A2A agent card compliance where implemented

## Related Documentation

- [../../AGENTS.md](../../AGENTS.md) - Root agent context
- [../../CLAUDE.md](../../CLAUDE.md) - Sub-agent orchestration
- [.mcp/README.md](../../.mcp/README.md) - MCP server documentation
