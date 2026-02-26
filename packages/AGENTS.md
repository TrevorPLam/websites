# Package-specific agent instructions

**Scope:** Files in `packages/**`. Root [AGENTS.md](../AGENTS.md) applies globally. Task non-negotiables: [.context/RULES.md](../.context/RULES.md#task-execution-non-negotiables).

---

## Layer model (2026 Enhanced)

- **L0:** `@repo/infra`, `@repo/integrations-*` — security, middleware, logging
- **L1:** `@repo/agent-*` — multi-agent orchestration and governance
- **L2:** `@repo/ui`, `@repo/features`, `@repo/types`, `@repo/utils` — components, business logic
- **L3:** `clients/*` — experience layer (consumes packages)

**Evolution (Phase 3+):** Capability layer — `@repo/infra/features` with `defineFeature`, `featureRegistry`. Features self-declare sections, integrations, dataContracts. See [evolution-roadmap](../docs/architecture/evolution-roadmap.md) and tasks/evol-7, evol-8.

---

## Dependency rules (2026 Standards)

### Allowed Dependencies
- **Allowed:** `@repo/features` → `@repo/ui`, `@repo/utils`, `@repo/types`, `@repo/infra`
- **Allowed:** `@repo/ui` → `@repo/utils`, `@repo/types`
- **NEW:** `@repo/agent-*` → `@repo/infra`, `@repo/integrations-*` (for orchestration)
- **NEW:** MCP server access via `.mcp/config.json` coordination

### Forbidden Patterns
- **Forbidden:** Any package → `clients/`
- **Forbidden:** Deep imports (e.g. `@repo/infra/src/internal`) — use public exports only
- **NEW:** Direct cross-agent communication without A2A protocol
- **NEW:** MCP server bypass (must use protocol-defined access)

---

## Adding a package (2026 Process)

1. **Create Structure:** `packages/<name>/` with `package.json` name `@repo/<name>`
2. **TypeScript Setup:** Extend `@repo/typescript-config` in `tsconfig.json`
3. **Linting:** Add `eslint.config.mjs` extending `@repo/eslint-config`
4. **Exports:** Export from `src/index.ts` with proper client/server separation
5. **React Dependencies:** Declare React as `peerDependencies` if used (not direct)
6. **Validation:** Run `pnpm validate-exports` after adding exports
7. **NEW:** MCP Integration: Add MCP server configuration if package provides tools
8. **NEW:** A2A Support: Add agent card at `/.well-known/agent-card.json` if orchestration-enabled

---

## Multi-Agent Integration Patterns

### MCP Server Registration
```json
// .mcp/config.json
{
  "mcpServers": {
    "@repo/package-name": {
      "command": "node",
      "args": ["./dist/mcp-server.js"],
      "env": {
        "PACKAGE_MODE": "production"
      }
    }
  }
}
```

### A2A Agent Card Template
```json
// /.well-known/agent-card.json
{
  "name": "@repo/package-name",
  "version": "1.0.0",
  "capabilities": ["package-specific-operations"],
  "endpoints": {
    "health": "/health",
    "operations": "/operations"
  },
  "mcp_servers": ["tool-access", "data-retrieval"],
  "authentication": "oauth2"
}
```

---

## File headers (2026 Standard)

Add structured comment blocks per [.context/RULES.md](../.context/RULES.md). Include `@file`, `@summary`, `@exports`, `@invariants`, `@gotchas`.

**2026 Additions:**
- `@mcp-servers`: MCP server dependencies
- `@a2a-capabilities`: A2A protocol capabilities
- `@agent-coordination`: Required agent orchestration patterns

---

## Tests (2026 Enhanced)

### Test Environments
- **Node env:** Server utilities, lib/, actions, MCP server testing
- **jsdom env:** React components, UI integration
- **NEW:** Agent env:** Multi-agent orchestration testing

### Test Location & Patterns
- Location: `__tests__/` or co-located `*.test.ts(x)`
- Use `@testing-library/react`, `jest-axe` for UI
- **NEW:** MCP server integration tests with mock protocols
- **NEW:** A2A communication tests with agent card validation

### Coverage Requirements
- Unit tests: Core package functionality
- Integration tests: MCP/A2A protocol compliance
- **NEW:** Agent orchestration: Multi-agent workflow validation
- **NEW:** Security tests: OAuth 2.1 and zero-trust patterns
