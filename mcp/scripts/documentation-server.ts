#!/usr/bin/env node

/**
 * Documentation MCP Server
 *
 * Model Context Protocol server for documentation intelligence
 * Provides context streaming, search, and RAG capabilities
 *
 * Part of 2026 Documentation Standards - Phase 2 Automation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, readFileSync } from 'fs';

// Import RAG pipeline
import { RAGPipeline } from '../scripts/rag/rag-pipeline.mjs';

class DocumentationMCPServer {
  private server: Server;
  private ragPipeline: RAGPipeline;
  private docsDir: string;
  private ragState: string;

  constructor() {
    this.server = new Server(
      {
        name: 'documentation-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.docsDir = process.env.DOCS_DIR || 'docs';
    this.ragState = process.env.RAG_STATE || 'rag-state.json';
    this.ragPipeline = new RAGPipeline({}, this.docsDir);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_documentation',
          description: 'Search documentation using RAG pipeline',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              quadrant: {
                type: 'string',
                enum: ['tutorials', 'how-to', 'reference', 'explanation'],
                description: 'Filter by Diátaxis quadrant',
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of results',
                default: 5,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'ask_documentation',
          description: 'Ask questions about documentation using RAG',
          inputSchema: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'Question to answer',
              },
              quadrant: {
                type: 'string',
                enum: ['tutorials', 'how-to', 'reference', 'explanation'],
                description: 'Filter by Diátaxis quadrant',
              },
            },
            required: ['question'],
          },
        },
        {
          name: 'get_documentation_stats',
          description: 'Get documentation statistics and metrics',
          inputSchema: {
            type: 'object',
            properties: {
              quadrant: {
                type: 'string',
                enum: ['tutorials', 'how-to', 'reference', 'explanation'],
                description: 'Filter by Diátaxis quadrant',
              },
            },
          },
        },
        {
          name: 'list_documentation_files',
          description: 'List all documentation files',
          inputSchema: {
            type: 'object',
            properties: {
              quadrant: {
                type: 'string',
                enum: ['tutorials', 'how-to', 'reference', 'explanation'],
                description: 'Filter by Diátaxis quadrant',
              },
              extension: {
                type: 'string',
                description: 'File extension filter',
                default: '.md',
              },
            },
          },
        },
        {
          name: 'get_documentation_content',
          description: 'Get content of a specific documentation file',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                description: 'Path to documentation file',
              },
              includeMetadata: {
                type: 'boolean',
                description: 'Include file metadata',
                default: true,
              },
            },
            required: ['filePath'],
          },
        },
        {
          name: 'validate_documentation_links',
          description: 'Validate internal and external links in documentation',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                description: 'Specific file to validate (optional)',
              },
              checkExternal: {
                type: 'boolean',
                description: 'Check external links',
                default: false,
              },
            },
          },
        },
        {
          name: 'analyze_documentation_health',
          description: 'Analyze documentation health metrics',
          inputSchema: {
            type: 'object',
            properties: {
              quadrant: {
                type: 'string',
                enum: ['tutorials', 'how-to', 'reference', 'explanation'],
                description: 'Filter by Diátaxis quadrant',
              },
              includeSuggestions: {
                type: 'boolean',
                description: 'Include improvement suggestions',
                default: true,
              },
            },
          },
        },
        {
          name: 'initialize_rag_pipeline',
          description: 'Initialize or update RAG pipeline',
          inputSchema: {
            type: 'object',
            properties: {
              forceRebuild: {
                type: 'boolean',
                description: 'Force rebuild of embeddings',
                default: false,
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_documentation':
            return await this.searchDocumentation(args);
          case 'ask_documentation':
            return await this.askDocumentation(args);
          case 'get_documentation_stats':
            return await this.getDocumentationStats(args);
          case 'list_documentation_files':
            return await this.listDocumentationFiles(args);
          case 'get_documentation_content':
            return await this.getDocumentationContent(args);
          case 'validate_documentation_links':
            return await this.validateDocumentationLinks(args);
          case 'analyze_documentation_health':
            return await this.analyzeDocumentationHealth(args);
          case 'initialize_rag_pipeline':
            return await this.initializeRAGPipeline(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async searchDocumentation(args: any) {
    await this.ensureRAGInitialized();

    const { query, quadrant, maxResults = 5 } = args;
    const filters = quadrant ? { quadrant } : undefined;

    const results = await this.ragPipeline.search(query, filters);
    const limitedResults = results.slice(0, maxResults);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              query,
              totalFound: results.length,
              results: limitedResults.map((chunk) => ({
                id: chunk.id,
                title: chunk.metadata.title,
                file: chunk.metadata.file,
                quadrant: chunk.metadata.quadrant,
                section: chunk.metadata.section,
                tags: chunk.metadata.tags,
                wordCount: chunk.metadata.wordCount,
                content: chunk.content.substring(0, 500) + '...',
              })),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async askDocumentation(args: any) {
    await this.ensureRAGInitialized();

    const { question, quadrant } = args;
    const filters = quadrant ? { quadrant } : undefined;

    const relevantChunks = await this.ragPipeline.search(question, filters);
    const answer = await this.ragPipeline.generateAnswer(question, relevantChunks);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              question,
              answer,
              sources: relevantChunks.map((chunk) => ({
                title: chunk.metadata.title,
                file: chunk.metadata.file,
                quadrant: chunk.metadata.quadrant,
              })),
              contextChunks: relevantChunks.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async getDocumentationStats(args: any) {
    await this.ensureRAGInitialized();

    const { quadrant } = args;
    const allChunks = this.ragPipeline['chunks'];

    const filteredChunks = quadrant
      ? allChunks.filter((chunk) => chunk.metadata.quadrant === quadrant)
      : allChunks;

    const stats = {
      totalDocuments: new Set(filteredChunks.map((chunk) => chunk.metadata.file)).size,
      totalChunks: filteredChunks.length,
      totalWords: filteredChunks.reduce((sum, chunk) => sum + chunk.metadata.wordCount, 0),
      totalCodeBlocks: filteredChunks.reduce((sum, chunk) => sum + chunk.metadata.codeBlocks, 0),
      totalLinks: filteredChunks.reduce((sum, chunk) => sum + chunk.metadata.links, 0),
      quadrants: {
        tutorials: filteredChunks.filter((c) => c.metadata.quadrant === 'tutorials').length,
        'how-to': filteredChunks.filter((c) => c.metadata.quadrant === 'how-to').length,
        reference: filteredChunks.filter((c) => c.metadata.quadrant === 'reference').length,
        explanation: filteredChunks.filter((c) => c.metadata.quadrant === 'explanation').length,
      },
      averageWordsPerChunk:
        filteredChunks.length > 0
          ? Math.round(
              filteredChunks.reduce((sum, chunk) => sum + chunk.metadata.wordCount, 0) /
                filteredChunks.length
            )
          : 0,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }

  private async listDocumentationFiles(args: any) {
    const { quadrant, extension = '.md' } = args;
    const { glob } = await import('glob');

    let pattern = `${this.docsDir}/**/*${extension}`;
    if (quadrant) {
      pattern = `${this.docsDir}/${quadrant}/**/*${extension}`;
    }

    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              files: files.map((file) => ({
                path: file,
                name: file.split('/').pop(),
                quadrant: this.determineQuadrant(file),
              })),
              total: files.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async getDocumentationContent(args: any) {
    const { filePath, includeMetadata = true } = args;

    if (!existsSync(filePath)) {
      throw new McpError(ErrorCode.InvalidRequest, `File not found: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    const metadata = includeMetadata ? this.extractFileMetadata(filePath, content) : undefined;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              filePath,
              content,
              metadata,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async validateDocumentationLinks(args: any) {
    const { filePath, checkExternal = false } = args;

    // Mock implementation - in production, use proper link validation
    const results = {
      internalLinks: {
        valid: 0,
        broken: 0,
        total: 0,
      },
      externalLinks: {
        valid: 0,
        broken: 0,
        total: 0,
      },
      issues: [] as string[],
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async analyzeDocumentationHealth(args: any) {
    await this.ensureRAGInitialized();

    const { quadrant, includeSuggestions = true } = args;
    const allChunks = this.ragPipeline['chunks'];

    const filteredChunks = quadrant
      ? allChunks.filter((chunk) => chunk.metadata.quadrant === quadrant)
      : allChunks;

    const health = {
      contentFreshness: this.calculateContentFreshness(filteredChunks),
      coverage: this.calculateCoverage(filteredChunks),
      quality: this.calculateQuality(filteredChunks),
      accessibility: this.calculateAccessibility(filteredChunks),
    };

    if (includeSuggestions) {
      health.suggestions = this.generateSuggestions(filteredChunks);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(health, null, 2),
        },
      ],
    };
  }

  private async initializeRAGPipeline(args: any) {
    const { forceRebuild = false } = args;

    if (forceRebuild || !existsSync(this.ragState)) {
      await this.ragPipeline.initialize();
      await this.ragPipeline.saveState(this.ragState);
    } else {
      await this.ragPipeline.loadState(this.ragState);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              message: 'RAG pipeline initialized successfully',
              chunks: this.ragPipeline['chunks'].length,
              stateFile: this.ragState,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async ensureRAGInitialized(): Promise<void> {
    if (this.ragPipeline['chunks'].length === 0) {
      if (existsSync(this.ragState)) {
        await this.ragPipeline.loadState(this.ragState);
      } else {
        await this.ragPipeline.initialize();
        await this.ragPipeline.saveState(this.ragState);
      }
    }
  }

  private determineQuadrant(filePath: string): string | undefined {
    if (filePath.includes('/tutorials/')) return 'tutorials';
    if (filePath.includes('/how-to/')) return 'how-to';
    if (filePath.includes('/reference/')) return 'reference';
    if (filePath.includes('/explanation/')) return 'explanation';
    return undefined;
  }

  private extractFileMetadata(filePath: string, content: string) {
    return {
      path: filePath,
      size: content.length,
      wordCount: content.split(/\s+/).length,
      codeBlocks: (content.match(/```[\s\S]*?```/g) || []).length,
      links: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
      quadrant: this.determineQuadrant(filePath),
      lastModified: new Date().toISOString(),
    };
  }

  private calculateContentFreshness(chunks: any[]) {
    // Mock implementation
    return {
      averageAge: 30, // days
      staleContent: 5,
      freshContent: chunks.length - 5,
      score: 0.85,
    };
  }

  private calculateCoverage(chunks: any[]) {
    // Mock implementation
    return {
      topicsCovered: 42,
      totalTopics: 50,
      score: 0.84,
    };
  }

  private calculateQuality(chunks: any[]) {
    // Mock implementation
    return {
      averageWordCount: chunks.reduce((sum, c) => sum + c.metadata.wordCount, 0) / chunks.length,
      codeBlockRatio: chunks.reduce((sum, c) => sum + c.metadata.codeBlocks, 0) / chunks.length,
      linkDensity: chunks.reduce((sum, c) => sum + c.metadata.links, 0) / chunks.length,
      score: 0.78,
    };
  }

  private calculateAccessibility(chunks: any[]) {
    // Mock implementation
    return {
      altTextCoverage: 0.92,
      headingStructure: 0.88,
      linkTextQuality: 0.85,
      score: 0.88,
    };
  }

  private generateSuggestions(chunks: any[]) {
    return [
      'Add more code examples to tutorial sections',
      'Improve alt text coverage for images',
      'Add cross-references between related topics',
      'Update outdated API references',
    ];
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Documentation MCP server running on stdio');
  }
}

// Start the server
const server = new DocumentationMCPServer();
server.run().catch(console.error);
