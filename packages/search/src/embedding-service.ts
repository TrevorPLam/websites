import OpenAI from "openai";
import { EmbeddingService } from "./types";

export class OpenAIEmbeddingService implements EmbeddingService {
  private openai: OpenAI;
  private batchSize = 100;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-large",
        input: batch
      });
      
      embeddings.push(...response.data.map(d => d.embedding));
    }
    
    return embeddings;
  }

  async generateSingleEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text
    });
    
    return response.data[0].embedding;
  }

  async generateEmbeddingsWithRetry(texts: string[], maxRetries: number = 3): Promise<number[][]> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateEmbeddings(texts);
      } catch (error) {
        lastError = error as Error;
        console.warn(\`Embedding generation attempt \${attempt + 1} failed:\`, error);
        
        if (attempt < maxRetries - 1) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}
