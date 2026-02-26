#!/usr/bin/env node

/**
 * @file packages/mcp-servers/src/github-server.ts
 * @summary GitHub MCP Server for repository operations
 * @description Provides tools for GitHub repository management and operations
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

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
            return {
              content: [{ type: 'text', text: `GitHub API error: ${response.statusText}` }],
            };
          }

          const repos = await response.json();
          
          return {
            content: [{
              type: 'text',
              text: `Found ${repos.length} repositories for ${owner}:\n\n${repos.map((repo: any) => `- ${repo.name}: ${repo.description || 'No description'}`).join('\n')}`,
            }],
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error fetching repositories: ${error}` }],
          };
        }
      },
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
            return {
              content: [{ type: 'text', text: `GitHub API error: ${response.statusText}` }],
            };
          }

          const repoData = await response.json();
          
          return {
            content: [{
              type: 'text',
              text: `Repository: ${repoData.full_name}\nDescription: ${repoData.description || 'No description'}\nStars: ${repoData.stargazers_count}\nLanguage: ${repoData.language || 'Unknown'}\nCreated: ${repoData.created_at}\nUpdated: ${repoData.updated_at}`,
            }],
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error fetching repository details: ${error}` }],
          };
        }
      },
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new GitHubMCPServer();
  server.run().catch(console.error);
}
