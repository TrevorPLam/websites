---
name: mcp-server-guide
description: |
  **REFERENCE SKILL** - MCP server development and integration guide.
  USE FOR: Understanding MCP server patterns, tool development, configuration.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# MCP Server Development Guide

## Overview
This reference document provides patterns and best practices for developing Model Context Protocol (MCP) servers in the marketing websites monorepo.

## MCP Server Architecture

### Core Components
- **McpServer**: Main server class from @modelcontextprotocol/sdk
- **Tools**: Callable functions with Zod validation
- **Transport**: Communication layer (stdio, HTTP, WebSocket)
- **Resources**: Static data providers
- **Prompts**: Reusable prompt templates

### Server Structure Pattern

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'server-name',
  version: '1.0.0',
});

// Tool registration with Zod validation
server.tool(
  'tool-name',
  'Tool description',
  { param: z.string().optional() },
  async ({ param }) => {
    const result = await doSomething(param);
    return { 
      content: [{ 
        type: 'text', 
        text: JSON.stringify(result) 
      }] 
    };
  }
);

// ESM CLI guard
if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

## Response Format Standards

### Success Response
```typescript
return {
  content: [{
    type: 'text',
    text: JSON.stringify({ 
      result: data,
      message: 'Success' 
    })
  }]
};
```

### Error Response
```typescript
return {
  content: [{
    type: 'text',
    text: JSON.stringify({ 
      error: errorMessage 
    })
  }],
  isError: true
};
```

## Tool Development Patterns

### Input Validation
- Always use Zod schemas for parameter validation
- Provide clear descriptions for each parameter
- Set sensible defaults where appropriate
- Handle edge cases gracefully

### Error Handling
```typescript
server.tool('safe-tool', 'Description', schema, async (params) => {
  try {
    const result = await riskyOperation(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
      isError: true
    };
  }
});
```

### Async Operations
- Use proper async/await patterns
- Handle timeouts appropriately
- Provide progress feedback for long operations
- Clean up resources properly

## Security Considerations

### Input Sanitization
- Validate all inputs with Zod schemas
- Never trust client-provided data
- Sanitize file paths and database queries
- Implement rate limiting where appropriate

### Environment Variables
```typescript
const REQUIRED_ENV = ['API_TOKEN', 'DATABASE_URL'];
for (const env of REQUIRED_ENV) {
  if (!process.env[env]) {
    console.error(`FATAL: ${env} environment variable not set`);
    process.exit(1);
  }
}
```

### Authentication
- Validate tokens on startup
- Implement proper session management
- Use secure storage for credentials
- Log authentication events

## Configuration Management

### Server Registration
```json
{
  "servers": {
    "server-name": {
      "command": "npx",
      "args": ["tsx", "path/to/server.ts"],
      "env": {
        "ENV_VAR": "${ENV_VAR}",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Environment-Specific Configs
- Use config.json for development
- Use config.production.json for production
- Support environment variable substitution
- Validate configurations on startup

## Testing Strategies

### Unit Testing
```typescript
import { describe, it, expect } from 'vitest';
import { createTestServer } from './test-utils';

describe('MyServer', () => {
  it('should handle tool calls correctly', async () => {
    const server = createTestServer();
    const result = await server.callTool('tool-name', { param: 'test' });
    expect(result.content[0].text).toContain('expected');
  });
});
```

### Integration Testing
- Test with real MCP client connections
- Validate tool registration and discovery
- Test error handling and edge cases
- Verify configuration loading

## Performance Optimization

### Memory Management
- Implement TTL for cached data
- Clean up resources on shutdown
- Use streaming for large datasets
- Monitor memory usage

### Concurrency
- Use proper async patterns
- Implement request queuing where needed
- Handle concurrent access to shared state
- Consider worker threads for CPU-intensive tasks

## Common Pitfalls

### Response Format
- ❌ `return { success: true, data: result }`
- ✅ `return { content: [{ type: 'text', text: JSON.stringify(result) }] }`

### Module Guards
- ❌ `if (require.main === module)` (CJS pattern)
- ✅ `if (import.meta.url === \`file://\${process.argv[1]}\`)` (ESM pattern)

### Error Handling
- ❌ Throwing uncaught exceptions
- ✅ Returning structured error responses

## Resource Management

### Database Connections
- Use connection pooling
- Handle connection timeouts
- Implement retry logic
- Clean up connections on shutdown

### File System Operations
- Validate file paths
- Handle permission errors
- Use atomic writes where possible
- Clean up temporary files

## Monitoring and Observability

### Logging
```typescript
const logger = {
  debug: (msg: string, data?: any) => console.log(`[DEBUG] ${msg}`, data),
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
  error: (msg: string, data?: any) => console.error(`[ERROR] ${msg}`, data)
};
```

### Metrics
- Track tool execution times
- Monitor error rates
- Log resource usage
- Capture performance trends

## References

- [MCP SDK Documentation](https://modelcontextprotocol.io)
- [Zod Validation](https://zod.dev)
- [Node.js ESM Modules](https://nodejs.org/api/esm.html)
- [TypeScript Best Practices](https://typescript-eslint.io)

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai
