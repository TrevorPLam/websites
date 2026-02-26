#!/usr/bin/env node

/**
 * Standardize AGENTS.md files across all packages
 * 2026 enterprise agentic coding standards
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const PACKAGES_DIR = join(process.cwd(), 'packages');

// 2026 Standard AGENTS.md template for packages
const PACKAGE_AGENTS_TEMPLATE = `# packages/{{PACKAGE_NAME}} — AI Agent Context

## Scope

Applies to \`packages/{{PACKAGE_NAME}}/**\`.

## Purpose

- Maintain package-level boundaries and stable public exports
- Keep changes aligned with Domain 3 FSD architecture requirements
- **2026:** Enable MCP and A2A protocol integration where applicable

## Structure Guidance

- Prefer \`src/\` as implementation root
- Keep internals private; export through \`src/index.ts\` only
- Avoid deep imports from other packages
- **2026:** Use MCP servers for external tool access
- **2026:** Support A2A protocol for agent coordination

## MCP Integration (if applicable)

{{MCP_SECTION}}

## A2A Protocol Support (if applicable)

{{A2A_SECTION}}

## Package-Specific Rules

{{PACKAGE_RULES}}

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
`;

// MCP server section template
const MCP_SECTION_TEMPLATE = `This package provides MCP servers:

### Available MCP Servers
{{MCP_SERVERS}}

### Configuration
Add to \`.mcp/config.json\`:
\`\`\`json
{
  "mcpServers": {
    "@repo/{{PACKAGE_NAME}}": {
      "command": "node",
      "args": ["./dist/mcp-server.js"]
    }
  }
}
\`\`\``;

// A2A protocol section template
const A2A_SECTION_TEMPLATE = `This package supports A2A protocol:

### Agent Card
Location: \`/.well-known/agent-card.json\`

### Capabilities
{{A2A_CAPABILITIES}}

### Endpoints
- Health: \`/health\`
- Operations: \`/operations\`
- Agent Card: \`/.well-known/agent-card.json\``;

// Package-specific rules for common package types
const PACKAGE_RULES = {
  'ui': `- Component exports must be React Server Components by default
- Use 'use client' directive only for interactive components
- Follow Design System patterns and theming
- Test with React Testing Library and jest-axe`,
  
  'features': `- Export business logic, not UI components
- Use repository pattern for data access
- Include comprehensive error handling
- Test with Vitest and mock repositories`,
  
  'integrations': `- Provide both client and server export paths
- Include proper error boundaries and retry logic
- Use OAuth 2.1 patterns for authentication
- Test integration with external services`,
  
  'infra': `- Server-side utilities only (no client exports)
- Include comprehensive logging and monitoring
- Use zero-trust security patterns
- Test with Node.js environment`,
  
  'agent-*': `- Implement A2A protocol compliance
- Provide MCP server integration
- Include agent orchestration patterns
- Test multi-agent communication`,
  
  'default': `- Follow standard package export patterns
- Include comprehensive TypeScript types
- Maintain backward compatibility
- Test with appropriate environment`
};

function getPackageRules(packageName) {
  for (const [pattern, rules] of Object.entries(PACKAGE_RULES)) {
    if (pattern === 'default') continue;
    if (packageName.startsWith(pattern)) {
      return rules;
    }
  }
  return PACKAGE_RULES.default;
}

function hasMcpServers(packageName, packagePath) {
  // Check if package has MCP server implementation
  const mcpServerPath = join(packagePath, 'src', 'mcp-server.ts');
  const mcpServerJsPath = join(packagePath, 'src', 'mcp-server.js');
  return existsSync(mcpServerPath) || existsSync(mcpServerJsPath);
}

function hasA2ASupport(packageName, packagePath) {
  // Check if package has A2A agent card
  const agentCardPath = join(packagePath, '.well-known', 'agent-card.json');
  return existsSync(agentCardPath);
}

function generatePackageAgents(packageName) {
  const packagePath = join(PACKAGES_DIR, packageName);
  
  let content = PACKAGE_AGENTS_TEMPLATE.replace(/{{PACKAGE_NAME}}/g, packageName);
  
  // Add MCP section if applicable
  if (hasMcpServers(packageName, packagePath)) {
    const mcpSection = MCP_SECTION_TEMPLATE.replace('{{MCP_SERVERS}}', 
      `- Tool access server\n- Data retrieval server`);
    content = content.replace('{{MCP_SECTION}}', mcpSection);
  } else {
    content = content.replace('{{MCP_SECTION}}', 
      'This package does not provide MCP servers.');
  }
  
  // Add A2A section if applicable
  if (hasA2ASupport(packageName, packagePath)) {
    const a2aSection = A2A_SECTION_TEMPLATE.replace('{{A2A_CAPABILITIES}}',
      `- Package-specific operations\n- External service integration`);
    content = content.replace('{{A2A_SECTION}}', a2aSection);
  } else {
    content = content.replace('{{A2A_SECTION}}', 
      'This package does not support A2A protocol.');
  }
  
  // Add package-specific rules
  const rules = getPackageRules(packageName);
  content = content.replace('{{PACKAGE_RULES}}', rules);
  
  return content;
}

function main() {
  console.log('🤖 Standardizing AGENTS.md files across packages...');
  
  const packages = readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let updatedCount = 0;
  
  for (const packageName of packages) {
    const agentsPath = join(PACKAGES_DIR, packageName, 'AGENTS.md');
    const newContent = generatePackageAgents(packageName);
    
    // Check if file exists and needs updating
    let shouldUpdate = true;
    if (existsSync(agentsPath)) {
      const existingContent = readFileSync(agentsPath, 'utf-8');
      shouldUpdate = existingContent !== newContent;
    }
    
    if (shouldUpdate) {
      writeFileSync(agentsPath, newContent, 'utf-8');
      console.log(`✅ Updated ${packageName}/AGENTS.md`);
      updatedCount++;
    } else {
      console.log(`⏭️  Skipped ${packageName}/AGENTS.md (no changes)`);
    }
  }
  
  console.log(`\\n🎯 Complete! Updated ${updatedCount} package AGENTS.md files`);
  console.log('📚 All packages now follow 2026 enterprise agentic coding standards');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
