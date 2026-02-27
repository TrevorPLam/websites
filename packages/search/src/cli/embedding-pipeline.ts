import { CodeChunk, EmbeddingService } from "../types";
import { OpenAIEmbeddingService } from "../embedding-service";

export interface EmbeddingProgress {
  totalChunks: number;
  processedChunks: number;
  batchSize: number;
  errors: string[];
  startTime: number;
  currentChunk?: string;
}

export class EmbeddingPipeline {
  private embeddingService: EmbeddingService;
  private progress: EmbeddingProgress;
  private onProgress?: (progress: EmbeddingProgress) => void;

  constructor(apiKey: string, onProgress?: (progress: EmbeddingProgress) => void) {
    this.embeddingService = new OpenAIEmbeddingService(apiKey);
    this.progress = {
      totalChunks: 0,
      processedChunks: 0,
      batchSize: 100,
      errors: [],
      startTime: Date.now()
    };
    this.onProgress = onProgress;
  }

  async generateEmbeddings(chunks: CodeChunk[], batchSize: number = 100): Promise<number[][]> {
    console.log("🧠 Starting embedding generation...");
    
    this.progress.totalChunks = chunks.length;
    this.progress.batchSize = batchSize;
    this.updateProgress();
    
    const embeddings: number[][] = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchEmbeddings = await this.processBatch(batch);
      embeddings.push(...batchEmbeddings);
      
      this.progress.processedChunks = Math.min(i + batchSize, chunks.length);
      this.updateProgress();
    }
    
    console.log(`✅ Embedding generation complete: ${embeddings.length} embeddings`);
    console.log(`⏱️ Duration: ${Date.now() - this.progress.startTime}ms`);
    
    if (this.progress.errors.length > 0) {
      console.log(`⚠️ Errors: ${this.progress.errors.length}`);
      this.progress.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    return embeddings;
  }

  private async processBatch(chunks: CodeChunk[]): Promise<number[][]> {
    const texts = chunks.map(chunk => this.createSearchText(chunk));
    
    try {
      this.progress.currentChunk = chunks[0]?.id;
      this.updateProgress();
      
      const embeddings = await this.embeddingService.generateEmbeddings(texts);
      return embeddings;
    } catch (error) {
      const errorMsg = `Failed to generate embeddings for batch: ${error}`;
      this.progress.errors.push(errorMsg);
      console.warn(`⚠️ ${errorMsg}`);
      
      // Return empty embeddings for failed batch
      return new Array(chunks.length).fill(null).map(() => new Array(3072).fill(0));
    }
  }

  private createSearchText(chunk: CodeChunk): string {
    let text = chunk.content;
    
    // Add metadata to improve search
    if (chunk.metadata.name) {
      text += ` ${chunk.metadata.name}`;
    }
    
    if (chunk.metadata.description) {
      text += ` ${chunk.metadata.description}`;
    }
    
    if (chunk.metadata.dependencies) {
      text += ` ${chunk.metadata.dependencies.join(" ")}`;
    }
    
    return text;
  }

  private updateProgress(): void {
    if (this.onProgress) {
      this.onProgress({ ...this.progress });
    }
  }
}
