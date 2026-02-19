# Infrastructure-6: Scaffold MCP for AI-Assisted Development Governance

## Metadata

- **Task ID**: infrastructure-6-scaffold-mcp
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Priority)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: AI governance, developer experience, architectural consistency
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: None (enables better AI-assisted development)

## Context

AI coding assistants (Claude Code, Cursor) can generate inconsistent code that violates architectural patterns. Scaffold MCP (Model Context Protocol) enforces architectural patterns via scaffold.yaml files, ensuring AI-generated code follows team conventions.

Current state: No AI governance. AI assistants may generate "Frankenstein" codebases that violate module boundaries and patterns.

This addresses **Research Topic: Scaffold MCP** from gemini2.md.

## Dependencies

- **Required Packages**: `@modelcontextprotocol/server-scaffold` (or similar)
- **MCP Server**: Scaffold MCP server setup
- **Configuration**: `scaffold.yaml` files for each package/template

## Research

- **Primary topics**: [R-SCAFFOLD-MCP](RESEARCH-INVENTORY.md#r-scaffold-mcp) (new)
- **[2026-02] Gemini Research**: Scaffold MCP benefits:
  - Enforces architectural patterns via scaffold.yaml
  - Prevents "Frankenstein" codebases
  - Provides AI agents with structured templates
  - Validates variables (e.g., PascalCase for service names)
- **Threat Model**: Architectural drift, inconsistent code patterns, violation of module boundaries
- **References**: 
  - [docs/research/gemini-production-audit-2026.md](../docs/research/gemini-production-audit-2026.md) (Topic: AI Platform Governance)

## Related Files

- `scaffold.yaml` – create – Root scaffold configuration
- `packages/*/scaffold.yaml` – create – Package-specific scaffolds
- `clients/*/scaffold.yaml` – create – Client-specific scaffolds
- `.cursor/mcp-servers.json` – modify – Add scaffold MCP server
- `docs/architecture/ai-governance/scaffold-mcp.md` – create – Document Scaffold MCP usage

## Acceptance Criteria

- [ ] Scaffold MCP server configured:
  - MCP server installed and configured
  - Cursor/MCP integration working
- [ ] Scaffold templates created:
  - Component scaffold (enforces @repo/ui patterns)
  - Server Action scaffold (enforces secureAction pattern)
  - Integration scaffold (enforces @repo/integrations-* patterns)
- [ ] Validation rules configured:
  - Variable naming conventions (PascalCase, camelCase)
  - Module boundary enforcement
  - Import pattern validation
- [ ] Documentation created: `docs/architecture/ai-governance/scaffold-mcp.md`
- [ ] Example scaffolds for common patterns
- [ ] CI check: Verify scaffold.yaml files are valid

## Technical Constraints

- Requires MCP server setup (may need custom implementation)
- Scaffold templates must be maintained alongside codebase
- Must integrate with Cursor/Claude Code workflows

## Implementation Plan

### Phase 1: MCP Server Setup
- [ ] Research Scaffold MCP server options
- [ ] Install/configure MCP server
- [ ] Configure Cursor to use Scaffold MCP server

### Phase 2: Scaffold Templates
- [ ] Create root `scaffold.yaml`:
  - Common patterns (imports, exports, file structure)
  - Validation rules (naming conventions)
- [ ] Create package-specific scaffolds:
  - `packages/ui/scaffold.yaml` — Component patterns
  - `packages/infra/scaffold.yaml` — Infrastructure patterns
  - `packages/integrations-*/scaffold.yaml` — Integration patterns

### Phase 3: Validation
- [ ] Test scaffold templates with AI assistants
- [ ] Verify generated code follows patterns
- [ ] Add CI check for scaffold.yaml validation

### Phase 4: Documentation
- [ ] Document Scaffold MCP usage
- [ ] Create guide for creating new scaffolds
- [ ] Document best practices for AI-assisted development

## Testing

- [ ] Test scaffold templates generate correct code
- [ ] Verify validation rules catch violations
- [ ] Test MCP server integration with Cursor
- [ ] Verify CI checks scaffold.yaml files

## Notes

- Scaffold MCP prevents architectural drift from AI-generated code
- Templates should encode team conventions and patterns
- Should be maintained alongside codebase evolution
- Complements manual code reviews by enforcing patterns at generation time
- May require custom MCP server implementation if no existing solution fits
