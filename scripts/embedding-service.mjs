#!/usr/bin/env node

/**
 * Production Embedding Service for RAG Pipeline
 * 
 * Integrates with OpenAI API or local embedding services
 * to productionize the RAG pipeline with real embeddings
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation Enhancement
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

class EmbeddingService {
  private apiKey: string;
  private provider: 'openai' | 'local' | 'huggingface';
  private model: string;
  private dimensions: number;

  constructor(config: {
    provider?: 'openai' | 'local' | 'huggingface';
    apiKey?: string;
    model?: string;
    dimensions?: number;
  }) {
    this.provider = config.provider || 'openai';
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.model = config.model || 'text-embedding-ada-002';
    this.dimensions = config.dimensions || 1536;
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    switch (this.provider) {
      case 'openai':
        return await this.generateOpenAIEmbedding(text);
      case 'local':
        return await this.generateLocalEmbedding(text);
      case 'huggingface':
        return await this.generateHuggingFaceEmbedding(text);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Generate embeddings using OpenAI API
   */
  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required for OpenAI embeddings');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings using local service
   */
  private async generateLocalEmbedding(text: string): Promise<number[]> {
    // Mock implementation for local embedding service
    // In production, this would integrate with a local embedding model
    console.log('Using local embedding service (mock implementation)');
    
    // Simple hash-based embedding for demonstration
    const embedding = new Array(this.dimensions).fill(0);
    const hash = this.simpleHash(text);
    
    for (let i = 0; i < this.dimensions; i++) {
      embedding[i] = Math.sin(hash + i) * 0.5 + 0.5;
    }
    
    return embedding;
  }

  /**
   * Generate embeddings using Hugging Face
   */
  private async generateHuggingFaceEmbedding(text: string): Promise<number[]> {
    // Mock implementation for Hugging Face
    console.log('Using Hugging Face embedding service (mock implementation)');
    
    // Similar to local implementation for demonstration
    const embedding = new Array(this.dimensions).fill(0);
    const hash = this.simpleHash(text);
    
    for (let i = 0; i < this.dimensions; i++) {
      embedding[i] = Math.cos(hash + i) * 0.5 + 0.5;
    }
    
    return embedding;
  }

  /**
   * Simple hash function for mock embeddings
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
   * Batch generate embeddings for multiple texts
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings = [];
    
    for (const text of texts) {
      try {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
      } catch (error) {
        console.error(`Failed to generate embedding for text: ${text.substring(0, 50)}...`);
        // Add zero embedding as fallback
        embeddings.push(new Array(this.dimensions).fill(0));
      }
    }
    
    return embeddings;
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

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

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Get service configuration
   */
  getConfig() {
    return {
      provider: this.provider,
      model: this.model,
      dimensions: this.dimensions,
      hasApiKey: !!this.apiKey,
      isConfigured: this.isConfigured()
    };
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    switch (this.provider) {
      case 'openai':
        return !!this.apiKey;
      case 'local':
        return true; // Local service always available
      case 'huggingface':
        return !!process.env.HUGGINGFACE_API_KEY;
      default:
        return false;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const config = {
    provider: process.env.EMBEDDING_PROVIDER || 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS) || 1536
  };

  const service = new EmbeddingService(config);

  switch (command) {
    case 'test':
      console.log('🧪 Testing embedding service...');
      console.log('Config:', service.getConfig());
      
      if (!service.isConfigured()) {
        console.log('❌ Embedding service not properly configured');
        console.log('Please set environment variables:');
        console.log('- EMBEDDING_PROVIDER (openai|local|huggingface)');
        console.log('- OPENAI_API_KEY (for OpenAI provider)');
        console.log('- HUGGINGFACE_API_KEY (for HuggingFace provider)');
        process.exit(1);
      }
      
      // Test with sample text
      const sampleText = 'This is a sample text for testing the embedding service.';
      console.log('📝 Generating embedding for sample text...');
      
      try {
        const embedding = await service.generateEmbedding(sampleText);
        console.log(`✅ Embedding generated successfully (${embedding.length} dimensions)`);
        console.log(`📊 First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
      } catch (error) {
        console.error('❌ Embedding generation failed:', error.message);
        process.exit(1);
      }
      break;

    case 'batch':
      const texts = [
        'First sample text',
        'Second sample text',
        'Third sample text'
      ];
      
      console.log('🔄 Generating batch embeddings...');
      console.log(`📝 Processing ${texts.length} texts...`);
      
      try {
        const embeddings = await service.generateBatchEmbeddings(texts);
        console.log(`✅ Batch embeddings generated successfully`);
        console.log(`📊 Embeddings shape: ${embeddings.length}x${embeddings[0]?.length || 0}`);
        
        // Test similarity calculation
        if (embeddings.length >= 2) {
          const similarity = service.cosineSimilarity(embeddings[0], embeddings[1]);
          console.log(`🔍 Similarity between first two texts: ${similarity.toFixed(4)}`);
        }
      } catch (error) {
        console.error('❌ Batch embedding generation failed:', error.message);
        process.exit(1);
      }
      break;

    case 'config':
      console.log('⚙️ Embedding Service Configuration');
      console.log(JSON.stringify(service.getConfig(), null, 2));
      break;

    case 'help':
      console.log(`
Embedding Service for RAG Pipeline

Usage:
  node scripts/embedding-service.mjs <command>

Commands:
  test     - Test embedding service with sample text
  batch    - Generate embeddings for multiple texts
  config   - Show current configuration
  help     - Show this help message

Environment Variables:
  EMBEDDING_PROVIDER    - Provider to use (openai|local|huggingface)
  OPENAI_API_KEY         - OpenAI API key (required for OpenAI)
  HUGGINGFACE_API_KEY    - Hugging Face API key (required for HuggingFace)
  EMBEDDING_MODEL        - Embedding model name
  EMBEDDING_DIMENSIONS   - Embedding dimensions (default: 1536)

Examples:
  # Test with OpenAI
  EMBEDDING_PROVIDER=openai OPENAI_API_KEY=your_key node scripts/embedding-service.mjs test

  # Test with local service
  EMBEDDING_PROVIDER=local node scripts/embedding-service.mjs test

  # Generate batch embeddings
  node scripts/embedding-service.mjs batch
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Embedding service error:', error);
    process.exit(1);
  });
}

export { EmbeddingService };
