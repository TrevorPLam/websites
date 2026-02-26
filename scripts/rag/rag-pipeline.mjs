#!/usr/bin/env node

/**
 * RAG Pipeline for Documentation Intelligence
 * 
 * This script implements a Retrieval-Augmented Generation pipeline
 * for intelligent documentation search and content generation.
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    file: string;
    title: string;
    section: string;
    quadrant?: 'tutorials' | 'how-to' | 'reference' | 'explanation';
    tags: string[];
    lastModified: string;
    wordCount: number;
    codeBlocks: number;
    links: number;
  };
  embedding?: number[];
}

interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  vectorStore: string;
  similarityThreshold: number;
  maxResults: number;
}

class RAGPipeline {
  private config: RAGConfig;
  private docsDir: string;
  private chunks: DocumentChunk[] = [];
  private vectorStore: Map<string, number[]> = new Map();

  constructor(config: Partial<RAGConfig> = {}, docsDir: string = 'docs') {
    this.config = {
      chunkSize: 500,
      chunkOverlap: 50,
      embeddingModel: 'text-embedding-ada-002',
      vectorStore: 'memory',
      similarityThreshold: 0.7,
      maxResults: 5,
      ...config
    };
    this.docsDir = docsDir;
  }

  /**
   * Extract and chunk documents
   */
  private async extractDocuments(): Promise<void> {
    console.log('📚 Extracting documents from', this.docsDir);
    
    const files = await glob(`${this.docsDir}/**/*.md`, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    });

    for (const file of files) {
      await this.processFile(file);
    }

    console.log(`✅ Processed ${this.chunks.length} document chunks`);
  }

  /**
   * Process a single markdown file
   */
  private async processFile(filePath: string): Promise<void> {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Extract metadata
    const metadata = this.extractMetadata(filePath, content);
    
    // Chunk the content
    const chunks = this.chunkContent(content, metadata);
    
    this.chunks.push(...chunks);
  }

  /**
   * Extract metadata from file
   */
  private extractMetadata(filePath: string, content: string): DocumentChunk['metadata'] {
    const lines = content.split('\n');
    const frontMatter = this.extractFrontMatter(content);
    
    // Determine quadrant from file path
    const quadrant = this.determineQuadrant(filePath);
    
    // Extract title
    const title = this.extractTitle(content, frontMatter);
    
    // Count elements
    const wordCount = content.split(/\s+/).length;
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    
    // Extract tags
    const tags = this.extractTags(content, frontMatter);
    
    return {
      file: filePath,
      title,
      section: this.extractSection(filePath),
      quadrant,
      tags,
      lastModified: new Date().toISOString(),
      wordCount,
      codeBlocks,
      links
    };
  }

  /**
   * Extract front matter from markdown
   */
  private extractFrontMatter(content: string): Record<string, any> {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);
    
    if (match) {
      try {
        // Simple YAML parsing (in production, use a proper YAML parser)
        const yaml = match[1];
        const frontMatter: Record<string, any> = {};
        
        yaml.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            frontMatter[key.trim()] = valueParts.join(':').trim();
          }
        });
        
        return frontMatter;
      } catch (error) {
        console.warn('Failed to parse front matter:', error);
      }
    }
    
    return {};
  }

  /**
   * Determine Diátaxis quadrant from file path
   */
  private determineQuadrant(filePath: string): 'tutorials' | 'how-to' | 'reference' | 'explanation' | undefined {
    if (filePath.includes('/tutorials/')) return 'tutorials';
    if (filePath.includes('/how-to/')) return 'how-to';
    if (filePath.includes('/reference/')) return 'reference';
    if (filePath.includes('/explanation/')) return 'explanation';
    return undefined;
  }

  /**
   * Extract title from content
   */
  private extractTitle(content: string, frontMatter: Record<string, any>): string {
    // Try front matter first
    if (frontMatter.title) {
      return frontMatter.title;
    }
    
    // Try first heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
    
    // Fallback to filename
    return 'Untitled Document';
  }

  /**
   * Extract section from file path
   */
  private extractSection(filePath: string): string {
    const parts = filePath.split('/');
    const docsIndex = parts.indexOf('docs');
    if (docsIndex >= 0 && docsIndex < parts.length - 1) {
      return parts[docsIndex + 1];
    }
    return 'root';
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string, frontMatter: Record<string, any>): string[] {
    const tags = new Set<string>();
    
    // From front matter
    if (frontMatter.tags) {
      const frontMatterTags = Array.isArray(frontMatter.tags) 
        ? frontMatter.tags 
        : frontMatter.tags.split(',').map((tag: string) => tag.trim());
      frontMatterTags.forEach((tag: string) => tags.add(tag));
    }
    
    // From content (common keywords)
    const keywords = [
      'tutorial', 'guide', 'reference', 'api', 'configuration',
      'installation', 'setup', 'deployment', 'security', 'testing',
      'typescript', 'javascript', 'react', 'next.js', 'node.js',
      'database', 'postgresql', 'supabase', 'stripe', 'oauth'
    ];
    
    const lowerContent = content.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        tags.add(keyword);
      }
    });
    
    return Array.from(tags);
  }

  /**
   * Chunk content into smaller pieces
   */
  private chunkContent(content: content: string, metadata: DocumentChunk['metadata']): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const words = content.split(/\s+/);
    
    for (let i = 0; i < words.length; i += this.config.chunkSize - this.config.chunkOverlap) {
      const chunkWords = words.slice(i, i + this.config.chunkSize);
      const chunkContent = chunkWords.join(' ');
      
      const chunk: DocumentChunk = {
        id: `${metadata.file}-${i}`,
        content: chunkContent,
        metadata: {
          ...metadata,
          wordCount: chunkWords.length
        }
      };
      
      chunks.push(chunk);
    }
    
    return chunks;
  }

  /**
   * Generate embeddings (mock implementation)
   */
  private async generateEmbeddings(): Promise<void> {
    console.log('🧠 Generating embeddings...');
    
    for (const chunk of this.chunks) {
      // Mock embedding generation (in production, use OpenAI or similar)
      const embedding = this.mockEmbedding(chunk.content);
      chunk.embedding = embedding;
      this.vectorStore.set(chunk.id, embedding);
    }
    
    console.log(`✅ Generated ${this.chunks.length} embeddings`);
  }

  /**
   * Mock embedding generation
   */
  private mockEmbedding(text: string): number[] {
    // Simple hash-based embedding (for demonstration)
    const embedding = new Array(1536).fill(0);
    const hash = this.simpleHash(text);
    
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = Math.sin(hash + i) * 0.5 + 0.5;
    }
    
    return embedding;
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Calculate cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    return dotProduct / (normA * normB);
  }

  /**
   * Search for relevant documents
   */
  async search(query: string, filters?: Partial<DocumentChunk['metadata']>): Promise<DocumentChunk[]> {
    console.log(`🔍 Searching for: "${query}"`);
    
    // Generate query embedding
    const queryEmbedding = this.mockEmbedding(query);
    
    // Calculate similarities
    const similarities = this.chunks
      .filter(chunk => {
        // Apply filters
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            if (chunk.metadata[key as keyof DocumentChunk['metadata']] !== value) {
              return false;
            }
          }
        }
        return true;
      })
      .map(chunk => ({
        chunk,
        similarity: chunk.embedding ? this.cosineSimilarity(queryEmbedding, chunk.embedding) : 0
      }))
      .filter(result => result.similarity >= this.config.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.config.maxResults);
    
    console.log(`📊 Found ${similarities.length} relevant chunks`);
    
    return similarities.map(result => result.chunk);
  }

  /**
   * Generate answer using RAG
   */
  async generateAnswer(query: string, context?: DocumentChunk[]): Promise<string> {
    console.log('🤖 Generating answer...');
    
    // Retrieve relevant context if not provided
    const relevantChunks = context || await this.search(query);
    
    if (relevantChunks.length === 0) {
      return 'I could not find relevant information to answer your question.';
    }
    
    // Combine context
    const contextText = relevantChunks
      .map(chunk => chunk.content)
      .join('\n\n');
    
    // Generate answer (mock implementation)
    const answer = this.mockAnswerGeneration(query, contextText, relevantChunks);
    
    return answer;
  }

  /**
   * Mock answer generation
   */
  private mockAnswerGeneration(query: string, context: string, chunks: DocumentChunk[]): string {
    const sources = chunks.map(chunk => ({
      file: chunk.metadata.file,
      title: chunk.metadata.title,
      quadrant: chunk.metadata.quadrant
    }));
    
    return `Based on the documentation, here's what I found about "${query}":

${context.substring(0, 500)}...

Sources:
${sources.map((source, i) => `${i + 1}. ${source.title} (${source.quadrant})`).join('\n')}

This answer was generated using the RAG pipeline with ${chunks.length} relevant document chunks.`;
  }

  /**
   * Initialize and run the RAG pipeline
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing RAG Pipeline...\n');
    
    await this.extractDocuments();
    await this.generateEmbeddings();
    
    console.log('\n✅ RAG Pipeline ready!');
    console.log(`📚 Indexed ${this.chunks.length} document chunks`);
    console.log(`🔍 Similarity threshold: ${this.config.similarityThreshold}`);
    console.log(`📊 Max results: ${this.config.maxResults}`);
  }

  /**
   * Save pipeline state
   */
  async saveState(outputPath: string = 'rag-state.json'): Promise<void> {
    const state = {
      config: this.config,
      chunks: this.chunks,
      timestamp: new Date().toISOString()
    };
    
    writeFileSync(outputPath, JSON.stringify(state, null, 2));
    console.log(`💾 Saved RAG state to ${outputPath}`);
  }

  /**
   * Load pipeline state
   */
  async loadState(inputPath: string = 'rag-state.json'): Promise<void> {
    if (!existsSync(inputPath)) {
      console.log('⚠️ No saved state found, initializing fresh...');
      return;
    }
    
    const state = JSON.parse(readFileSync(inputPath, 'utf-8'));
    this.config = state.config;
    this.chunks = state.chunks;
    
    // Rebuild vector store
    for (const chunk of this.chunks) {
      if (chunk.embedding) {
        this.vectorStore.set(chunk.id, chunk.embedding);
      }
    }
    
    console.log(`📂 Loaded RAG state from ${inputPath}`);
    console.log(`📚 Restored ${this.chunks.length} chunks`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'init';
  const docsDir = args[1] || 'docs';

  const rag = new RAGPipeline({}, docsDir);

  switch (command) {
    case 'init':
      await rag.initialize();
      await rag.saveState();
      break;
      
    case 'search':
      await rag.loadState();
      const query = args[2] || 'tutorial';
      const results = await rag.search(query);
      console.log('\n🔍 Search Results:');
      results.forEach((chunk, i) => {
        console.log(`\n${i + 1}. ${chunk.metadata.title}`);
        console.log(`   File: ${chunk.metadata.file}`);
        console.log(`   Content: ${chunk.content.substring(0, 200)}...`);
      });
      break;
      
    case 'ask':
      await rag.loadState();
      const question = args[2] || 'How do I set up the development environment?';
      const answer = await rag.generateAnswer(question);
      console.log('\n🤖 Answer:');
      console.log(answer);
      break;
      
    case 'save':
      await rag.saveState(args[2]);
      break;
      
    case 'load':
      await rag.loadState(args[2]);
      break;
      
    default:
      console.log('Usage: node rag-pipeline.mjs [init|search|ask|save|load] [docsDir] [query|filePath]');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { RAGPipeline, DocumentChunk, RAGConfig };
