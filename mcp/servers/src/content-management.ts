#!/usr/bin/env node
/**
 * @file mcp/servers/src/content-management.ts
 * @summary MCP server: content-management.
 * @description Content-as-code workflow using filesystem and Git operations.
 *   Enables AI agents to read, write, and publish website content via local files and Git commits.
 * @security Paths are validated to stay within CONTENT_ROOT; no symlink traversal.
 *   Write and publish operations require a valid tenant UUID (5-A hardening).
 *   Rate limited to 30 writes per minute per tenant to prevent abuse.
 * @requirements TODO.md 4-B, MCP-standards, 5-A
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { assertTenantId, createRateLimiter, logMcpTool, rateLimitExceededResponse, resolveCorrelationId } from './shared/middleware.js';

const execFileAsync = promisify(execFile);

const CONTENT_ROOT = process.env.CONTENT_ROOT ?? path.resolve(process.cwd(), 'content');

/** Per-tenant rate limiter: 30 write/publish operations per minute. */
const contentWriteRateLimiter = createRateLimiter({ maxCalls: 30, windowMs: 60_000 });

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
        _correlationId: z.string().optional().describe('Correlation ID for request chaining'),
      },
      async ({ directory, pattern, _correlationId, ...rest }) => {
        const cid = resolveCorrelationId({ _correlationId, ...rest });
        const t0 = Date.now();
        logMcpTool('tool_call_start', 'list_content', cid);
        try {
          const dir = await safePath(directory ?? '');
          let entries: string[];
          try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            entries = files
              .filter((f) => !f.isDirectory())
              .map((f) => f.name)
              .filter((name) => !pattern || name.endsWith(pattern.replaceAll('*', '')));
          } catch {
            logMcpTool('tool_call_end', 'list_content', cid, { durationMs: Date.now() - t0 });
            return { content: [{ type: 'text', text: `Directory not found: ${directory}` }], _correlationId: cid };
          }
          logMcpTool('tool_call_end', 'list_content', cid, { durationMs: Date.now() - t0 });
          return { content: [{ type: 'text', text: entries.join('\n') }], _correlationId: cid };
        } catch (err) {
          logMcpTool('tool_call_end', 'list_content', cid, { durationMs: Date.now() - t0, isError: true, error: err instanceof Error ? err.message : String(err) });
          throw err;
        }
      }
    );

    // ── get_content ───────────────────────────────────────────────────────────
    this.server.tool(
      'get_content',
      'Read the full text of a content file.',
      {
        filePath: z.string().describe('Relative path to the content file within CONTENT_ROOT'),
        _correlationId: z.string().optional().describe('Correlation ID for request chaining'),
      },
      async ({ filePath, _correlationId, ...rest }) => {
        const cid = resolveCorrelationId({ _correlationId, ...rest });
        const t0 = Date.now();
        logMcpTool('tool_call_start', 'get_content', cid);
        try {
          const absPath = await safePath(filePath);
          let text: string;
          try {
            text = await fs.readFile(absPath, 'utf-8');
          } catch {
            logMcpTool('tool_call_end', 'get_content', cid, { durationMs: Date.now() - t0 });
            return { content: [{ type: 'text', text: `File not found: ${filePath}` }], _correlationId: cid };
          }
          logMcpTool('tool_call_end', 'get_content', cid, { durationMs: Date.now() - t0 });
          return { content: [{ type: 'text', text }], _correlationId: cid };
        } catch (err) {
          logMcpTool('tool_call_end', 'get_content', cid, { durationMs: Date.now() - t0, isError: true, error: err instanceof Error ? err.message : String(err) });
          throw err;
        }
      }
    );

    // ── create_content ────────────────────────────────────────────────────────
    this.server.tool(
      'create_content',
      'Create a new content file. Fails if the file already exists.',
      {
        filePath: z.string().describe('Relative path within CONTENT_ROOT'),
        content: z.string().describe('File content (markdown, JSON, etc.)'),
        tenantId: z.string().uuid().describe('Tenant UUID (required for audit trail and isolation)'),
        _correlationId: z.string().optional().describe('Correlation ID for request chaining'),
      },
      async ({ filePath, content, tenantId, _correlationId, ...rest }) => {
        const cid = resolveCorrelationId({ _correlationId, ...rest });
        const t0 = Date.now();
        logMcpTool('tool_call_start', 'create_content', cid, { tenantId });
        try {
          assertTenantId(tenantId);
          if (!contentWriteRateLimiter.checkLimit(tenantId)) {
            logMcpTool('tool_call_end', 'create_content', cid, { durationMs: Date.now() - t0, rateLimited: true });
            return rateLimitExceededResponse(cid);
          }
          const absPath = await safePath(filePath);
          // Use O_EXCL flag to atomically fail if the file already exists,
          // avoiding the TOCTOU race that would occur with access() + writeFile().
          try {
            await fs.mkdir(path.dirname(absPath), { recursive: true });
            await fs.writeFile(absPath, content, { encoding: 'utf-8', flag: 'wx' });
          } catch (err) {
            if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
              logMcpTool('tool_call_end', 'create_content', cid, { durationMs: Date.now() - t0 });
              return { content: [{ type: 'text', text: `File already exists: ${filePath}. Use update_content to modify.` }], _correlationId: cid };
            }
            throw err;
          }
          logMcpTool('tool_call_end', 'create_content', cid, { durationMs: Date.now() - t0 });
          return { content: [{ type: 'text', text: `Created: ${filePath}` }], _correlationId: cid };
        } catch (err) {
          logMcpTool('tool_call_end', 'create_content', cid, { durationMs: Date.now() - t0, isError: true, error: err instanceof Error ? err.message : String(err) });
          throw err;
        }
      }
    );

    // ── update_content ────────────────────────────────────────────────────────
    this.server.tool(
      'update_content',
      'Overwrite an existing content file with new content.',
      {
        filePath: z.string().describe('Relative path within CONTENT_ROOT'),
        content: z.string().describe('New file content'),
        tenantId: z.string().uuid().describe('Tenant UUID (required for audit trail and isolation)'),
        _correlationId: z.string().optional().describe('Correlation ID for request chaining'),
      },
      async ({ filePath, content, tenantId, _correlationId, ...rest }) => {
        const cid = resolveCorrelationId({ _correlationId, ...rest });
        const t0 = Date.now();
        logMcpTool('tool_call_start', 'update_content', cid, { tenantId });
        try {
          assertTenantId(tenantId);
          if (!contentWriteRateLimiter.checkLimit(tenantId)) {
            logMcpTool('tool_call_end', 'update_content', cid, { durationMs: Date.now() - t0, rateLimited: true });
            return rateLimitExceededResponse(cid);
          }
          const absPath = await safePath(filePath);
          await fs.mkdir(path.dirname(absPath), { recursive: true });
          await fs.writeFile(absPath, content, 'utf-8');
          logMcpTool('tool_call_end', 'update_content', cid, { durationMs: Date.now() - t0 });
          return { content: [{ type: 'text', text: `Updated: ${filePath}` }], _correlationId: cid };
        } catch (err) {
          logMcpTool('tool_call_end', 'update_content', cid, { durationMs: Date.now() - t0, isError: true, error: err instanceof Error ? err.message : String(err) });
          throw err;
        }
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
        tenantId: z.string().uuid().describe('Tenant UUID (required for audit trail)'),
        authorName: z.string().optional().default('Content Bot').describe('Git author name'),
        authorEmail: z
          .string()
          .email()
          .optional()
          .default('content-bot@marketing-platform.example')
          .describe('Git author email'),
        _correlationId: z.string().optional().describe('Correlation ID for request chaining'),
      },
      async ({ files, commitMessage, tenantId, authorName, authorEmail, _correlationId, ...rest }) => {
        const cid = resolveCorrelationId({ _correlationId, ...rest });
        const t0 = Date.now();
        logMcpTool('tool_call_start', 'publish_content', cid, { tenantId });
        try {
          assertTenantId(tenantId);
          if (!contentWriteRateLimiter.checkLimit(tenantId)) {
            logMcpTool('tool_call_end', 'publish_content', cid, { durationMs: Date.now() - t0, rateLimited: true });
            return rateLimitExceededResponse(cid);
          }
          const cwd = process.cwd();
          const absPaths = await Promise.all(files.map((f) => safePath(f)));

          // Stage files
          try {
            await execFileAsync('git', ['add', ...absPaths], { cwd });
          } catch (err) {
            throw new Error(`Failed to stage files for commit: ${err instanceof Error ? err.message : String(err)}`);
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
            throw new Error(`Failed to create commit: ${err instanceof Error ? err.message : String(err)}`);
          }

          // Push (best-effort)
          let pushMsg = '';
          try {
            const { stdout } = await execFileAsync('git', ['push'], { cwd });
            pushMsg = stdout.trim() || 'Pushed successfully.';
          } catch (err) {
            pushMsg = `Push failed (may need manual push): ${err instanceof Error ? err.message : String(err)}`;
          }

          logMcpTool('tool_call_end', 'publish_content', cid, { durationMs: Date.now() - t0 });
          return { content: [{ type: 'text', text: `Committed '${commitMessage}'. ${pushMsg}` }], _correlationId: cid };
        } catch (err) {
          logMcpTool('tool_call_end', 'publish_content', cid, { durationMs: Date.now() - t0, isError: true, error: err instanceof Error ? err.message : String(err) });
          throw err;
        }
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
