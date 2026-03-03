#!/usr/bin/env node
/**
 * @file mcp/servers/src/content-management.ts
 * @summary MCP server: content-management.
 * @description Content-as-code workflow using filesystem and Git operations.
 *   Enables AI agents to read, write, and publish website content via local files and Git commits.
 * @security Paths are validated to stay within CONTENT_ROOT; no symlink traversal.
 * @requirements TODO.md 4-B, MCP-standards
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const CONTENT_ROOT = process.env.CONTENT_ROOT ?? path.resolve(process.cwd(), 'content');

/** Resolve and validate that the target path stays within CONTENT_ROOT, rejecting symlinks. */
async function safePath(relativePath: string): Promise<string> {
  const resolved = path.resolve(CONTENT_ROOT, relativePath);
  if (!resolved.startsWith(CONTENT_ROOT + path.sep) && resolved !== CONTENT_ROOT) {
    throw new Error(`Path traversal detected: '${relativePath}'`);
  }
  // Resolve symlinks and re-validate to prevent symlink-escape attacks
  try {
    const real = await fs.realpath(resolved);
    if (!real.startsWith(CONTENT_ROOT + path.sep) && real !== CONTENT_ROOT) {
      throw new Error(`Symlink escape detected: '${relativePath}' resolves outside CONTENT_ROOT`);
    }
  } catch (err) {
    // realpath fails if the path does not yet exist (e.g. for create operations) – that is fine.
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
  return resolved;
}

export class ContentManagementServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'content-management',
      version: '1.0.0',
    });
    this.registerTools();
  }

  private registerTools(): void {
    // ── list_content ─────────────────────────────────────────────────────────
    this.server.tool(
      'list_content',
      'List content files in the repository content directory (or a subdirectory).',
      {
        directory: z
          .string()
          .optional()
          .default('')
          .describe('Relative path inside CONTENT_ROOT (empty = root)'),
        pattern: z.string().optional().describe('Glob-style extension filter, e.g. "*.md"'),
      },
      async ({ directory, pattern }) => {
        const dir = await safePath(directory ?? '');
        let entries: string[];
        try {
          const files = await fs.readdir(dir, { withFileTypes: true });
          entries = files
            .filter((f) => !f.isDirectory())
            .map((f) => f.name)
            .filter((name) => !pattern || name.endsWith(pattern.replaceAll('*', '')));
        } catch {
          return { content: [{ type: 'text', text: `Directory not found: ${directory}` }] };
        }
        return { content: [{ type: 'text', text: entries.join('\n') }] };
      }
    );

    // ── get_content ───────────────────────────────────────────────────────────
    this.server.tool(
      'get_content',
      'Read the full text of a content file.',
      {
        filePath: z.string().describe('Relative path to the content file within CONTENT_ROOT'),
      },
      async ({ filePath }) => {
        const absPath = await safePath(filePath);
        let text: string;
        try {
          text = await fs.readFile(absPath, 'utf-8');
        } catch {
          return { content: [{ type: 'text', text: `File not found: ${filePath}` }] };
        }
        return { content: [{ type: 'text', text }] };
      }
    );

    // ── create_content ────────────────────────────────────────────────────────
    this.server.tool(
      'create_content',
      'Create a new content file. Fails if the file already exists.',
      {
        filePath: z.string().describe('Relative path within CONTENT_ROOT'),
        content: z.string().describe('File content (markdown, JSON, etc.)'),
      },
      async ({ filePath, content }) => {
        const absPath = await safePath(filePath);
        // Fail-safe: do not overwrite
        try {
          await fs.access(absPath);
          return { content: [{ type: 'text', text: `File already exists: ${filePath}. Use update_content to modify.` }] };
        } catch {
          // expected – file does not exist, proceed
        }
        await fs.mkdir(path.dirname(absPath), { recursive: true });
        await fs.writeFile(absPath, content, 'utf-8');
        return { content: [{ type: 'text', text: `Created: ${filePath}` }] };
      }
    );

    // ── update_content ────────────────────────────────────────────────────────
    this.server.tool(
      'update_content',
      'Overwrite an existing content file with new content.',
      {
        filePath: z.string().describe('Relative path within CONTENT_ROOT'),
        content: z.string().describe('New file content'),
      },
      async ({ filePath, content }) => {
        const absPath = await safePath(filePath);
        await fs.mkdir(path.dirname(absPath), { recursive: true });
        await fs.writeFile(absPath, content, 'utf-8');
        return { content: [{ type: 'text', text: `Updated: ${filePath}` }] };
      }
    );

    // ── publish_content ───────────────────────────────────────────────────────
    this.server.tool(
      'publish_content',
      'Stage, commit and push one or more content files to the current Git branch.',
      {
        files: z
          .array(z.string())
          .describe('Relative paths within CONTENT_ROOT to include in the commit'),
        commitMessage: z.string().describe('Git commit message'),
        authorName: z.string().optional().default('Content Bot').describe('Git author name'),
        authorEmail: z
          .string()
          .email()
          .optional()
          .default('content-bot@marketing-platform.example')
          .describe('Git author email'),
      },
      async ({ files, commitMessage, authorName, authorEmail }) => {
        const cwd = process.cwd();
        const absPaths = await Promise.all(files.map((f) => safePath(f)));

        // Stage files
        try {
          await execFileAsync('git', ['add', ...absPaths], { cwd });
        } catch (err) {
          throw new Error(`Failed to stage files for commit: ${(err as Error).message}`);
        }

        // Create commit
        try {
          await execFileAsync(
            'git',
            [
              '-c', `user.name=${authorName}`,
              '-c', `user.email=${authorEmail}`,
              'commit', '-m', commitMessage,
            ],
            { cwd }
          );
        } catch (err) {
          throw new Error(`Failed to create commit: ${(err as Error).message}`);
        }

        // Push (best-effort)
        let pushMsg = '';
        try {
          const { stdout } = await execFileAsync('git', ['push'], { cwd });
          pushMsg = stdout.trim() || 'Pushed successfully.';
        } catch (err) {
          pushMsg = `Push failed (may need manual push): ${(err as Error).message}`;
        }

        return { content: [{ type: 'text', text: `Committed '${commitMessage}'. ${pushMsg}` }] };
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Content Management MCP Server running on stdio');
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const srv = new ContentManagementServer();

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));

  srv.run().catch(console.error);
}
