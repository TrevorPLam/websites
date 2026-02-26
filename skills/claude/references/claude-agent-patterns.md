# Claude Agent Patterns Reference

## Overview
This reference document outlines established patterns for Claude agent integration in the marketing websites monorepo, following 2026 agentic coding standards.

## Claude-Specific Optimization Patterns

### 1. Context Management
```typescript
// Claude prefers explicit context boundaries
const claudeContext = {
  role: "senior-typescript-engineer",
  stack: "Next.js 16/React 19/FSD v2.1",
  standards: "2026-agentic-coding",
  focus: "multi-tenant-saas-architecture"
};
```

### 2. Prompt Engineering for Claude
- Use structured markdown with clear section headers
- Provide explicit file paths and line numbers
- Include TypeScript type annotations in prompts
- Reference existing patterns with `see: components/Button.tsx`

### 3. MCP Integration Patterns
```json
{
  "claude-preferred-servers": [
    "sequential-thinking",
    "knowledge-graph", 
    "github",
    "documentation",
    "filesystem"
  ],
  "workflow-order": "research → implement → validate → document"
}
```

## File Header Standards
```typescript
/**
 * @fileoverview [Brief description]
 * @author [author-name]
 * @created [YYYY-MM-DD]
 * @package [package-name]
 * @pattern [pattern-name]
 * @see [reference-file]
 */
```

## Code Review Patterns (Claude-specific)

### Security Review Checklist
- [ ] Multi-tenant data isolation verified
- [ ] OAuth 2.1 compliance checked
- [ ] Server/Client boundaries respected
- [ ] TypeScript strict mode compliance
- [ ] FSD layer isolation maintained

### Performance Review Checklist  
- [ ] Core Web Vitals impact assessed
- [ ] Bundle size implications analyzed
- [ ] Server Components optimization
- [ ] PPR patterns correctly implemented

## Error Handling Patterns
```typescript
// Claude prefers explicit error types
type ClaudeError = {
  type: 'validation' | 'security' | 'performance' | 'architecture';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  suggestion: string;
  references: string[];
};
```

## Communication Patterns

### Progress Updates
- Use terse, direct communication
- Provide fact-based progress summaries
- Include file paths and function names in backticks
- Batch tool calls for maximum efficiency

### Quality Gates
Before claiming completion:
1. Run `pnpm type-check` - no TypeScript errors
2. Run `pnpm lint` - no linting errors  
3. Run `pnpm test` - all tests passing
4. Validate MCP/A2A configurations
5. Check Core Web Vitals impact

## Integration with Existing Systems

### AGENTS.md Integration
- Keep root AGENTS.md under 500 words
- Reference per-package AGENTS.md files
- Follow cold-start checklist patterns

### MCP Server Coordination
- Use sequential-thinking for complex reasoning
- Leverage knowledge-graph for persistent memory
- Integrate with github-server for repository operations
- Use documentation-server for context retrieval

## Best Practices Summary

### DO
- Reference canonical files with exact paths
- Write tests alongside code, never after
- Use git worktrees for parallel workstreams
- Keep AGENTS.md under 500 words
- Start new sessions between tasks

### DON'T  
- Never delete failing test to make coverage pass
- Never use `any` type
- Never commit directly to main
- Never hardcode secrets
- Never carry completed task's thread into next task

## Troubleshooting

### Common Claude Agent Issues
| Issue | Solution |
|-------|----------|
| Context overflow | Use memory system for persistent information |
| Tool call failures | Verify MCP server configuration |
| Type errors | Check TypeScript strict mode compliance |
| FSD violations | Run Steiger linter validation |

### Performance Optimization
- Use parallel tool execution whenever possible
- Batch independent operations
- Minimize context switching between domains
- Use memory system to avoid repeated research

## References
- AGENTS.md (root coordination patterns)
- CLAUDE.md (sub-agent orchestration)
- MCP Integration Documentation
- 2026 Agentic Coding Standards
- Feature-Sliced Design v2.1 Specification
