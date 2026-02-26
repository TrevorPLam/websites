#!/usr/bin/env node

/**
 * @file mcp/servers/src/github-server.ts
 * @summary MCP server for GitHub repository operations and management.
 * @description Provides tools for listing repositories, getting repo details, creating issues, and other GitHub API operations.
 * @security Requires GITHUB_TOKEN environment variable for authentication.
 * @requirements MCP-001, MCP-002
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Validate GITHUB_TOKEN on startup
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error('[github-server] FATAL: GITHUB_TOKEN env var not set');
  process.exit(1);
}

const server = new McpServer({
  name: 'github-server',
  version: '1.0.0',
});
// List repositories tool
server.tool(
  'list-repos',
  'List GitHub repositories for authenticated user or organization',
  {
    org: z.string().optional().describe('Organization name (optional)'),
    per_page: z.number().min(1).max(100).default(30).describe('Number of repos per page'),
  },
  async ({ org, per_page }) => {
    try {
      const url = org
        ? `https://api.github.com/orgs/${org}/repos?per_page=${per_page}`
        : `https://api.github.com/user/repos?per_page=${per_page}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const repos = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(repos) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Get repository tool
server.tool(
  'get-repo',
  'Get detailed information about a specific repository',
  {
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
  },
  async ({ owner, repo }) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const repoData = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(repoData) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Create issue tool
server.tool(
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
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          labels: labels || [],
        }),
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const issue = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(issue) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// List issues tool
server.tool(
  'list-issues',
  'List issues in a repository',
  {
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
    state: z.enum(['open', 'closed', 'all']).default('open').describe('Issue state'),
    per_page: z.number().min(1).max(100).default(30).describe('Number of issues per page'),
  },
  async ({ owner, repo, state, per_page }) => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=${per_page}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const issues = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(issues) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Create pull request tool
server.tool(
  'create-pr',
  'Create a new pull request',
  {
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
    title: z.string().describe('Pull request title'),
    body: z.string().describe('Pull request body/description'),
    head: z.string().describe('Head branch name'),
    base: z.string().describe('Base branch name'),
  },
  async ({ owner, repo, title, body, head, base }) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          head,
          base,
        }),
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const pr = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(pr) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Get file contents tool
server.tool(
  'get-file-contents',
  'Get contents of a file from a repository',
  {
    owner: z.string().describe('Repository owner'),
    repo: z.string().describe('Repository name'),
    path: z.string().describe('File path in repository'),
    ref: z.string().optional().describe('Git reference (branch, tag, or commit)'),
  },
  async ({ owner, repo, path, ref }) => {
    try {
      const url = ref
        ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`
        : `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const fileData = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(fileData) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Search code tool
server.tool(
  'search-code',
  'Search for code across repositories',
  {
    q: z.string().describe('Search query'),
    sort: z.enum(['indexed', 'updated']).optional().describe('Sort field'),
    order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
    per_page: z.number().min(1).max(100).default(30).describe('Number of results per page'),
  },
  async ({ q, sort, order, per_page }) => {
    try {
      const params = new URLSearchParams({
        q,
        per_page: per_page.toString(),
      });

      if (sort) params.append('sort', sort);
      if (order) params.append('order', order);

      const res = await fetch(`https://api.github.com/search/code?${params}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const searchResult = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(searchResult) }] };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ESM CLI guard
if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
