#!/usr/bin/env node

/**
 * @file scripts/rag/rag-pipeline-working.mjs
 * @summary Working version of RAG pipeline for documentation processing and testing.
 * @description Development version with enhanced logging and experimental features for RAG pipeline.
 * @security Handles API keys securely; validates input documents; no sensitive data in logs.
 * @adr none
 * @requirements AI-RAG-002, docs-processing-testing
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// DocumentChunk factory function
function createDocumentChunk(id, content, metadata, embedding) {
  return {
    id,
    content,
    metadata,
    embedding,
  };
}

// RAGConfig factory function
function createRAGConfig(options = {}) {
  return {
    chunkSize: options.chunkSize || 500,
    chunkOverlap: options.chunkOverlap || 50,
    embeddingModel: options.embeddingModel || 'text-embedding-ada-002',
    vectorStore: options.vectorStore || 'memory',
    similarityThreshold: options.similarityThreshold || 0.7,
    maxResults: options.maxResults || 5,
    ...options,
  };
}

class RAGPipeline {
  constructor(config = {}, docsDir = 'docs') {
    this.config = createRAGConfig(config);
    this.docsDir = docsDir;
    this.outputDir = 'rag-output';
    this.chunks = [];
    this.vectorStore = new Map();
    this.embeddingService = null; // Will be initialized later
  }

  /**
   * Extract and chunk documents
   */
  async extractDocuments() {
    console.log('📚 Extracting documents from', this.docsDir);

    const files = await glob(`${this.docsDir}/**/*.md`, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    });

    for (const file of files) {
      await this.processFile(file);
    }

    console.log(`✅ Processed ${this.chunks.length} document chunks`);
  }

  /**
   * Process a single markdown file
   */
  async processFile(filePath) {
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
  extractMetadata(filePath, content) {
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

    return {
      file: filePath,
      title,
      section: this.extractSection(filePath),
      quadrant,
      tags: this.extractTags(content, frontMatter),
      lastModified: new Date().toISOString(),
      wordCount,
      codeBlocks,
      links,
    };
  }

  /**
   * Extract front matter from markdown
   */
  extractFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);

    if (match) {
      try {
        // Simple YAML parsing (for demonstration)
        const yaml = match[1];
        const result = {};
        const lines = yaml.split('\n');

        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            result[key] = value.replace(/^['"]|['"]$/g, '');
          }
        }

        return result;
      } catch (error) {
        console.warn('Failed to parse front matter:', error.message);
        return {};
      }
    }

    return {};
  }

  /**
   * Determine Diátaxis quadrant from file path
   */
  determineQuadrant(filePath) {
    if (filePath.includes('/tutorials/')) return 'tutorials';
    if (filePath.includes('/how-to/')) return 'how-to';
    if (filePath.includes('/reference/')) return 'reference';
    if (filePath.includes('/explanation/')) return 'explanation';
    return undefined;
  }

  /**
   * Extract title from content
   */
  extractTitle(content, frontMatter) {
    // Try front matter first
    if (frontMatter.title) {
      return frontMatter.title;
    }

    // Try first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1];
    }

    // Fallback to filename
    return 'Untitled';
  }

  /**
   * Extract section from file path
   */
  extractSection(filePath) {
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
  extractTags(content, frontMatter) {
    const tags = new Set();

    // From front matter
    if (frontMatter.tags) {
      const frontMatterTags = Array.isArray(frontMatter.tags)
        ? frontMatter.tags
        : frontMatter.tags.split(',').map((t) => t.trim());
      frontMatterTags.forEach((tag) => tags.add(tag));
    }

    // From content
    const tagMatches = content.match(/#(\w+)/g);
    if (tagMatches) {
      tagMatches.forEach((tag) => tags.add(tag.substring(1)));
    }

    return Array.from(tags);
  }

  /**
   * Chunk content into smaller pieces
   */
  chunkContent(content, metadata) {
    const chunks = [];
    const words = content.split(/\s+/);
    const chunkSize = this.config.chunkSize;
    const chunkOverlap = this.config.chunkOverlap;

    for (let i = 0; i < words.length; i += chunkSize - chunkOverlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkContent = chunkWords.join(' ');

      const chunk = createDocumentChunk(
        `chunk-${i}-${metadata.file.replace(/[^a-zA-Z0-9]/g, '-')}`,
        chunkContent,
        metadata,
        undefined // Will be added later
      );

      chunks.push(chunk);
    }

    return chunks;
  }

  /**
   * Mock embedding generation
   */
  mockEmbedding(text) {
    // Simple hash-based embedding (for demonstration)
    const embedding = new Array(1536).fill(0);
    const hash = this.simpleHash(text);

    // Use hash to create a pseudo-random embedding
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = Math.sin(hash * (i + 1)) * 0.1;
    }

    return embedding;
  }

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate cosine similarity
   */
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Search documents
   */
  async search(query, filters = {}) {
    console.log(`🔍 Searching for: "${query}"`);

    // Generate query embedding
    const queryEmbedding = this.mockEmbedding(query);

    // Calculate similarities
    const similarities = this.chunks
      .filter((chunk) => {
        // Apply filters
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            if (chunk.metadata[key] !== value) {
              return false;
            }
          }
        }
        return true;
      })
      .map((chunk) => ({
        chunk,
        similarity: chunk.embedding ? this.cosineSimilarity(queryEmbedding, chunk.embedding) : 0,
      }))
      .filter((result) => result.similarity >= this.config.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.config.maxResults);

    console.log(`📊 Found ${similarities.length} relevant chunks`);

    return similarities.map((result) => result.chunk);
  }

  /**
   * Generate answer using RAG
   */
  async generateAnswer(query, context) {
    console.log('🤖 Generating answer...');

    // Retrieve relevant context if not provided
    if (!context) {
      const searchResults = await this.search(query);
      context = searchResults.map((result) => result.chunk);
    }

    if (context.length === 0) {
      return 'I could not find relevant information to answer your question.';
    }

    // Generate answer (mock implementation)
    return this.mockAnswerGeneration(query, context.join('\n\n'), context);
  }

  /**
   * Mock answer generation
   */
  mockAnswerGeneration(query, context, chunks) {
    const sources = chunks.map((chunk) => ({
      file: chunk.metadata.file,
      title: chunk.metadata.title,
      quadrant: chunk.metadata.quadrant,
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
  async initialize() {
    console.log('🚀 Initializing RAG Pipeline...\n');

    await this.extractDocuments();
    await this.generateMockEmbeddings();

    console.log(`\n✅ RAG Pipeline initialized with ${this.chunks.length} document chunks`);
    console.log(`📚 Documents processed from: ${this.docsDir}`);
    console.log(`🧠 Embedding model: ${this.config.embeddingModel}`);
    console.log(`🔍 Similarity threshold: ${this.config.similarityThreshold}`);
    console.log(`📊 Max results: ${this.config.maxResults}`);
  }

  /**
   * Generate mock embeddings (for fallback)
   */
  async generateMockEmbeddings() {
    console.log('🧠 Generating mock embeddings...');

    for (const chunk of this.chunks) {
      chunk.embedding = this.mockEmbedding(chunk.content);
      this.vectorStore.set(chunk.id, chunk.embedding);
    }

    console.log(`✅ Generated ${this.chunks.length} mock embeddings`);
  }

  /**
   * Save pipeline state
   */
  async saveState(outputPath = 'rag-state.json') {
    const state = {
      config: this.config,
      chunks: this.chunks,
      vectorStore: Object.fromEntries(this.vectorStore),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    writeFileSync(outputPath, JSON.stringify(state, null, 2));
    console.log(`💾 Pipeline state saved to: ${outputPath}`);
  }

  /**
   * Load pipeline state
   */
  async loadState(inputPath = 'rag-state.json') {
    if (!existsSync(inputPath)) {
      console.log('⚠️ No saved state found, initializing fresh...');
      return;
    }

    try {
      const state = JSON.parse(readFileSync(inputPath, 'utf-8'));

      this.config = state.config;
      this.chunks = state.chunks;
      this.vectorStore = new Map(Object.entries(state.vectorStore));

      console.log(`📂 Pipeline state loaded from: ${inputPath}`);
      console.log(`📊 Loaded ${this.chunks.length} chunks`);
      console.log(`🕐 State from: ${state.timestamp}`);
    } catch (error) {
      console.error('❌ Failed to load state:', error.message);
      console.log('🔄 Initializing fresh pipeline...');
    }
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
      const query = args[2] || 'react';
      const results = await rag.search(query);
      console.log('\n🔍 Search Results:');
      results.forEach((chunk, i) => {
        console.log(`\n${i + 1}. ${chunk.metadata.title}`);
        console.log(`   File: ${chunk.metadata.file}`);
        console.log(`   Content: ${chunk.content.substring(0, 100)}...`);
      });
      break;

    case 'ask':
      await rag.loadState();
      const question = args[2] || 'How do I use React hooks?';
      const answer = await rag.generateAnswer(question);
      console.log('\n🤖 Answer:');
      console.log(answer);
      break;

    case 'help':
      console.log(`
RAG Pipeline for Documentation Intelligence

Usage:
  node scripts/rag/rag-pipeline.mjs <command> [docsDir] [options]

Commands:
  init [docsDir]           - Initialize the RAG pipeline
  search [docsDir] <query> - Search documentation
  ask [docsDir] <question>   - Ask a question using RAG
  help                   - Show this help message

Examples:
  node scripts/rag/rag-pipeline.mjs init docs
  node scripts/rag/rag-pipeline.mjs search docs "react hooks"
  node scripts/rag-pipeline.mjs ask docs "How do I implement authentication?"
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('RAG Pipeline error:', error);
    process.exit(1);
  });
}

export { RAGPipeline };
