# MCP & A2A Protocol Integration Guide

## Overview

This guide provides comprehensive implementation patterns for integrating Model Context Protocol (MCP) and Agent-to-Agent (A2A) Protocol in the marketing websites monorepo following 2026 enterprise standards.

## Model Context Protocol (MCP)

### What is MCP?

MCP is the "USB-C port" for AI - a standardized bridge between AI agents and enterprise IT systems. It enables secure, universal access to tools, data, and workflows.

### MCP Server Implementation

#### Basic MCP Server Structure

```typescript
// src/mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class PackageMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: '@repo/package-name',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'package_operation',
          description: 'Execute package-specific operation',
          inputSchema: {
            type: 'object',
            properties: {
              action: { type: 'string' },
              parameters: { type: 'object' },
            },
            required: ['action'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'package_operation') {
        return await this.handlePackageOperation(args);
      }

      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    });
  }

  private async handlePackageOperation(args: any) {
    // Implementation specific to package
    return {
      content: [
        {
          type: 'text',
          text: `Operation ${args.action} completed successfully`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new PackageMCPServer();
server.run().catch(console.error);
```

#### MCP Configuration

```json
// .mcp/config.json
{
  "mcpServers": {
    "@repo/package-name": {
      "command": "node",
      "args": ["./dist/mcp-server.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### MCP Best Practices

1. **Security First**
   - Validate all inputs with Zod schemas
   - Implement proper error handling
   - Use OAuth 2.1 for authentication

2. **Performance**
   - Use streaming for large responses
   - Implement proper caching
   - Monitor resource usage

3. **Observability**
   - Log all operations with correlation IDs
   - Implement health checks
   - Track usage metrics

## Agent-to-Agent (A2A) Protocol

### What is A2A?

A2A Protocol enables secure, structured communication between autonomous AI agents. It provides vendor-neutral standards for agent discovery, messaging, and coordination.

### A2A Agent Card Implementation

```json
// .well-known/agent-card.json
{
  "name": "@repo/package-name",
  "version": "1.0.0",
  "description": "Package-specific agent capabilities",
  "capabilities": [
    "package-operations",
    "data-processing",
    "external-integration"
  ],
  "endpoints": {
    "health": "/health",
    "operations": "/operations",
    "agent-card": "/.well-known/agent-card.json"
  },
  "authentication": "oauth2",
  "mcp_servers": ["tool-access", "data-retrieval"],
  "supported_protocols": ["a2a-v1", "mcp-v1"],
  "contact": {
    "email": "team@example.com",
    "documentation": "https://docs.example.com"
  }
}
```

### A2A Server Implementation

```typescript
// src/a2a-server.ts
import express from 'express';
import { AgentCard, A2AMessage } from './types.js';

class A2AServer {
  private app: express.Application;
  private agentCard: AgentCard;

  constructor() {
    this.app = express();
    this.agentCard = this.loadAgentCard();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Agent card endpoint
    this.app.get('/.well-known/agent-card.json', (req, res) => {
      res.json(this.agentCard);
    });

    // A2A message handling
    this.app.post('/operations', async (req, res) => {
      try {
        const message: A2AMessage = req.body;
        const response = await this.handleMessage(message);
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  private async handleMessage(message: A2AMessage) {
    // Process A2A message
    return {
      id: message.id,
      type: 'response',
      payload: { result: 'Operation completed' },
      timestamp: new Date().toISOString(),
    };
  }

  start(port: number = 3000) {
    this.app.listen(port, () => {
      console.log(`A2A Server running on port ${port}`);
    });
  }
}

const server = new A2AServer();
server.start();
```

### A2A Client Implementation

```typescript
// src/a2a-client.ts
class A2AClient {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async discoverCapabilities(): Promise<AgentCard> {
    const response = await fetch(`${this.baseUrl}/.well-known/agent-card.json`);
    return response.json();
  }

  async sendMessage(message: A2AMessage): Promise<A2AMessage> {
    const response = await fetch(`${this.baseUrl}/operations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(message),
    });
    return response.json();
  }
}
```

## Integration Patterns

### Pattern 1: MCP-Enabled Package

```typescript
// packages/integrations/github/src/mcp-server.ts
export class GitHubMCPServer {
  // GitHub-specific MCP implementation
  async handleRepositoryQuery(args: { owner: string; repo: string }) {
    // Query GitHub API
    return {
      content: [{
        type: 'text',
        text: `Repository ${args.owner}/${args.repo} info`,
      }],
    };
  }
}
```

### Pattern 2: A2A-Enabled Agent Package

```typescript
// packages/agent-orchestration/src/a2a-server.ts
export class OrchestrationA2AServer {
  async handleTaskDelegation(message: A2AMessage) {
    // Delegate task to specialized agents
    return await this.coordinateAgents(message.payload);
  }
}
```

### Pattern 3: Hybrid MCP/A2A Package

```typescript
// packages/agent-tools/src/index.ts
export class AgentToolsPackage {
  private mcpServer: MCPServer;
  private a2aServer: A2AServer;

  constructor() {
    this.mcpServer = new MCPServer();
    this.a2aServer = new A2AServer();
  }

  async start() {
    await this.mcpServer.run();
    this.a2aServer.start(3001);
  }
}
```

## Security Considerations

### OAuth 2.1 Implementation

```typescript
// src/auth.ts
export class OAuth2Provider {
  async validateToken(token: string): Promise<boolean> {
    // Implement OAuth 2.1 token validation
    return true;
  }

  async generateClientCredentials(): Promise<ClientCredentials> {
    // Generate OAuth 2.1 client credentials
    return {
      clientId: this.generateId(),
      clientSecret: this.generateSecret(),
    };
  }
}
```

### Zero-Trust Architecture

1. **Never Trust, Always Verify**
   - Validate every request
   - Use mTLS for service-to-service communication
   - Implement principle of least privilege

2. **Audit Logging**
   - Log all agent interactions
   - Include correlation IDs
   - Store logs in tamper-evident storage

## Testing Strategies

### MCP Server Testing

```typescript
// __tests__/mcp-server.test.ts
describe('MCPServer', () => {
  let server: MCPServer;

  beforeEach(() => {
    server = new MCPServer();
  });

  test('should list available tools', async () => {
    const tools = await server.listTools();
    expect(tools).toContainEqual({
      name: 'package_operation',
      description: expect.any(String),
    });
  });

  test('should handle tool calls', async () => {
    const result = await server.callTool('package_operation', {
      action: 'test',
    });
    expect(result.content).toBeDefined();
  });
});
```

### A2A Protocol Testing

```typescript
// __tests__/a2a-server.test.ts
describe('A2AServer', () => {
  let server: A2AServer;

  beforeEach(() => {
    server = new A2AServer();
  });

  test('should serve agent card', async () => {
    const response = await server.getAgentCard();
    expect(response.name).toBeDefined();
    expect(response.capabilities).toBeInstanceOf(Array);
  });

  test('should handle messages', async () => {
    const message: A2AMessage = {
      id: 'test-123',
      type: 'request',
      payload: { action: 'test' },
    };
    const response = await server.handleMessage(message);
    expect(response.type).toBe('response');
  });
});
```

## Deployment Considerations

### Container Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/mcp-server.js"]
```

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-server
  template:
    metadata:
      labels:
        app: mcp-server
    spec:
      containers:
      - name: mcp-server
        image: mcp-server:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## Monitoring & Observability

### Metrics Collection

```typescript
// src/metrics.ts
export class MetricsCollector {
  private counter: Counter;

  constructor() {
    this.counter = new Counter({
      name: 'mcp_operations_total',
      help: 'Total MCP operations',
      labelNames: ['operation', 'status'],
    });
  }

  recordOperation(operation: string, status: string) {
    this.counter.inc({ operation, status });
  }
}
```

### Health Checks

```typescript
// src/health.ts
export class HealthChecker {
  async checkHealth(): Promise<HealthStatus> {
    return {
      status: 'healthy',
      checks: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        mcp: await this.checkMCP(),
      },
    };
  }
}
```

## Troubleshooting

### Common Issues

1. **MCP Server Not Starting**
   - Check configuration in `.mcp/config.json`
   - Verify Node.js version compatibility
   - Check for port conflicts

2. **A2A Communication Failures**
   - Validate OAuth tokens
   - Check network connectivity
   - Verify agent card format

3. **Performance Issues**
   - Monitor memory usage
   - Check for infinite loops
   - Implement proper timeouts

### Debug Tools

```typescript
// src/debug.ts
export class DebugTools {
  async dumpState() {
    return {
      mcpServers: this.listMCPServers(),
      a2aConnections: this.listA2AConnections(),
      activeOperations: this.listActiveOperations(),
    };
  }
}
```

## Conclusion

This integration guide provides the foundation for implementing MCP and A2A protocols in the marketing websites monorepo. Following these patterns ensures:

- **Security**: OAuth 2.1 and zero-trust architecture
- **Interoperability**: Standardized protocols for agent communication
- **Scalability**: Container-ready deployment patterns
- **Observability**: Comprehensive monitoring and logging
- **Maintainability**: Clear separation of concerns and testing strategies

For specific implementation questions, refer to the package-specific AGENTS.md files or the root AGENTS.md for overarching principles.
