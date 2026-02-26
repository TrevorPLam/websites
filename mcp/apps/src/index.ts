/**
 * @file packages/mcp-apps/src/index.ts
 * @summary MCP (Model Context Protocol) server applications for AI agents.
 * @description Provides WebSocket and stdio transport servers for AI agent communication.
 * @security Handles network connections and data serialization
 * @requirements none
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocketServer } from 'ws';
import express from 'express';
import { z } from 'zod';
import type { MCPApp, UIComponent, Tool } from './types.js';

// Interactive MCP App Base Class
/**
 * Base class for interactive MCP applications with WebSocket and HTTP interfaces.
 *
 * Provides common functionality for MCP apps that need web UI components,
 * real-time communication, and tool management.
 */
export class InteractiveMCPApp {
  public readonly app: MCPApp;
  protected server: McpServer;
  protected uiServer: express.Application;
  protected wsServer: WebSocketServer;
  protected connections: Set<any> = new Set();

  constructor(config: Omit<MCPApp, 'server' | 'status'>) {
    this.server = new McpServer({
      name: config.name,
      version: config.version,
    });

    this.app = {
      ...config,
      server: this.server,
      status: 'inactive'
    };

    this.uiServer = express();
    this.setupUI();
    this.setupWebSocket();
    this.setupTools();
  }

  private setupUI(): void {
    this.uiServer.use(express.json());
    this.uiServer.use(express.static('public'));

    // API routes
    this.uiServer.get('/api/status', (req, res) => {
      res.json({
        status: this.app.status,
        name: this.app.name,
        version: this.app.version,
        tools: this.app.tools.map(t => ({ name: t.name, description: t.description }))
      });
    });

    this.uiServer.post('/api/tools/:name', async (req, res) => {
      try {
        const tool = this.app.tools.find(t => t.name === req.params.name);
        if (!tool) {
          return res.status(404).json({ error: 'Tool not found' });
        }

        const result = await tool.handler(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Serve HTML interface
    this.uiServer.get('/', (req, res) => {
      res.send(this.generateHTML());
    });
  }

  private setupWebSocket(): void {
    this.wsServer = new WebSocketServer({ port: 8081 });

    this.wsServer.on('connection', (ws) => {
      this.connections.add(ws);

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleWebSocketMessage(ws, message);
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      });

      ws.on('close', () => {
        this.connections.delete(ws);
      });

      ws.send(JSON.stringify({
        type: 'connected',
        app: this.app.name,
        tools: this.app.tools.map(t => ({ name: t.name, description: t.description }))
      }));
    });
  }

  private setupTools(): void {
    this.app.tools.forEach(tool => {
      this.server.tool(
        tool.name,
        tool.description,
        tool.schema,
        async (params) => {
          try {
            const result = await tool.handler(params);

            // Broadcast to all WebSocket connections
            this.broadcast({
              type: 'tool_executed',
              tool: tool.name,
              params,
              result,
              timestamp: new Date().toISOString()
            });

            return result;
          } catch (error) {
            return {
              content: [{
                type: 'text',
                text: `Error executing ${tool.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
              }],
              isError: true,
            };
          }
        }
      );
    });
  }

  protected async handleWebSocketMessage(ws: any, message: any): Promise<void> {
    const handler = this.app.ui.handlers.find(h => h.event === message.type);
    if (handler) {
      const result = await handler.handler(message.data);
      ws.send(JSON.stringify({
        type: 'response',
        originalType: message.type,
        result,
        timestamp: new Date().toISOString()
      }));
    }
  }

  private broadcast(message: any): void {
    this.connections.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  private generateHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.app.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .tools { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .tool { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .tool h3 { margin-top: 0; color: #333; }
        .tool-form { display: flex; flex-direction: column; gap: 10px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group label { font-weight: bold; color: #555; }
        .form-group input, .form-group textarea, .form-group select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
        .result { margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #007bff; }
        .status { padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .status.active { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.inactive { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .logs { margin-top: 20px; max-height: 300px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${this.app.name}</h1>
            <p>${this.app.description}</p>
            <div id="status" class="status inactive">Connecting...</div>
        </div>

        <div class="tools" id="tools">
            <!-- Tools will be dynamically added here -->
        </div>

        <div class="logs" id="logs">
            <div>WebSocket connecting...</div>
        </div>
    </div>

    <script>
        class MCPAppClient {
            constructor() {
                this.ws = new WebSocket('ws://localhost:8081');
                this.setupWebSocket();
                this.loadTools();
            }

            setupWebSocket() {
                this.ws.onopen = () => {
                    this.updateStatus('Connected', 'active');
                    this.addLog('WebSocket connected');
                };

                this.ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                };

                this.ws.onclose = () => {
                    this.updateStatus('Disconnected', 'inactive');
                    this.addLog('WebSocket disconnected');
                };
            }

            handleMessage(message) {
                switch (message.type) {
                    case 'connected':
                        this.addLog(\`Connected to \${message.app}\`);
                        this.displayTools(message.tools);
                        break;
                    case 'tool_executed':
                        this.addLog(\`Tool executed: \${message.tool}\`);
                        this.displayResult(message.tool, message.result);
                        break;
                    case 'error':
                        this.addLog(\`Error: \${message.message}\`);
                        break;
                }
            }

            async loadTools() {
                try {
                    const response = await fetch('/api/status');
                    const status = await response.json();
                    this.displayTools(status.tools);
                } catch (error) {
                    this.addLog(\`Error loading tools: \${error.message}\`);
                }
            }

            displayTools(tools) {
                const container = document.getElementById('tools');
                container.innerHTML = '';

                tools.forEach(tool => {
                    const toolDiv = document.createElement('div');
                    toolDiv.className = 'tool';
                    toolDiv.innerHTML = \`
                        <h3>\${tool.name}</h3>
                        <p>\${tool.description}</p>
                        <div class="tool-form">
                            <div class="form-group">
                                <label>Parameters (JSON):</label>
                                <textarea id="params-\${tool.name}" rows="3" placeholder='{"key": "value"}'></textarea>
                            </div>
                            <button class="btn" onclick="appClient.executeTool('\${tool.name}')">
                                Execute
                            </button>
                        </div>
                        <div id="result-\${tool.name}" class="result" style="display: none;"></div>
                    \`;
                    container.appendChild(toolDiv);
                });
            }

            async executeTool(toolName) {
                const paramsInput = document.getElementById(\`params-\${toolName}\`);
                const resultDiv = document.getElementById(\`result-\${toolName}\`);

                try {
                    const params = paramsInput.value ? JSON.parse(paramsInput.value) : {};

                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'Executing...';

                    const response = await fetch(\`/api/tools/\${toolName}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(params)
                    });

                    const result = await response.json();
                    this.displayResult(toolName, result);
                } catch (error) {
                    resultDiv.innerHTML = \`<strong>Error:</strong> \${error.message}\`;
                }
            }

            displayResult(toolName, result) {
                const resultDiv = document.getElementById(\`result-\${toolName}\`);
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = \`
                    <h4>Result:</h4>
                    <pre>\${JSON.stringify(result, null, 2)}</pre>
                \`;
            }

            updateStatus(text, className) {
                const statusDiv = document.getElementById('status');
                statusDiv.textContent = text;
                statusDiv.className = \`status \${className}\`;
            }

            addLog(message) {
                const logsDiv = document.getElementById('logs');
                const logEntry = document.createElement('div');
                logEntry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
                logsDiv.appendChild(logEntry);
                logsDiv.scrollTop = logsDiv.scrollHeight;
            }
        }

        const appClient = new MCPAppClient();
    </script>
</body>
</html>`;
  }

  async start(): Promise<void> {
    // Start MCP server
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Start UI server
    this.uiServer.listen(8080, () => {
      console.log(`UI server running on http://localhost:8080`);
    });

    this.app.status = 'active';
    console.log(`${this.app.name} started successfully`);
  }

  async stop(): Promise<void> {
    this.app.status = 'inactive';
    this.connections.forEach(ws => ws.close());
    this.wsServer.close();
  }
}

// Specific MCP App Implementations

// GitHub MCP App
/**
 * MCP application for GitHub repository management and code analysis.
 *
 * Provides tools for repository operations, code analysis, and GitHub API integration.
 */
export class GitHubMCPApp extends InteractiveMCPApp {
  constructor() {
    super({
      id: 'github-app',
      name: 'GitHub Assistant',
      description: 'Interactive GitHub repository management',
      version: '1.0.0',
      ui: {
        type: 'web',
        config: { port: 8080, theme: 'github', layout: 'tabs' },
        handlers: []
      },
      tools: [
        {
          name: 'list-repositories',
          description: 'List repositories for a user or organization',
          schema: z.object({
            owner: z.string().describe('User or organization name'),
            type: z.enum(['user', 'org']).default('user'),
            limit: z.number().default(10)
          }),
          handler: async ({ owner, type, limit }) => {
            const response = await fetch(\`https://api.github.com/\${type}s/\${owner}/repos?per_page=\${limit}\`, {
              headers: {
                'Authorization': \`token \${process.env.GITHUB_TOKEN || ''}\`,
                'Accept': 'application/vnd.github.v3+json',
              },
            });

            if (!response.ok) {
              throw new Error(\`GitHub API error: \${response.statusText}\`);
            }

            const repos = await response.json();
            return {
              content: [{
                type: 'text',
                text: \`Found \${repos.length} repositories:\\n\\n\${repos.map((repo: any) =>
                  \`- \${repo.name}: \${repo.description || 'No description'} (\${repo.stargazers_count} stars)\`
                ).join('\\n')}\`,
              }],
            };
          }
        },
        {
          name: 'create-issue',
          description: 'Create a new issue in a repository',
          schema: z.object({
            owner: z.string(),
            repo: z.string(),
            title: z.string(),
            body: z.string(),
            labels: z.array(z.string()).optional()
          }),
          handler: async ({ owner, repo, title, body, labels }) => {
            const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/issues\`, {
              method: 'POST',
              headers: {
                'Authorization': \`token \${process.env.GITHUB_TOKEN || ''}\`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title, body, labels: labels || [] }),
            });

            if (!response.ok) {
              throw new Error(\`GitHub API error: \${response.statusText}\`);
            }

            const issue = await response.json();
            return {
              content: [{
                type: 'text',
                text: \`Issue created: #\${issue.number} - \${issue.html_url}\`,
              }],
            };
          }
        }
      ]
    });
  }
}

// File System MCP App
/**
 * MCP application for file system operations and directory management.
 *
 * Provides tools for reading, writing, and managing files and directories.
 */
export class FileSystemMCPApp extends InteractiveMCPApp {
  constructor() {
    super({
      id: 'filesystem-app',
      name: 'File System Explorer',
      description: 'Interactive file system management',
      version: '1.0.0',
      ui: {
        type: 'web',
        config: { port: 8080, theme: 'filesystem', layout: 'sidebar' },
        handlers: []
      },
      tools: [
        {
          name: 'read-file',
          description: 'Read contents of a file',
          schema: z.object({
            path: z.string(),
            encoding: z.enum(['utf8', 'base64']).default('utf8')
          }),
          handler: async ({ path, encoding }) => {
            const fs = await import('fs/promises');
            const content = await fs.readFile(path, encoding as BufferEncoding);

            return {
              content: [{
                type: 'text',
                text: content.toString(),
              }],
            };
          }
        },
        {
          name: 'list-directory',
          description: 'List contents of a directory',
          schema: z.object({
            path: z.string(),
            recursive: z.boolean().default(false)
          }),
          handler: async ({ path, recursive }) => {
            const fs = await import('fs/promises');
            const pathModule = await import('path');

            const listDir = async (dirPath: string, prefix = ''): Promise<string[]> => {
              const entries = await fs.readdir(dirPath, { withFileTypes: true });
              const items: string[] = [];

              for (const entry of entries) {
                const fullPath = pathModule.join(dirPath, entry.name);
                const relativePath = prefix ? pathModule.join(prefix, entry.name) : entry.name;

                if (entry.isDirectory() && recursive) {
                  items.push(\`\${relativePath}/\`);
                  items.push(...await listDir(fullPath, relativePath));
                } else {
                  items.push(relativePath);
                }
              }

              return items;
            };

            const items = await listDir(path);

            return {
              content: [{
                type: 'text',
                text: \`Contents of \${path}:\\n\\n\${items.join('\\n')}\`,
              }],
            };
          }
        }
      ]
    });
  }
}

// Database MCP App
/**
 * MCP application for database operations and data management.
 *
 * Provides tools for database queries, data manipulation, and schema management.
 */
export class DatabaseMCPApp extends InteractiveMCPApp {
  constructor() {
    super({
      id: 'database-app',
      name: 'Database Query Tool',
      description: 'Interactive database query interface',
      version: '1.0.0',
      ui: {
        type: 'web',
        config: { port: 8080, theme: 'database', layout: 'grid' },
        handlers: []
      },
      tools: [
        {
          name: 'execute-query',
          description: 'Execute SQL query',
          schema: z.object({
            query: z.string(),
            database: z.string().optional()
          }),
          handler: async ({ query, database }) => {
            const { Pool } = await import('postgres');
            const pool = new Pool({
              connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/test',
            });

            const result = await pool.query(query);
            await pool.end();

            const formatted = result.rows.map(row =>
              Object.entries(row).map(([key, value]) => \`\${key}: \${value}\`).join(', ')
            ).join('\\n');

            return {
              content: [{
                type: 'text',
                text: \`Query executed:\\n\\n\${formatted}\`,
              }],
            };
          }
        }
      ]
    });
  }
}

// MCP App Manager
/**
 * Manager class for coordinating multiple MCP applications.
 *
 * Handles registration, lifecycle management, and communication between apps.
 */
export class MCPAppManager {
  private apps: Map<string, InteractiveMCPApp> = new Map();

  async registerApp(app: InteractiveMCPApp): Promise<void> {
    this.apps.set(app['app'].id, app);
  }

  async startApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    if (!app) {
      throw new Error(\`App \${appId} not found\`);
    }
    await app.start();
  }

  async stopApp(appId: string): Promise<void> {
    const app = this.apps.get(appId);
    if (!app) {
      throw new Error(\`App \${appId} not found\`);
    }
    await app.stop();
  }

  async startAll(): Promise<void> {
    for (const app of this.apps.values()) {
      await app.start();
    }
  }

  async stopAll(): Promise<void> {
    for (const app of this.apps.values()) {
      await app.stop();
    }
  }

  getApps(): InteractiveMCPApp[] {
    return Array.from(this.apps.values());
  }

  getAppStatus(): Record<string, string> {
    const status: Record<string, string> = {};
    this.apps.forEach((app, id) => {
      status[id] = app['app'].status;
    });
    return status;
  }
}

// Export classes
export { InteractiveMCPApp, GitHubMCPApp, FileSystemMCPApp, DatabaseMCPApp, MCPAppManager };
