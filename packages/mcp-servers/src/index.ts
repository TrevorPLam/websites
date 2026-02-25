#!/usr/bin/env node

/**
 * @file packages/mcp-servers/src/index.ts
 * @summary Defines MCP (Model Context Protocol) servers for GitHub, filesystem, and database operations.
 * @description Provides server classes for AI agents to interact with external systems via standardized protocols.
 * @security Database queries require proper connection strings and authentication.
 * @adr none
 * @requirements MCP-001, MCP-002
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// GitHub MCP Server
/**
 * MCP server for GitHub repository operations and management.
 *
 * Provides tools for listing repositories, getting repo details,
 * creating issues, and other GitHub API operations.
 */
export class GitHubMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'github-server',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools() {
    // List repositories
    this.server.tool(
      'list-repos',
      'List repositories for a user or organization',
      {
        owner: z.string().describe('User or organization name'),
        type: z.enum(['user', 'org']).describe('Type of owner').default('user'),
        limit: z.number().describe('Maximum number of repos to return').default(10),
      },
      async ({ owner, type, limit }) => {
        try {
          const response = await fetch(`https://api.github.com/${type}s/${owner}/repos?per_page=${limit}`, {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }

          const repos = await response.json();

          return {
            content: [{
              type: 'text',
              text: `Found ${repos.length} repositories:\n\n${repos.map((repo: any) =>
                `- ${repo.name}: ${repo.description || 'No description'} (${repo.stargazers_count} stars, ${repo.forks_count} forks)`
              ).join('\n')}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error listing repositories: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Get repository details
    this.server.tool(
      'get-repo-details',
      'Get detailed information about a specific repository',
      {
        owner: z.string().describe('Repository owner'),
        repo: z.string().describe('Repository name'),
      },
      async ({ owner, repo }) => {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }

          const repoData = await response.json();

          return {
            content: [{
              type: 'text',
              text: `Repository: ${repoData.full_name}\n\n` +
                `Description: ${repoData.description || 'No description'}\n` +
                `Language: ${repoData.language || 'Unknown'}\n` +
                `Stars: ${repoData.stargazers_count}\n` +
                `Forks: ${repoData.forks_count}\n` +
                `Open Issues: ${repoData.open_issues_count}\n` +
                `Created: ${new Date(repoData.created_at).toLocaleDateString()}\n` +
                `Updated: ${new Date(repoData.updated_at).toLocaleDateString()}\n` +
                `Clone URL: ${repoData.clone_url}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error getting repository details: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Create issue
    this.server.tool(
      'create-issue',
      'Create a new issue in a repository',
      {
        owner: z.string().describe('Repository owner'),
        repo: z.string().describe('Repository name'),
        title: z.string().describe('Issue title'),
        body: z.string().describe('Issue body/description'),
        labels: z.array(z.string()).optional().describe('Labels to apply to the issue'),
      },
      async ({ owner, repo, title, body, labels }) => {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            method: 'POST',
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              body,
              labels: labels || [],
            }),
          });

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }

          const issue = await response.json();

          return {
            content: [{
              type: 'text',
              text: `Issue created successfully!\n\n` +
                `Title: ${issue.title}\n` +
                `Number: #${issue.number}\n` +
                `URL: ${issue.html_url}\n` +
                `Labels: ${issue.labels.map((l: any) => l.name).join(', ') || 'None'}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error creating issue: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

// File System MCP Server
/**
 * MCP server for file system operations and management.
 *
 * Provides tools for reading files, writing content, and listing
 * directory contents with proper error handling.
 */
export class FileSystemMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'filesystem-server',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools() {
    // Read file
    this.server.tool(
      'read-file',
      'Read contents of a file',
      {
        path: z.string().describe('File path to read'),
        encoding: z.enum(['utf8', 'base64']).default('utf8').describe('File encoding'),
      },
      async ({ path, encoding }) => {
        try {
          const fs = await import('fs/promises');
          const content = await fs.readFile(path, encoding as BufferEncoding);

          return {
            content: [{
              type: 'text',
              text: content.toString(),
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Write file
    this.server.tool(
      'write-file',
      'Write content to a file',
      {
        path: z.string().describe('File path to write'),
        content: z.string().describe('Content to write'),
        encoding: z.enum(['utf8', 'base64']).default('utf8').describe('File encoding'),
      },
      async ({ path, content, encoding }) => {
        try {
          const fs = await import('fs/promises');
          await fs.writeFile(path, content, encoding as BufferEncoding);

          return {
            content: [{
              type: 'text',
              text: `Successfully wrote to ${path}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error writing file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );

    // List directory
    this.server.tool(
      'list-directory',
      'List contents of a directory',
      {
        path: z.string().describe('Directory path to list'),
        recursive: z.boolean().default(false).describe('List recursively'),
      },
      async ({ path, recursive }) => {
        try {
          const fs = await import('fs/promises');
          const pathModule = await import('path');

          const listDir = async (dirPath: string, prefix = ''): Promise<string[]> => {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            const items: string[] = [];

            for (const entry of entries) {
              const fullPath = pathModule.join(dirPath, entry.name);
              const relativePath = prefix ? pathModule.join(prefix, entry.name) : entry.name;

              if (entry.isDirectory() && recursive) {
                items.push(`${relativePath}/`);
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
              text: `Contents of ${path}:\n\n${items.join('\n')}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error listing directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('File System MCP Server running on stdio');
  }
}

// Database MCP Server
/**
 * MCP server for database query operations and schema inspection.
 *
 * Provides tools for executing SQL queries and retrieving table
 * schema information with proper connection management.
 */
export class DatabaseMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'database-server',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools() {
    // Execute query
    this.server.tool(
      'execute-query',
      'Execute SQL query on database',
      {
        query: z.string().describe('SQL query to execute'),
        database: z.string().optional().describe('Database name (optional)'),
      },
      async ({ query, database }) => {
        try {
          const { Pool } = await import('postgres');
          const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
          });

          const result = await pool.query(query);
          await pool.end();

          const formatted = result.rows.map(row =>
            Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
          ).join('\n');

          return {
            content: [{
              type: 'text',
              text: `Query executed successfully!\n\nRows returned: ${result.rows.length}\n\n${formatted}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error executing query: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );

    // Get table schema
    this.server.tool(
      'get-table-schema',
      'Get schema information for a table',
      {
        table: z.string().describe('Table name'),
        database: z.string().optional().describe('Database name (optional)'),
      },
      async ({ table, database }) => {
        try {
          const { Pool } = await import('postgres');
          const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
          });

          const query = `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position
          `;

          const result = await pool.query(query, [table]);
          await pool.end();

          const schema = result.rows.map(row =>
            `${row.column_name}: ${row.data_type}${row.is_nullable === 'YES' ? ' (nullable)' : ''}${row.column_default ? ` (default: ${row.column_default})` : ''}`
          ).join('\n');

          return {
            content: [{
              type: 'text',
              text: `Schema for table '${table}':\n\n${schema}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error getting table schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }],
            isError: true,
          };
        }
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Database MCP Server running on stdio');
  }
}

// Main entry point
async function main() {
  const serverType = process.argv[2];

  switch (serverType) {
    case 'github':
      const githubServer = new GitHubMCPServer();
      await githubServer.run();
      break;
    case 'filesystem':
      const fsServer = new FileSystemMCPServer();
      await fsServer.run();
      break;
    case 'database':
      const dbServer = new DatabaseMCPServer();
      await dbServer.run();
      break;
    default:
      console.error('Usage: npm start [github|filesystem|database]');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
