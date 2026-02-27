import { 
  CodeChunk, 
  SearchResult, 
  SearchQuery, 
  IndexingOptions,
  VectorDatabase,
  KnowledgeGraph,
  EmbeddingService,
  SearchService
} from "./types";
import { TypeScriptParser } from "./typescript-parser";
import { FaissVectorDatabase } from "./vector-database";
import { Neo4jKnowledgeGraph } from "./knowledge-graph";
import { OpenAIEmbeddingService } from "./embedding-service";
import * as fs from "fs";
import * as path from "path";

export class RepositorySearchService implements SearchService {
  private vectorDatabase: VectorDatabase;
  private knowledgeGraph: KnowledgeGraph;
  private embeddingService: EmbeddingService;
  private parser: TypeScriptParser;
  private chunks: Map<string, CodeChunk> = new Map();

  constructor() {
    this.vectorDatabase = new FaissVectorDatabase();
    this.knowledgeGraph = new Neo4jKnowledgeGraph(
      process.env.NEO4J_URI || "neo4j://localhost:7687",
      process.env.NEO4J_USER || "neo4j",
      process.env.NEO4J_PASSWORD || "password"
    );
    this.embeddingService = new OpenAIEmbeddingService(process.env.OPENAI_API_KEY!);
    this.parser = new TypeScriptParser();
  }

  async indexRepository(options: IndexingOptions): Promise<void> {
    console.log(\`Starting indexing of \${options.src}...\`);
    
    // Parse TypeScript files
    const chunks = this.parser.parseDirectory(options.src, options.filter);
    console.log(\`Found \${chunks.length} code chunks\`);
    
    // Store chunks
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }
    
    // Generate embeddings
    const texts = chunks.map(chunk => this.createSearchText(chunk));
    console.log("Generating embeddings...");
    const embeddings = await this.embeddingService.generateEmbeddings(texts);
    
    // Add to vector database
    console.log("Adding vectors to database...");
    await this.vectorDatabase.addVectors(embeddings);
    
    // Build knowledge graph
    console.log("Building knowledge graph...");
    await this.buildKnowledgeGraph(chunks);
    
    console.log(\`Indexing complete. Indexed \${chunks.length} chunks.\`);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    // Generate query embedding
    const queryEmbedding = await this.embeddingService.generateSingleEmbedding(query.query);
    
    // Search vector database
    const searchResults = await this.vectorDatabase.search(queryEmbedding, query.options?.top || 10);
    
    // Convert to SearchResult objects
    const results: SearchResult[] = [];
    for (let i = 0; i < searchResults.length; i++) {
      const embedding = searchResults[i];
      const chunkId = this.findChunkByEmbedding(embedding);
      
      if (chunkId) {
        const chunk = this.chunks.get(chunkId);
        if (chunk && this.matchesFilters(chunk, query.filters)) {
          const score = this.calculateSimilarity(queryEmbedding, embedding);
          
          if (score >= (query.options?.threshold || 0.5)) {
            results.push({
              id: chunk.id,
              filePath: chunk.filePath,
              startLine: chunk.startLine,
              endLine: chunk.endLine,
              score,
              snippet: this.createSnippet(chunk),
              metadata: chunk.metadata,
              context: query.options?.includeContext 
                ? await this.getContext(chunk) 
                : { before: "", after: "" }
            });
          }
        }
      }
    }
    
    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }

  async reindex(filePath: string): Promise<void> {
    // Remove old chunks for this file
    const oldChunks = Array.from(this.chunks.values())
      .filter(chunk => chunk.filePath === filePath);
    
    for (const chunk of oldChunks) {
      this.chunks.delete(chunk.id);
    }
    
    // Parse file again
    const newChunks = this.parser.parseFile(filePath);
    
    // Add new chunks
    for (const chunk of newChunks) {
      this.chunks.set(chunk.id, chunk);
    }
    
    // Regenerate embeddings for affected chunks
    if (newChunks.length > 0) {
      const texts = newChunks.map(chunk => this.createSearchText(chunk));
      const embeddings = await this.embeddingService.generateEmbeddings(texts);
      
      // Update vector database (simplified - would need more sophisticated approach)
      await this.vectorDatabase.addVectors(embeddings);
    }
  }

  async removeIndex(id: string): Promise<void> {
    this.chunks.delete(id);
    // Would need to remove from vector database and knowledge graph too
  }

  private createSearchText(chunk: CodeChunk): string {
    let text = chunk.content;
    
    // Add metadata to improve search
    if (chunk.metadata.name) {
      text += \` \${chunk.metadata.name}\`;
    }
    
    if (chunk.metadata.description) {
      text += \` \${chunk.metadata.description}\`;
    }
    
    if (chunk.metadata.dependencies) {
      text += \` \${chunk.metadata.dependencies.join(" ")}\`;
    }
    
    return text;
  }

  private async buildKnowledgeGraph(chunks: CodeChunk[]): Promise<void> {
    // Create nodes for each chunk
    for (const chunk of chunks) {
      await this.knowledgeGraph.createNode("CodeChunk", {
        id: chunk.id,
        name: chunk.metadata.name || "",
        type: chunk.type,
        filePath: chunk.filePath,
        startLine: chunk.startLine,
        endLine: chunk.endLine
      });
    }
    
    // Create relationships based on dependencies
    for (const chunk of chunks) {
      if (chunk.metadata.dependencies) {
        for (const dependency of chunk.metadata.dependencies) {
          // Find chunks that might represent this dependency
          const relatedChunks = chunks.filter(c => 
            c.metadata.name === dependency && c.id !== chunk.id
          );
          
          for (const related of relatedChunks) {
            await this.knowledgeGraph.createRelationship(
              chunk.id,
              related.id,
              "DEPENDS_ON"
            );
          }
        }
      }
    }
  }

  private findChunkByEmbedding(embedding: number[]): string | null {
    // Simplified - would need more sophisticated matching
    // For now, return the first chunk that matches
    const chunkIds = Array.from(this.chunks.keys());
    return chunkIds[0] || null;
  }

  private calculateSimilarity(queryEmbedding: number[], chunkEmbedding: number[]): number {
    // Cosine similarity
    const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * chunkEmbedding[i], 0);
    const magnitudeA = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(chunkEmbedding.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private matchesFilters(chunk: CodeChunk, filters?: SearchQuery["filters"]): boolean {
    if (!filters) return true;
    
    // File type filter
    if (filters.fileTypes) {
      const ext = path.extname(chunk.filePath);
      if (!filters.fileTypes.some(type => ext.includes(type))) {
        return false;
      }
    }
    
    // Package filter
    if (filters.packages) {
      const packagePath = chunk.filePath.split("/")[1]; // Assumes packages/package-name structure
      if (!filters.packages.includes(packagePath)) {
        return false;
      }
    }
    
    // Type filter
    if (filters.types && !filters.types.includes(chunk.type)) {
      return false;
    }
    
    return true;
  }

  private createSnippet(chunk: CodeChunk): string {
    const lines = chunk.content.split("\\n");
    const maxLines = 5;
    const start = Math.max(0, lines.length - maxLines);
    
    return lines.slice(start).join("\\n").trim();
  }

  private async getContext(chunk: CodeChunk): Promise<{ before: string; after: string }> {
    // Simplified context extraction
    const fileContent = fs.readFileSync(chunk.filePath, "utf8");
    const lines = fileContent.split("\\n");
    
    const contextLines = 3;
    const before = lines.slice(Math.max(0, chunk.startLine - contextLines - 1), chunk.startLine - 1).join("\\n");
    const after = lines.slice(chunk.endLine, chunk.endLine + contextLines).join("\\n");
    
    return { before, after };
  }
}
