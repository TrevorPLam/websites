#!/usr/bin/env node

/**
 * @file mcp/servers/src/github-server.ts
 * @summary MCP server for GitHub repository operations and management.
 * @description Provides tools for listing repositories, getting repo details, creating issues, and other GitHub API operations.
 * @security Requires GITHUB_TOKEN environment variable for authentication.
 * @requirements MCP-001, MCP-002
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

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
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
          }

          const response = await fetch(`https://api.github.com/${type}s/${owner}/repos?per_page=${limit}`, {
            headers: {
              'Authorization': `token ${token}`,
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
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
          }

          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              'Authorization': `token ${token}`,
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
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
          }

          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            method: 'POST',
            headers: {
              'Authorization': `token ${token}`,
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

    // Search repositories
    this.server.tool(
      'search-repos',
      'Search repositories with specific criteria',
      {
        query: z.string().describe('Search query'),
        sort: z.enum(['stars', 'forks', 'updated']).optional().describe('Sort field'),
        order: z.enum(['desc', 'asc']).optional().describe('Sort order'),
        limit: z.number().optional().describe('Maximum results').default(10),
      },
      async ({ query, sort = 'stars', order = 'desc', limit = 10 }) => {
        try {
          const token = process.env.GITHUB_TOKEN;
          if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
          }

          const response = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&per_page=${limit}`,
            {
              headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }

          const searchResult = await response.json();

          return {
            content: [{
              type: 'text',
              text: `Found ${searchResult.total_count} repositories (showing ${searchResult.items.length}):\n\n${searchResult.items.map((repo: any) =>
                `- ${repo.full_name}: ${repo.description || 'No description'} (${repo.stargazers_count} stars, ${repo.forks_count} forks)\n  URL: ${repo.html_url}`
              ).join('\n\n')}`,
            }],
          };
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error searching repositories: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

// Run server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new GitHubMCPServer();
  server.run().catch(console.error);
}
