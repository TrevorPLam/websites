# MCP Apps

Interactive applications for Model Context Protocol (MCP) servers with user interfaces.

## Overview

This package provides MCP applications that combine the power of MCP servers with interactive user interfaces, enabling AI agents to interact with users through dashboards, web interfaces, and real-time visualizations.

## Features

- **Interactive Dashboard**: Real-time data visualization and monitoring
- **Web UI Components**: Reusable UI components for MCP applications
- **WebSocket Support**: Real-time communication between agents and UI
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
pnpm add @repo/mcp-apps
```

## Usage

### Basic Dashboard

```typescript
import { createDashboard } from '@repo/mcp-apps';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({
  name: 'my-dashboard',
  version: '1.0.0',
});

const dashboard = createDashboard(server, {
  port: 3000,
  theme: 'dark',
  layout: 'grid',
});

await dashboard.start();
```

### Custom UI Components

```typescript
import { UIComponent, Tool } from '@repo/mcp-apps';

const customUI: UIComponent = {
  type: 'web',
  config: {
    port: 3001,
    theme: 'light',
    layout: 'sidebar',
  },
  handlers: [
    {
      event: 'data-update',
      handler: async (data) => {
        // Handle data updates
        return { success: true };
      },
    },
  ],
};
```

## API Reference

### MCPApp

Main interface for MCP applications.

```typescript
interface MCPApp {
  id: string;
  name: string;
  description: string;
  version: string;
  server: McpServer;
  ui: UIComponent;
  tools: Tool[];
  status: 'active' | 'inactive' | 'error';
}
```

### UIComponent

Interface for user interface components.

```typescript
interface UIComponent {
  type: 'web' | 'cli' | 'desktop';
  config: UIConfig;
  handlers: UIHandler[];
}
```

### Tool

Interface for MCP tools.

```typescript
interface Tool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  handler: (params: any) => Promise<any>;
}
```

## Examples

### Interactive Dashboard

```typescript
import { InteractiveDashboard } from '@repo/mcp-apps';

const dashboard = new InteractiveDashboard({
  title: 'System Monitoring',
  refreshInterval: 5000,
  theme: 'dark',
});

dashboard.addMetric('cpu-usage', {
  type: 'line',
  title: 'CPU Usage',
  unit: '%',
});

await dashboard.start();
```

### Web Interface

```typescript
import { createWebInterface } from '@repo/mcp-apps';

const webUI = createWebInterface({
  port: 3000,
  routes: {
    '/': 'dashboard.html',
    '/settings': 'settings.html',
  },
});

await webUI.start();
```

## Development

### Setup

```bash
pnpm install
pnpm dev
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_APP_PORT` | Port for web interface | `3000` |
| `MCP_APP_THEME` | UI theme | `light` |
| `MCP_APP_LOG_LEVEL` | Logging level | `info` |

### Configuration File

```json
{
  "app": {
    "port": 3000,
    "theme": "dark",
    "layout": "grid"
  },
  "dashboard": {
    "refreshInterval": 5000,
    "maxDataPoints": 100
  }
}
```

## Architecture

### Components

1. **Core**: MCP server integration and basic app structure
2. **UI**: Web interface components and real-time updates
3. **Tools**: MCP tools with UI integration
4. **Dashboard**: Interactive dashboard components

### Data Flow

```
AI Agent → MCP Server → UI Component → User Interface
                ↑                              ↓
                ←──── User Interaction ←──────
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related Packages

- `@repo/mcp-servers` - Core MCP server implementations
- `@repo/infrastructure` - Shared utilities and infrastructure
- `@repo/ui` - UI components and design system
