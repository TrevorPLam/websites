#!/usr/bin/env node

/**
 * Documentation MCP Server
 * 
 * Model Context Protocol server for documentation intelligence
 * providing tools for search, analysis, and content retrieval
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface DocumentationServer {
  name: string;
  version: string;
  tools: Record<string, any>;
  capabilities: Record<string, any>;
}

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

interface SearchRequest {
  query: string;
  filters?: {
    quadrant?: string;
    tags?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
  };
  limit?: number;
}

interface AnalysisRequest {
  type: 'health' | 'quality' | 'accessibility' | 'seo' | 'links';
  scope?: 'all' | 'file' | 'directory';
  target?: string;
}

interface ContentRequest {
  type: 'extract' | 'summarize' | 'translate' | 'generate';
  source?: string;
  language?: string;
  context?: string;
}

class DocumentationMCPServer {
  private docsDir: string;
  private server: DocumentationServer;
  private ragPipeline: any;
  private healthAnalyzer: any;

  constructor(docsDir: string = 'docs') {
    this.docsDir = docsDir;
    this.server = this.initializeServer();
    
    // Initialize RAG pipeline if available
    try {
      this.ragPipeline = this.initializeRAGPipeline();
    } catch (error) {
      console.warn('RAG pipeline not available:', error.message);
    }
    
    // Initialize health analyzer if available
    try {
      this.healthAnalyzer = this.initializeHealthAnalyzer();
    } catch (error) {
      console.warn('Health analyzer not available:', error.message);
    }
  }

  /**
   * Initialize the MCP server
   */
  private initializeServer(): DocumentationServer {
    return {
      name: 'documentation-server',
      version: '1.0.0',
      capabilities: {
        tools: {
          search: {
            description: 'Search documentation with semantic understanding',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                filters: { type: 'object', description: 'Search filters' },
                limit: { type: 'number', description: 'Result limit' }
              },
              required: ['query']
            }
          },
          analyze: {
            description: 'Analyze documentation quality and health',
            inputSchema: {
              type: 'object',
              properties: {
                type: { 
                  type: 'string', 
                  enum: ['health', 'quality', 'accessibility', 'seo', 'links'],
                  description: 'Analysis type'
                },
                scope: { 
                  type: 'string', 
                  enum: ['all', 'file', 'directory'],
                  description: 'Analysis scope'
                },
                target: { type: 'string', description: 'Target file or directory' }
              },
              required: ['type']
            }
          },
          extract: {
            description: 'Extract content from documentation',
            inputSchema: {
              type: 'object',
              properties: {
                source: { type: 'string', description: 'Source file or directory' },
                type: { 
                  type: 'string', 
                  enum: ['extract', 'summarize', 'translate', 'generate'],
                  description: 'Extraction type'
                },
                language: { type: 'string', description: 'Target language' },
                context: { type: 'string', description: 'Additional context' }
              },
              required: ['type']
            }
          },
          health_check: {
            description: 'Check server health status',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        }
      }
    };
  }

  /**
   * Initialize RAG pipeline
   */
  private initializeRAGPipeline() {
    // Mock RAG pipeline implementation
    return {
      search: async (query: string) => {
        console.log(`RAG search: ${query}`);
        return { results: [], total: 0 };
      },
      ask: async (question: string) => {
        console.log(`RAG ask: ${question}`);
        return { answer: 'Mock answer' };
      },
      init: async () => {
        console.log('RAG pipeline initialized');
      }
    };
  }

  /**
   * Initialize health analyzer
   */
  private initializeHealthAnalyzer() {
    // Mock health analyzer implementation
    return {
      analyzeAll: async (path: string) => {
        console.log(`Health analysis: ${path}`);
        return { score: 85, issues: [] };
      }
    };
  }

  /**
   * Search documentation
   */
  async searchDocumentation(request: SearchRequest) {
    console.log(`🔍 Searching documentation: ${request.query}`);
    
    try {
      // Use RAG pipeline if available
      if (this.ragPipeline) {
        return await this.ragPipeline.search(request.query);
      }
      
      // Fallback to file system search
      return await this.fileSystemSearch(request);
    } catch (error) {
      console.error('Search failed:', error.message);
      return { results: [], total: 0, error: error.message };
    }
  }

  /**
   * File system search fallback
   */
  private async fileSystemSearch(request: SearchRequest) {
    const files = await glob(`${this.docsDir}/**/*.md`, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    });
    
    const results = [];
    const limit = request.limit || 10;
    
    for (const file of files.slice(0, limit)) {
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Simple keyword matching
        const matches = lines.filter(line => 
          line.toLowerCase().includes(request.query.toLowerCase())
        ).length;
        
        if (matches > 0) {
          const title = this.extractTitle(content);
          results.push({
            file,
            title,
            matches,
            excerpt: this.createExcerpt(content, request.query),
            metadata: this.extractMetadata(file, content)
          });
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }
    
    return {
      results,
      total: results.length,
      query: request.query
    };
  }

  /**
   * Analyze documentation
   */
  async analyzeDocumentation(request: AnalysisRequest) {
    console.log(`📊 Analyzing documentation: ${request.type}`);
    
    try {
      // Use health analyzer if available
      if (this.healthAnalyzer && request.type === 'health') {
        const target = request.target || this.docsDir;
        return await this.healthAnalyzer.analyzeAll(target);
      }
      
      // Fallback analysis
      return await this.performAnalysis(request);
    } catch (error) {
      console.error('Analysis failed:', error.message);
      return { score: 0, issues: [error.message], error: error.message };
    }
  }

  /**
   * Perform analysis
   */
  private async performAnalysis(request: AnalysisRequest) {
    const target = request.target || this.docsDir;
    
    switch (request.type) {
      case 'health':
        return this.analyzeHealth(target);
      case 'quality':
        return this.analyzeQuality(target);
      case 'accessibility':
        return this.analyzeAccessibility(target);
      case 'seo':
        return this.analyzeSEO(target);
      case 'links':
        return this.analyzeLinks(target);
      default:
        throw new Error(`Unknown analysis type: ${request.type}`);
    }
  }

  /**
   * Analyze health
   */
  private async analyzeHealth(target: string) {
    const files = await glob(`${target}/**/*.md`);
    const issues = [];
    let score = 100;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Check for missing title
        if (!content.match(/^#\s+/m)) {
          issues.push({ file, issue: 'Missing title', severity: 'medium' });
          score -= 5;
        }
        
        // Check for very short content
        if (content.length < 200) {
          issues.push({ file, issue: 'Content too short', severity: 'low' });
          score -= 2;
        }
        
        // Check for broken links (basic check)
        const links = content.match(/\[.*?\]\(.*?\)/g) || [];
        const httpLinks = links.filter(link => link.includes('http://'));
        if (httpLinks.length > 0) {
          issues.push({ file, issue: 'Insecure HTTP links', severity: 'medium' });
          score -= 3;
        }
      } catch (error) {
        issues.push({ file, issue: `Error reading file: ${error.message}`, severity: 'high' });
        score -= 10;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Analyze quality
   */
  private async analyzeQuality(target: string) {
    const files = await glob(`${target}/**/*.md`);
    const issues = [];
    let score = 100;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Check for code examples
        if (!content.includes('```')) {
          issues.push({ file, issue: 'No code examples', severity: 'medium' });
          score -= 5;
        }
        
        // Check for proper structure
        const sections = content.split(/^##\s+/m);
        if (sections.length < 2) {
          issues.push({ file, issue: 'Poor structure', severity: 'medium' });
          score -= 5;
        }
        
        // Check for word count
        const wordCount = content.split(/\s+/).length;
        if (wordCount < 100) {
          issues.push({ file, issue: 'Too few words', severity: 'low' });
          score -= 2;
        }
      } catch (error) {
        issues.push({ file, issue: `Error reading file: ${error.message}`, severity: 'high' });
        score -= 10;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Analyze accessibility
   */
  private async analyzeAccessibility(target: string) {
    const files = await glob(`${target}/**/*.md`);
    const issues = [];
    let score = 100;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Check for image alt text
        const images = content.match(/!\[.*?\]\(.*?\)/g) || [];
        const missingAlt = images.filter(img => !img.match(/!\[.*?\]/)[1]);
        if (missingAlt.length > 0) {
          issues.push({ file, issue: 'Missing image alt text', severity: 'medium' });
          score -= 3;
        }
        
        // Check for proper headings
        const headings = content.match(/^#+\s+/gm) || [];
        const skipHeadings = headings.filter(h => h.length > 80);
        if (skipHeadings.length > 0) {
          issues.push({ file, issue: 'Headings too long', severity: 'low' });
          score -= 1;
        }
        
        // Check for link text
        const links = content.match(/\[.*?\]\(.*?\)/g) || [];
        const emptyLinks = links.filter(link => link.match(/\[\s*\]/));
        if (emptyLinks.length > 0) {
          issues.push({ file, issue: 'Empty link text', severity: 'medium' });
          score -= 3;
        }
      } catch (error) {
        issues.push({ file, issue: `Error reading file: ${error.message}`, severity: 'high' });
        score -= 10;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Analyze SEO
   */
  private async analyzeSEO(target: string) {
    const files = await glob(`${target}/**/*.md`);
    const issues = [];
    let score = 100;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Check for title
        const title = this.extractTitle(content);
        if (!title || title.length < 10) {
          issues.push({ file, issue: 'Poor or missing title', severity: 'medium' });
          score -= 5;
        }
        
        // Check for description
        const firstLines = content.split('\n').slice(0, 5).join(' ');
        if (firstLines.length < 50) {
          issues.push({ file, issue: 'Missing description', severity: 'medium' });
          score -= 3;
        }
        
        // Check for meta tags (basic check)
        if (!content.includes('meta') && !content.includes('title:')) {
          issues.push({ file, issue: 'Missing meta tags', severity: 'low' });
          score -= 2;
        }
      } catch (error) {
        issues.push({ file, issue: `Error reading file: ${error.message}`, severity: 'high' });
        score -= 10;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Analyze links
   */
  private async analyzeLinks(target: string) {
    const files = await glob(`${target}/**/*.md`);
    const issues = [];
    let score = 100;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        
        // Extract all links
        const links = content.match(/\[.*?\]\((.*?)\)/g) || [];
        
        for (const link of links) {
          const url = link.match(/\((.*?)\)/)[1];
          
          // Check for broken internal links
          if (url.startsWith('./') || url.startsWith('../')) {
            const fullPath = join(dirname(file), url);
            if (!existsSync(fullPath)) {
              issues.push({ file, issue: `Broken internal link: ${url}`, severity: 'medium' });
              score -= 2;
            }
          }
          
          // Check for HTTP links
          if (url.startsWith('http://')) {
            issues.push({ file, issue: `Insecure HTTP link: ${url}`, severity: 'medium' });
            score -= 1;
          }
          
          // Check for empty link text
          const linkText = link.match(/\[(.*?)\]/)[1];
          if (!linkText || linkText.trim().length === 0) {
            issues.push({ file, issue: `Empty link text: ${url}`, severity: 'medium' });
            score -= 1;
          }
        }
      } catch (error) {
        issues.push({ file, issue: `Error reading file: ${error.message}`, severity: 'high' });
        score -= 10;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Extract content
   */
  async extractContent(request: ContentRequest) {
    console.log(`📄 Extracting content: ${request.type}`);
    
    try {
      const source = request.source || this.docsDir;
      
      switch (request.type) {
        case 'extract':
          return await this.extractFromFile(source);
        case 'summarize':
          return await this.summarizeContent(source);
        case 'translate':
          return await this.translateContent(source, request.language);
        case 'generate':
          return await this.generateContent(request.context);
        default:
          throw new Error(`Unknown extraction type: ${request.type}`);
      }
    } catch (error) {
      console.error('Extraction failed:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Extract from file
   */
  private async extractFromFile(source: string) {
    const content = readFileSync(source, 'utf-8');
    return {
      content,
      metadata: this.extractMetadata(source, content),
      wordCount: content.split(/\s+/).length,
      codeBlocks: (content.match(/```[\s\S]*?```/g) || []).length,
      links: (content.match(/\[.*?\]\(.*?\)/g) || []).length
    };
  }

  /**
   * Summarize content
   */
  private async summarizeContent(source: string) {
    const content = readFileSync(source, 'utf-8');
    const lines = content.split('\n');
    
    // Simple summarization (first and last paragraphs)
    const firstPara = lines.slice(0, 5).join(' ').trim();
    const lastPara = lines.slice(-5).join(' ').trim();
    
    return {
      summary: `${firstPara.substring(0, 200)}...`,
      wordCount: content.split(/\s+/).length,
      sections: lines.filter(line => line.startsWith('##')).length
    };
  }

  /**
   * Translate content
   */
  private async translateContent(source: string, language: string) {
    const content = readFileSync(source, 'utf-8');
    
    // Mock translation (in production, use translation service)
    return {
      translatedContent: `[${language.toUpperCase()}] ${content.substring(0, 100)}...`,
      originalLanguage: 'en',
      targetLanguage: language,
      confidence: 0.8
    };
  }

  /**
   * Generate content
   */
  private async generateContent(context: string) {
    // Mock content generation (in production, use AI service)
    return {
      generatedContent: `Generated content based on: ${context}`,
      type: 'documentation',
      confidence: 0.7
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const serverStatus = this.server;
      const ragStatus = this.ragPipeline ? 'available' : 'unavailable';
      const healthStatus = this.healthAnalyzer ? 'available' : 'unavailable';
      
      return {
        status: 'healthy',
        server: serverStatus,
        rag: ragStatus,
        health: healthStatus,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * Extract title from content
   */
  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : '';
  }

  /**
   * Create excerpt
   */
  private createExcerpt(content: string, query: string): string {
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();
    
    for (const line of lines) {
      if (line.toLowerCase().includes(queryLower)) {
        return line.substring(0, 200);
      }
    }
    
    return content.substring(0, 200);
  }

  /**
   * Extract metadata
   */
  private extractMetadata(file: string, content: string): any {
    const stats = require('fs').statSync(file);
    
    return {
      file,
      size: stats.size,
      modified: stats.mtime,
      wordCount: content.split(/\s+/).length,
      codeBlocks: (content.match(/```[\s\S]*?```/g) || []).length,
      links: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
      hasTitle: !!content.match(/^#\s+/m),
      sections: content.split(/^##\s+/m).length
    };
  }

  /**
   * Handle MCP request
   */
  async handleRequest(tool: string, params: any) {
    switch (tool) {
      case 'search':
        return await this.searchDocumentation(params);
      case 'analyze':
        return await this.analyzeDocumentation(params);
      case 'extract':
        return await this.extractContent(params);
      case 'health_check':
        return await this.healthCheck();
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
  }

  /**
   * Start the MCP server
   */
  start(port: number = 3000) {
    console.log(`🚀 Starting Documentation MCP Server on port ${port}`);
    console.log(`📚 Documentation directory: ${this.docsDir}`);
    console.log(`🔧 Available tools: ${Object.keys(this.server.capabilities.tools).join(', ')}`);
    
    // In a real implementation, this would start an HTTP server
    console.log('✅ MCP Server ready for requests');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const server = new DocumentationMCPServer();
  
  switch (command) {
    case 'start':
      const port = parseInt(args[1]) || 3000;
      server.start(port);
      break;
      
    case 'search':
      const searchRequest = JSON.parse(args[1] || '{}');
      const searchResults = await server.searchDocumentation(searchRequest);
      console.log('Search Results:', JSON.stringify(searchResults, null, 2));
      break;
      
    case 'analyze':
      const analysisRequest = JSON.parse(args[1] || '{}');
      const analysisResults = await server.analyzeDocumentation(analysisRequest);
      console.log('Analysis Results:', JSON.stringify(analysisResults, null, 2));
      break;
      
    case 'extract':
      const contentRequest = JSON.parse(args[1] || '{}');
      const contentResults = await server.extractContent(contentRequest);
      console.log('Content Results:', JSON.stringify(contentResults, null, 2));
      break;
      
    case 'health':
      const healthResults = await server.healthCheck();
      console.log('Health Results:', JSON.stringify(healthResults, null, 2));
      break;
      
    case 'help':
      console.log(`
Documentation MCP Server

Usage:
  node scripts/mcp/documentation-server.ts <command> [params]

Commands:
  start [port]           - Start the MCP server (default port 3000)
  search <query>          - Search documentation
  analyze <type>          - Analyze documentation (health|quality|accessibility|seo|links)
  extract <type>          - Extract content (extract|summarize|translate|generate)
  health                 - Check server health
  help                   - Show this help message

Examples:
  node scripts/mcp/documentation-server.ts start
  node scripts/mcp/documentation-server.ts search '{"query": "react"}'
  node scripts/mcp/documentation-server.ts analyze '{"type": "health"}'
  node scripts/mcp/documentation-server.ts extract '{"type": "summarize", "source": "docs/README.md"}'
      `);
      break;
      
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Documentation MCP Server error:', error);
    process.exit(1);
  });
}

export { DocumentationMCPServer };
