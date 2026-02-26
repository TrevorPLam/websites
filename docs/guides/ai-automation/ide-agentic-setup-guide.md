# IDE Agentic Coding Setup Guide

## Overview

This guide documents the agentic coding file setups for Cursor, Windsurf, and GitHub Copilot IDEs in our marketing websites monorepo. Each IDE has specific configuration files that provide AI assistants with context-aware instructions for our 2026 enterprise standards.

## IDE-Specific Configurations

### Cursor AI

**Configuration File**: `.cursorrules`

**Purpose**: Provides project-specific instructions to Cursor AI for consistent code generation and assistance.

**Key Features**:

- Role definition as senior TypeScript engineer
- Technology stack specifications (Next.js 16, React 19, TypeScript 5.9.3)
- FSD v2.1 architecture rules
- Multi-tenant security requirements
- OAuth 2.1 with PKCE implementation
- Performance standards (Core Web Vitals)
- MCP and A2A protocol integration
- Package-specific guidelines
- Quality gates and anti-patterns

**Usage**:

- Place `.cursorrules` at repository root
- Cursor automatically loads and applies rules
- Use `Cmd+K` for chat with context
- Use `Tab` for inline completions

### Windsurf AI

**Configuration File**: `.windsurfrules`

**Purpose**: Provides comprehensive instructions for Cascade AI assistant with multi-agent orchestration capabilities.

**Key Features**:

- Cascade-specific features (Memory Management, Multi-Agent Orchestration)
- Workflow integration with todo_list tool
- Parallel tool execution patterns
- MCP server configurations
- A2A protocol implementation
- Browser preview integration
- Agent governance and audit trails

**Usage**:

- Place `.windsurfrules` at repository root
- Windsurf Cascade loads configuration automatically
- Use slash commands for workflow automation
- Leverage Memories for context persistence

### GitHub Copilot

**Configuration Files**:

- `.github/copilot-instructions.md` (repository-wide)
- `NAME.instructions.md` (path-specific in `.github/instructions/`)
- `AGENTS.md` (agent instructions, directory-scoped)

**Purpose**: Provides repository-specific guidance and preferences for GitHub Copilot across different contexts.

**Key Features**:

- Role & context definition
- Technology stack specifications
- Code standards & patterns
- Security requirements (multi-tenant, OAuth 2.1)
- Performance standards
- Multi-agent integration (2026)
- Package-specific guidelines
- Testing requirements
- Quality gates
- IDE-specific configuration

**Usage**:

- Repository-wide instructions apply to all requests in the repository
- Path-specific instructions apply to files matching specified paths
- Agent instructions used by AI agents (nearest AGENTS.md takes precedence)
- Use `Ctrl+I` for Copilot chat
- Use `@workspace` for repository context

## Common Standards Across All IDEs

### Technology Stack

- **Framework**: Next.js 16 with App Router and React 19
- **Language**: TypeScript 5.9.3 (strict mode, no `any`)
- **Architecture**: Feature-Sliced Design v2.1
- **Database**: Supabase with RLS
- **Authentication**: OAuth 2.1 with PKCE
- **Build System**: Turborepo + pnpm workspaces
- **Deployment**: Vercel with Edge functions

### Security Requirements

- Multi-tenant security with tenant_id clauses
- OAuth 2.1 with PKCE implementation
- Zero-trust architecture
- Rate limiting with sliding window algorithms
- Structured error handling

### Performance Standards

- Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- PPR for marketing pages
- Bundle size limits (JS < 250KB gzipped)

### Multi-Agent Integration (2026)

- MCP (Model Context Protocol) for external tool access
- A2A (Agent-to-Agent Protocol) for inter-agent communication
- Agent governance and audit trails

## Implementation Checklist

### Initial Setup

- [ ] Create `.cursorrules` with comprehensive project instructions
- [ ] Create `.windsurfrules` with Cascade-specific configurations
- [ ] Create `.github/copilot-instructions.md` with repository-wide guidance
- [ ] Set up path-specific instructions in `.github/instructions/` if needed
- [ ] Verify AGENTS.md files exist in relevant directories

### Validation

- [ ] Test AI assistance in each IDE
- [ ] Verify code generation follows FSD architecture
- [ ] Confirm security patterns are applied
- [ ] Check performance optimization suggestions
- [ ] Validate multi-agent integration guidance

### Maintenance

- [ ] Update configurations when technology stack changes
- [ ] Review and update security requirements
- [ ] Maintain performance standards
- [ ] Update MCP/A2A protocol guidance
- [ ] Keep documentation current

## Best Practices

### File Organization

- Keep IDE-specific files at repository root for global access
- Use consistent structure across all configuration files
- Maintain clear separation between IDE-specific and shared standards

### Content Standards

- Use clear, concise language
- Provide specific examples and patterns
- Include security and performance requirements
- Document anti-patterns to avoid

### Version Control

- Track all configuration files in version control
- Use meaningful commit messages for updates
- Review changes for consistency across IDEs

## Troubleshooting

### Common Issues

- **AI not following instructions**: Verify file placement and naming conventions
- **Inconsistent code generation**: Check for conflicting instructions across files
- **Missing context**: Ensure AGENTS.md files exist in relevant directories
- **Performance issues**: Review bundle size and Core Web Vitals guidance

### Resolution Steps

1. Verify configuration file exists and is properly named
2. Check file placement (root vs. directory-specific)
3. Review content for conflicts or ambiguities
4. Test with simple code generation tasks
5. Validate AI assistance follows established patterns

## Integration with Existing Documentation

These IDE configurations complement and reference existing documentation:

- `AGENTS.md` - Root agent coordination
- `CLAUDE.md` - Sub-agent orchestration patterns
- `.mcp/MCP_A2A_INTEGRATION_GUIDE.md` - MCP and A2A implementation
- Package-specific `AGENTS.md` files - Detailed package guidance

## Future Considerations

### 2026+ Enhancements

- Advanced multi-agent orchestration patterns
- Enhanced security protocols
- Performance optimization techniques
- Integration with new IDE features

### Maintenance Strategy

- Regular review of AI capabilities
- Updates to reflect new best practices
- Integration with emerging technologies
- Continuous improvement of guidance quality

This comprehensive setup ensures optimal AI assistance across all supported IDEs while maintaining consistent code quality, security, and performance standards for our enterprise multi-tenant SaaS platform.
