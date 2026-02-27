import { 
  CodeChunk, 
  SearchResult, 
  SearchQuery, 
  IndexingOptions,
  VectorDatabase,
  KnowledgeGraph,
  EmbeddingService,
  SearchService,
  AdvancedSearchOptions,
  SemanticSearchResult,
  SearchAnalytics
} from "./types";
import { TypeScriptParser } from "./typescript-parser";
import { FaissVectorDatabase } from "./vector-database";
import { Neo4jKnowledgeGraph } from "./knowledge-graph";
import { OpenAIEmbeddingService } from "./embedding-service";
import * as fs from "fs";
import * as path from "path";

/**
 * Advanced Deep Search Service with 2026 semantic algorithms
 * Implements hybrid search, reranking, and contextual understanding
 */
export class AdvancedDeepSearchService implements SearchService {
  private vectorDatabase: VectorDatabase;
  private knowledgeGraph: KnowledgeGraph;
  private embeddingService: EmbeddingService;
  private parser: TypeScriptParser;
  private chunks: Map<string, CodeChunk> = new Map();
  private semanticCache: Map<string, SemanticSearchResult[]> = new Map();
  private analytics: SearchAnalytics = {
    totalQueries: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    topQueries: new Map()
  };

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

  /**
   * Advanced semantic search with multiple algorithms
   */
  async deepSearch(query: string, options: AdvancedSearchOptions = {}): Promise<SemanticSearchResult[]> {
    const startTime = Date.now();
    this.analytics.totalQueries++;

    // Check cache first
    const cacheKey = this.createCacheKey(query, options);
    if (this.semanticCache.has(cacheKey)) {
      this.analytics.cacheHitRate = (this.analytics.cacheHitRate * (this.analytics.totalQueries - 1) + 1) / this.analytics.totalQueries;
      return this.semanticCache.get(cacheKey)!;
    }

    // 1. Multi-stage semantic search
    const initialResults = await this.performSemanticSearch(query, options);
    
    // 2. Hybrid reranking with multiple algorithms
    const rerankedResults = await this.hybridRerank(query, initialResults, options);
    
    // 3. Contextual enhancement
    const enhancedResults = await this.enhanceWithContext(rerankedResults, options);
    
    // 4. Knowledge graph integration
    const finalResults = await this.integrateKnowledgeGraph(enhancedResults, query);
    
    // 5. Apply diversity and novelty scoring
    const diversifiedResults = this.applyDiversityScoring(finalResults, options);

    // Cache results
    this.semanticCache.set(cacheKey, diversifiedResults);
    
    // Update analytics
    const responseTime = Date.now() - startTime;
    this.analytics.averageResponseTime = 
      (this.analytics.averageResponseTime * (this.analytics.totalQueries - 1) + responseTime) / this.analytics.totalQueries;
    
    // Track query frequency
    const queryCount = this.analytics.topQueries.get(query) || 0;
    this.analytics.topQueries.set(query, queryCount + 1);

    return diversifiedResults;
  }

  /**
   * Multi-stage semantic search with different embedding strategies
   */
  private async performSemanticSearch(query: string, options: AdvancedSearchOptions): Promise<SearchResult[]> {
    const strategies = [
      this.createTextualEmbedding(query),
      this.createStructuralEmbedding(query),
      this.createSemanticEmbedding(query)
    ];

    const allResults: SearchResult[] = [];
    
    for (const strategy of strategies) {
      const results = await this.searchWithStrategy(strategy, options);
      allResults.push(...results);
    }

    // Remove duplicates and merge scores
    return this.mergeResults(allResults);
  }

  /**
   * Hybrid reranking with multiple algorithms
   */
  private async hybridRerank(query: string, results: SearchResult[], options: AdvancedSearchOptions): Promise<SearchResult[]> {
    const rerankingAlgorithms = [
      this.cosineSimilarityReranking.bind(this),
      this.bm25Reranking.bind(this),
      this.neuralReranking.bind(this),
      this.graphBasedReranking.bind(this)
    ];

    const rerankedResults = results.map(result => ({
      ...result,
      rerankScores: {} as Record<string, number>
    }));

    // Apply each reranking algorithm
    for (const algorithm of rerankingAlgorithms) {
      const scores = await algorithm(query, rerankedResults);
      scores.forEach((score, index) => {
        rerankedResults[index].rerankScores![algorithm.name] = score;
      });
    }

    // Combine scores with weighted average
    const weights = options.rerankWeights || {
      cosine: 0.3,
      bm25: 0.2,
      neural: 0.3,
      graph: 0.2
    };

    return rerankedResults
      .map(result => ({
        ...result,
        score: Object.entries(result.rerankScores!).reduce(
          (sum, [algorithm, score]) => sum + score * (weights[algorithm] || 0),
          0
        )
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Contextual enhancement with surrounding code analysis
   */
  private async enhanceWithContext(results: SearchResult[], options: AdvancedSearchOptions): Promise<SearchResult[]> {
    return Promise.all(results.map(async result => {
      const chunk = this.chunks.get(result.id);
      if (!chunk) return result;

      // Extract broader context
      const context = await this.extractBroaderContext(chunk, options.contextRadius || 5);
      
      // Analyze code patterns
      const patterns = this.analyzeCodePatterns(chunk, context);
      
      // Extract semantic features
      const features = await this.extractSemanticFeatures(chunk, context);

      return {
        ...result,
        context: {
          before: context.before,
          after: context.after,
          patterns,
          features,
          semanticSummary: this.generateSemanticSummary(chunk, context)
        }
      };
    }));
  }

  /**
   * Knowledge graph integration for relationship-based enhancement
   */
  private async integrateKnowledgeGraph(results: SearchResult[], query: string): Promise<SearchResult[]> {
    return Promise.all(results.map(async result => {
      const chunk = this.chunks.get(result.id);
      if (!chunk) return result;

      // Get related entities from knowledge graph
      const relatedEntities = await this.knowledgeGraph.getRelatedEntities(result.id, 2);
      
      // Calculate relationship scores
      const relationshipScore = this.calculateRelationshipScore(relatedEntities, query);
      
      // Get path information
      const semanticPaths = await this.knowledgeGraph.findSemanticPaths(result.id, query);

      return {
        ...result,
        knowledgeGraph: {
          relatedEntities,
          relationshipScore,
          semanticPaths,
          graphCentrality: await this.knowledgeGraph.calculateCentrality(result.id)
        }
      };
    }));
  }

  /**
   * Apply diversity and novelty scoring
   */
  private applyDiversityScoring(results: SearchResult[], options: AdvancedSearchOptions): SemanticSearchResult[] {
    const diversityThreshold = options.diversityThreshold || 0.7;
    const finalResults: SemanticSearchResult[] = [];
    
    for (const result of results) {
      // Calculate diversity score against already selected results
      const diversityScore = this.calculateDiversityScore(result, finalResults);
      
      // Calculate novelty score
      const noveltyScore = this.calculateNoveltyScore(result);
      
      const semanticResult: SemanticSearchResult = {
        ...result,
        diversityScore,
        noveltyScore,
        finalScore: result.score * 0.6 + diversityScore * 0.2 + noveltyScore * 0.2
      };

      // Add if diverse enough or if we need more results
      if (diversityScore >= diversityThreshold || finalResults.length < (options.maxResults || 10)) {
        finalResults.push(semanticResult);
      }
    }

    return finalResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, options.maxResults || 10);
  }

  /**
   * Different embedding strategies for comprehensive search
   */
  private createTextualEmbedding(query: string): string {
    return query; // Pure text search
  }

  private createStructuralEmbedding(query: string): string {
    // Extract structural patterns (function names, class names, etc.)
    const structuralPatterns = query.match(/[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g) || [];
    return structuralPatterns.join(' ');
  }

  private createSemanticEmbedding(query: string): string {
    // Enhanced semantic understanding with context
    return `${query} ${this.inferIntent(query)}`;
  }

  private inferIntent(query: string): string {
    // Simple intent inference - could be enhanced with ML
    if (query.includes('function') || query.includes('method')) return 'code_function';
    if (query.includes('class') || query.includes('interface')) return 'code_structure';
    if (query.includes('import') || query.includes('export')) return 'code_module';
    if (query.includes('error') || query.includes('bug')) return 'code_issue';
    return 'general_search';
  }

  /**
   * Reranking algorithms
   */
  private async cosineSimilarityReranking(query: string, results: SearchResult[]): Promise<number[]> {
    const queryEmbedding = await this.embeddingService.generateSingleEmbedding(query);
    
    return results.map(result => {
      const chunk = this.chunks.get(result.id);
      if (!chunk) return result.score;
      
      // Recalculate with more sophisticated similarity
      return this.calculateAdvancedSimilarity(queryEmbedding, chunk);
    });
  }

  private async bm25Reranking(query: string, results: SearchResult[]): Promise<number[]> {
    // BM25 algorithm implementation
    const k1 = 1.2;
    const b = 0.75;
    
    return results.map(result => {
      const chunk = this.chunks.get(result.id);
      if (!chunk) return result.score;
      
      const document = chunk.content.toLowerCase();
      const terms = query.toLowerCase().split(/\s+/);
      
      let score = 0;
      for (const term of terms) {
        const tf = this.calculateTermFrequency(term, document);
        const idf = this.calculateInverseDocumentFrequency(term);
        score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (document.length / this.getAverageDocumentLength())));
      }
      
      return score;
    });
  }

  private async neuralReranking(query: string, results: SearchResult[]): Promise<number[]> {
    // Placeholder for neural reranking - would integrate with a neural model
    return results.map(() => Math.random()); // Simplified
  }

  private async graphBasedReranking(query: string, results: SearchResult[]): Promise<number[]> {
    // Graph-based reranking using knowledge graph
    return Promise.all(results.map(async result => {
      const centrality = await this.knowledgeGraph.calculateCentrality(result.id);
      const relatedness = await this.calculateQueryRelatedness(result.id, query);
      return centrality * 0.6 + relatedness * 0.4;
    }));
  }

  /**
   * Helper methods
   */
  private async searchWithStrategy(strategy: string, options: AdvancedSearchOptions): Promise<SearchResult[]> {
    const queryEmbedding = await this.embeddingService.generateSingleEmbedding(strategy);
    return this.vectorDatabase.search(queryEmbedding, options.top || 20)
      .map(embedding => {
        const chunkId = this.findChunkByEmbedding(embedding);
        const chunk = chunkId ? this.chunks.get(chunkId) : null;
        return chunk ? this.mapChunkToSearchResult(chunk, 0.8) : null;
      })
      .filter(Boolean) as SearchResult[];
  }

  private mergeResults(results: SearchResult[]): SearchResult[] {
    const merged = new Map<string, SearchResult>();
    
    for (const result of results) {
      const existing = merged.get(result.id);
      if (existing) {
        // Merge scores
        existing.score = Math.max(existing.score, result.score);
        existing.rerankScores = { ...existing.rerankScores, ...result.rerankScores };
      } else {
        merged.set(result.id, result);
      }
    }
    
    return Array.from(merged.values());
  }

  private calculateAdvancedSimilarity(queryEmbedding: number[], chunk: CodeChunk): number {
    // Enhanced similarity calculation
    const chunkEmbedding = this.getChunkEmbedding(chunk);
    if (!chunkEmbedding) return 0;

    // Multiple similarity metrics
    const cosineSimilarity = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
    const euclideanSimilarity = this.euclideanSimilarity(queryEmbedding, chunkEmbedding);
    const manhattanSimilarity = this.manhattanSimilarity(queryEmbedding, chunkEmbedding);

    // Weighted combination
    return cosineSimilarity * 0.6 + euclideanSimilarity * 0.2 + manhattanSimilarity * 0.2;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private euclideanSimilarity(a: number[], b: number[]): number {
    const distance = Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
    return 1 / (1 + distance);
  }

  private manhattanSimilarity(a: number[], b: number[]): number {
    const distance = a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0);
    return 1 / (1 + distance);
  }

  private calculateTermFrequency(term: string, document: string): number {
    const count = document.split(term).length - 1;
    return count / document.split(/\s+/).length;
  }

  private calculateInverseDocumentFrequency(term: string): number {
    // Simplified IDF - would use actual document corpus
    return Math.log(1 + 1 / 1); // Assuming term appears in at least one document
  }

  private getAverageDocumentLength(): number {
    // Simplified - would calculate from actual corpus
    return 100;
  }

  private async extractBroaderContext(chunk: CodeChunk, radius: number): Promise<{ before: string; after: string }> {
    const fileContent = fs.readFileSync(chunk.filePath, "utf8");
    const lines = fileContent.split("\n");
    
    const before = lines.slice(Math.max(0, chunk.startLine - radius - 1), chunk.startLine - 1).join("\n");
    const after = lines.slice(chunk.endLine, chunk.endLine + radius).join("\n");
    
    return { before, after };
  }

  private analyzeCodePatterns(chunk: CodeChunk, context: { before: string; after: string }): string[] {
    const fullContext = context.before + chunk.content + context.after;
    const patterns: string[] = [];

    // Detect common patterns
    if (fullContext.includes('async')) patterns.push('async_pattern');
    if (fullContext.includes('try') && fullContext.includes('catch')) patterns.push('error_handling');
    if (fullContext.includes('interface') || fullContext.includes('type')) patterns.push('type_definition');
    if (fullContext.includes('import') || fullContext.includes('require')) patterns.push('module_import');

    return patterns;
  }

  private async extractSemanticFeatures(chunk: CodeChunk, context: { before: string; after: string }): Promise<string[]> {
    // Placeholder for semantic feature extraction
    // Would integrate with NLP models for better understanding
    return ['function_definition', 'business_logic', 'data_processing'];
  }

  private generateSemanticSummary(chunk: CodeChunk, context: { before: string; after: string }): string {
    // Generate a concise summary of the code's purpose
    const lines = chunk.content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    
    const firstLine = lines[0];
    if (firstLine.includes('function') || firstLine.includes('const')) {
      return firstLine.split('=')[0].trim();
    }
    
    return `Code block at ${chunk.filePath}:${chunk.startLine}`;
  }

  private calculateRelationshipScore(relatedEntities: any[], query: string): number {
    // Calculate how related the entities are to the query
    if (relatedEntities.length === 0) return 0;
    
    const queryTerms = query.toLowerCase().split(/\s+/);
    let score = 0;
    
    for (const entity of relatedEntities) {
      for (const term of queryTerms) {
        if (entity.name?.toLowerCase().includes(term)) {
          score += entity.weight || 1;
        }
      }
    }
    
    return Math.min(score / relatedEntities.length, 1);
  }

  private async calculateQueryRelatedness(chunkId: string, query: string): Promise<number> {
    // Calculate how related this chunk is to the query based on graph connections
    const relatedChunks = await this.knowledgeGraph.getRelatedEntities(chunkId, 3);
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    let relatedness = 0;
    for (const chunk of relatedChunks) {
      for (const term of queryTerms) {
        if (chunk.name?.toLowerCase().includes(term)) {
          relatedness += chunk.weight || 1;
        }
      }
    }
    
    return Math.min(relatedness / 3, 1);
  }

  private calculateDiversityScore(result: SearchResult, existingResults: SemanticSearchResult[]): number {
    if (existingResults.length === 0) return 1;

    let minSimilarity = 1;
    for (const existing of existingResults) {
      const similarity = this.calculateResultSimilarity(result, existing);
      minSimilarity = Math.min(minSimilarity, similarity);
    }
    
    return 1 - minSimilarity;
  }

  private calculateResultSimilarity(result1: SearchResult, result2: SemanticSearchResult): number {
    // Calculate similarity between two results
    if (result1.filePath === result2.filePath) {
      // Same file - calculate line distance
      const distance = Math.abs(result1.startLine - result2.startLine);
      return Math.max(0, 1 - distance / 50); // Normalize by 50 lines
    }
    
    // Different files - check package similarity
    const package1 = result1.filePath.split('/')[1] || '';
    const package2 = result2.filePath.split('/')[1] || '';
    
    return package1 === package2 ? 0.5 : 0.1;
  }

  private calculateNoveltyScore(result: SearchResult): number {
    // Calculate how novel this result is based on usage patterns
    // Simplified - would use actual analytics data
    return Math.random() * 0.5 + 0.5; // Random between 0.5 and 1.0
  }

  private createCacheKey(query: string, options: AdvancedSearchOptions): string {
    return `${query}:${JSON.stringify(options)}`;
  }

  private getChunkEmbedding(chunk: CodeChunk): number[] | null {
    // Retrieve cached embedding for chunk
    // Simplified - would use actual embedding cache
    return null;
  }

  private findChunkByEmbedding(embedding: number[]): string | null {
    // Simplified - would use proper vector database lookup
    const chunkIds = Array.from(this.chunks.keys());
    return chunkIds[0] || null;
  }

  private mapChunkToSearchResult(chunk: CodeChunk, score: number): SearchResult {
    return {
      id: chunk.id,
      filePath: chunk.filePath,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      score,
      snippet: this.createSnippet(chunk),
      metadata: chunk.metadata,
      context: { before: "", after: "" }
    };
  }

  private createSnippet(chunk: CodeChunk): string {
    const lines = chunk.content.split("\n");
    const maxLines = 5;
    const start = Math.max(0, lines.length - maxLines);
    
    return lines.slice(start).join("\n").trim();
  }

  // Interface implementation
  async indexRepository(options: IndexingOptions): Promise<void> {
    console.log(`Starting indexing of ${options.src}...`);
    
    const chunks = this.parser.parseDirectory(options.src, options.filter);
    console.log(`Found ${chunks.length} code chunks`);
    
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }
    
    const texts = chunks.map(chunk => this.createSearchText(chunk));
    console.log("Generating embeddings...");
    const embeddings = await this.embeddingService.generateEmbeddings(texts);
    
    console.log("Adding vectors to database...");
    await this.vectorDatabase.addVectors(embeddings);
    
    console.log("Building knowledge graph...");
    await this.buildKnowledgeGraph(chunks);
    
    console.log(`Indexing complete. Indexed ${chunks.length} chunks.`);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const semanticResults = await this.deepSearch(query.query, {
      maxResults: query.options?.top || 10,
      diversityThreshold: 0.7
    });
    
    return semanticResults.map(result => ({
      id: result.id,
      filePath: result.filePath,
      startLine: result.startLine,
      endLine: result.endLine,
      score: result.score,
      snippet: result.snippet,
      metadata: result.metadata,
      context: result.context
    }));
  }

  async reindex(filePath: string): Promise<void> {
    // Clear cache for this file
    this.semanticCache.clear();
    
    const oldChunks = Array.from(this.chunks.values())
      .filter(chunk => chunk.filePath === filePath);
    
    for (const chunk of oldChunks) {
      this.chunks.delete(chunk.id);
    }
    
    const newChunks = this.parser.parseFile(filePath);
    
    for (const chunk of newChunks) {
      this.chunks.set(chunk.id, chunk);
    }
    
    if (newChunks.length > 0) {
      const texts = newChunks.map(chunk => this.createSearchText(chunk));
      const embeddings = await this.embeddingService.generateEmbeddings(texts);
      await this.vectorDatabase.addVectors(embeddings);
    }
  }

  async removeIndex(id: string): Promise<void> {
    this.chunks.delete(id);
    this.semanticCache.clear();
  }

  private createSearchText(chunk: CodeChunk): string {
    let text = chunk.content;
    
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

  private async buildKnowledgeGraph(chunks: CodeChunk[]): Promise<void> {
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
    
    for (const chunk of chunks) {
      if (chunk.metadata.dependencies) {
        for (const dependency of chunk.metadata.dependencies) {
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

  /**
   * Get search analytics
   */
  getAnalytics(): SearchAnalytics {
    return { ...this.analytics };
  }

  /**
   * Clear cache and reset analytics
   */
  clearCache(): void {
    this.semanticCache.clear();
    this.analytics = {
      totalQueries: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      topQueries: new Map()
    };
  }
}
