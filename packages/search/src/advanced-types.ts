// Import base types for extension
import type { EmbeddingService, KnowledgeGraph, SearchResult, VectorDatabase } from "./types";

/**
 * Advanced search options for deep semantic search
 */
export interface AdvancedSearchOptions {
  maxResults?: number;
  diversityThreshold?: number;
  contextRadius?: number;
  rerankWeights?: {
    cosine?: number;
    bm25?: number;
    neural?: number;
    graph?: number;
  };
  includeContext?: boolean;
  enableCache?: boolean;
}

/**
 * Enhanced search result with additional semantic information
 */
export interface SemanticSearchResult extends Omit<SearchResult, 'context'> {
  diversityScore: number;
  noveltyScore: number;
  finalScore: number;
  context?: {
    before: string;
    after: string;
    patterns: string[];
    features: string[];
    semanticSummary: string;
  };
  knowledgeGraph?: {
    relatedEntities: any[];
    relationshipScore: number;
    semanticPaths: any[];
    graphCentrality: number;
  };
  rerankScores?: Record<string, number>;
}

/**
 * Search analytics for monitoring and optimization
 */
export interface SearchAnalytics {
  totalQueries: number;
  averageResponseTime: number;
  cacheHitRate: number;
  topQueries: Map<string, number>;
}

/**
 * Enhanced embedding service with multiple model support
 */
export interface EnhancedEmbeddingService extends EmbeddingService {
  generateMultiModalEmbedding(text: string, metadata?: any): Promise<number[]>;
  generateCodeAwareEmbedding(code: string, language: string): Promise<number[]>;
  generateContextualEmbedding(text: string, context: string): Promise<number[]>;
}

/**
 * Advanced vector database with hybrid search capabilities
 */
export interface AdvancedVectorDatabase extends VectorDatabase {
  hybridSearch(queryEmbedding: number[], filters?: any): Promise<SearchResult[]>;
  approximateNearestNeighbor(embedding: number[], k: number): Promise<SearchResult[]>;
  rangeSearch(embedding: number[], radius: number): Promise<SearchResult[]>;
}

/**
 * Enhanced knowledge graph with semantic relationships
 */
export interface EnhancedKnowledgeGraph extends KnowledgeGraph {
  getRelatedEntities(entityId: string, depth: number): Promise<any[]>;
  findSemanticPaths(fromId: string, toQuery: string): Promise<any[]>;
  calculateCentrality(entityId: string): Promise<number>;
  createSemanticRelationship(from: string, to: string, type: string, weight: number): Promise<void>;
}

/**
 * Search result clustering for better organization
 */
export interface SearchCluster {
  id: string;
  name: string;
  results: SemanticSearchResult[];
  centroid: number[];
  coherence: number;
}

/**
 * Query understanding and expansion
 */
export interface QueryExpansion {
  originalQuery: string;
  expandedTerms: string[];
  synonyms: string[];
  relatedConcepts: string[];
  intent: string;
  entities: any[];
}

/**
 * Search performance metrics
 */
export interface SearchMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  meanReciprocalRank: number;
  normalizedDiscountedCumulativeGain: number;
}

/**
 * Real-time search suggestions
 */
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'entity' | 'pattern' | 'file';
  score: number;
  metadata?: any;
}

/**
 * Search explanation and interpretability
 */
export interface SearchExplanation {
  resultId: string;
  relevanceFactors: {
    textualSimilarity: number;
    structuralSimilarity: number;
    semanticSimilarity: number;
    graphProximity: number;
    userFeedback: number;
  };
  explanation: string;
  confidence: number;
}

/**
 * Advanced search configuration
 */
export interface AdvancedSearchConfig {
  embeddingModels: {
    textual: string;
    code: string;
    multimodal: string;
  };
  reranking: {
    algorithms: string[];
    weights: Record<string, number>;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  analytics: {
    enabled: boolean;
    retentionDays: number;
    aggregationInterval: number;
  };
  performance: {
    maxConcurrency: number;
    timeout: number;
    batchSize: number;
  };
}

/**
 * Search A/B testing configuration
 */
export interface SearchABTest {
  id: string;
  name: string;
  description: string;
  variants: {
    control: AdvancedSearchConfig;
    treatment: AdvancedSearchConfig;
  };
  trafficSplit: number;
  metrics: string[];
  startDate: Date;
  endDate?: Date;
}

/**
 * Search personalization
 */
export interface SearchPersonalization {
  userId: string;
  preferences: {
    fileTypes: string[];
    packages: string[];
    codePatterns: string[];
    resultTypes: string[];
  };
  history: {
    queries: string[];
    clickedResults: string[];
    feedback: Array<{
      resultId: string;
      rating: number;
      timestamp: Date;
    }>;
  };
  embeddings: number[];
}

/**
 * Search quality assurance
 */
export interface SearchQA {
  testQueries: Array<{
    query: string;
    expectedResults: string[];
    minScore: number;
  }>;
  qualityThresholds: {
    precision: number;
    recall: number;
    responseTime: number;
  };
  evaluationSchedule: string;
}


