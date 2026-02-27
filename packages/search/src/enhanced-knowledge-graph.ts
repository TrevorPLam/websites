import { z } from 'zod';

/**
 * Enhanced Knowledge Graph with Advanced Relationship Analysis
 * Implements 2026 standards for semantic relationship discovery and analysis
 */

// Knowledge graph entity schemas
export const GraphEntitySchema = z.object({
  id: z.string(),
  type: z.string(),
  properties: z.record(z.any()),
  embeddings: z.array(z.number()).optional(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    source: z.string(),
    confidence: z.number().min(0).max(1)
  })
});

export const GraphRelationshipSchema = z.object({
  id: z.string(),
  fromEntity: z.string(),
  toEntity: z.string(),
  type: z.string(),
  properties: z.record(z.any()),
  weight: z.number().min(0).max(1),
  metadata: z.object({
    createdAt: z.string(),
    source: z.string(),
    confidence: z.number().min(0).max(1)
  })
});

export type GraphEntity = z.infer<typeof GraphEntitySchema>;
export type GraphRelationship = z.infer<typeof GraphRelationshipSchema>;

/**
 * Enhanced Knowledge Graph with advanced relationship analysis
 */
export class EnhancedKnowledgeGraph {
  private entities: Map<string, GraphEntity> = new Map();
  private relationships: Map<string, GraphRelationship> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private analytics: GraphAnalytics = {
    totalEntities: 0,
    totalRelationships: 0,
    averageDegree: 0,
    clusteringCoefficient: 0,
    pathLength: 0
  };

  constructor(private config: KnowledgeGraphConfig = {}) {
    this.initializeGraph();
  }

  /**
   * Add entity to the knowledge graph
   */
  async addEntity(entity: Omit<GraphEntity, 'metadata'>): Promise<GraphEntity> {
    const fullEntity: GraphEntity = {
      ...entity,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: entity.properties.source || 'manual',
        confidence: entity.properties.confidence || 1.0
      }
    };

    this.entities.set(fullEntity.id, fullEntity);
    this.adjacencyList.set(fullEntity.id, new Set());
    
    // Generate embedding if not provided
    if (!fullEntity.embeddings) {
      fullEntity.embeddings = await this.generateEntityEmbedding(fullEntity);
      this.embeddings.set(fullEntity.id, fullEntity.embeddings);
    }

    this.updateAnalytics();
    return fullEntity;
  }

  /**
   * Add relationship to the knowledge graph
   */
  async addRelationship(
    fromEntity: string,
    toEntity: string,
    type: string,
    properties: Record<string, any> = {},
    weight: number = 1.0
  ): Promise<GraphRelationship> {
    const relationshipId = `${fromEntity}-${type}-${toEntity}`;
    
    const relationship: GraphRelationship = {
      id: relationshipId,
      fromEntity,
      toEntity,
      type,
      properties,
      weight,
      metadata: {
        createdAt: new Date().toISOString(),
        source: properties.source || 'manual',
        confidence: properties.confidence || 1.0
      }
    };

    this.relationships.set(relationshipId, relationship);
    
    // Update adjacency list
    if (!this.adjacencyList.has(fromEntity)) {
      this.adjacencyList.set(fromEntity, new Set());
    }
    if (!this.adjacencyList.has(toEntity)) {
      this.adjacencyList.set(toEntity, new Set());
    }
    
    this.adjacencyList.get(fromEntity)!.add(toEntity);
    this.adjacencyList.get(toEntity)!.add(fromEntity);

    this.updateAnalytics();
    return relationship;
  }

  /**
   * Advanced relationship discovery using semantic similarity
   */
  async discoverRelationships(entityId: string, options: RelationshipDiscoveryOptions = {}): Promise<DiscoveredRelationship[]> {
    const entity = this.entities.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }

    const discovered: DiscoveredRelationship[] = [];
    const threshold = options.threshold || 0.7;
    const maxResults = options.maxResults || 50;

    // Find semantically similar entities
    const similarEntities = await this.findSimilarEntities(entityId, threshold, maxResults);
    
    for (const similar of similarEntities) {
      const relationshipType = await this.inferRelationshipType(entity, similar.entity);
      const confidence = this.calculateRelationshipConfidence(entity, similar.entity, relationshipType);
      
      if (confidence >= threshold) {
        discovered.push({
          fromEntity: entityId,
          toEntity: similar.entity.id,
          type: relationshipType,
          confidence,
          evidence: similar.evidence,
          properties: {
            semanticSimilarity: similar.similarity,
            inferredType: relationshipType,
            discoveryMethod: 'semantic_similarity'
          }
        });
      }
    }

    // Discover relationships based on structural patterns
    const structuralRelationships = await this.discoverStructuralRelationships(entityId, options);
    discovered.push(...structuralRelationships);

    // Discover relationships based on temporal patterns
    const temporalRelationships = await this.discoverTemporalRelationships(entityId, options);
    discovered.push(...temporalRelationships);

    // Rank and filter results
    return discovered
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxResults);
  }

  /**
   * Find semantic paths between entities
   */
  async findSemanticPaths(
    fromEntity: string,
    toEntity: string,
    options: PathFindingOptions = {}
  ): Promise<SemanticPath[]> {
    const paths: SemanticPath[] = [];
    const maxDepth = options.maxDepth || 5;
    const maxPaths = options.maxPaths || 10;

    // Use BFS with semantic scoring
    const queue: PathNode[] = [{
      entity: fromEntity,
      path: [fromEntity],
      score: 1.0,
      depth: 0
    }];

    const visited = new Set<string>();

    while (queue.length > 0 && paths.length < maxPaths) {
      const current = queue.shift()!;
      
      if (current.entity === toEntity) {
        paths.push({
          entities: current.path,
          relationships: await this.getPathRelationships(current.path),
          score: current.score,
          length: current.path.length - 1,
          semanticCoherence: await this.calculatePathCoherence(current.path)
        });
        continue;
      }

      if (current.depth >= maxDepth || visited.has(current.entity)) {
        continue;
      }

      visited.add(current.entity);

      // Get neighbors with semantic scoring
      const neighbors = this.getNeighbors(current.entity);
      for (const neighborId of neighbors) {
        const neighbor = this.entities.get(neighborId);
        if (!neighbor || visited.has(neighborId)) continue;

        const relationship = this.getRelationship(current.entity, neighborId);
        const semanticScore = await this.calculateSemanticScore(
          current.entity,
          neighborId,
          relationship?.type || 'related'
        );

        queue.push({
          entity: neighborId,
          path: [...current.path, neighborId],
          score: current.score * semanticScore,
          depth: current.depth + 1
        });
      }

      // Sort queue by score (descending)
      queue.sort((a, b) => b.score - a.score);
    }

    return paths;
  }

  /**
   * Calculate centrality measures for entities
   */
  async calculateCentrality(entityId: string): Promise<CentralityMeasures> {
    const entity = this.entities.get(entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }

    const degree = this.calculateDegreeCentrality(entityId);
    const betweenness = await this.calculateBetweennessCentrality(entityId);
    const closeness = await this.calculateClosenessCentrality(entityId);
    const eigenvector = await this.calculateEigenvectorCentrality(entityId);
    const pagerank = await this.calculatePageRank(entityId);

    return {
      degree,
      betweenness,
      closeness,
      eigenvector,
      pagerank,
      composite: (degree + betweenness + closeness + eigenvector + pagerank) / 5
    };
  }

  /**
   * Detect communities and clusters in the graph
   */
  async detectCommunities(options: CommunityDetectionOptions = {}): Promise<Community[]> {
    const algorithm = options.algorithm || 'louvain';
    const resolution = options.resolution || 1.0;

    switch (algorithm) {
      case 'louvain':
        return this.detectLouvainCommunities(resolution);
      case 'label_propagation':
        return this.detectLabelPropagationCommunities();
      case 'infomap':
        return this.detectInfomapCommunities();
      default:
        throw new Error(`Unknown community detection algorithm: ${algorithm}`);
    }
  }

  /**
   * Perform graph-level analytics
   */
  async performGraphAnalytics(): Promise<GraphAnalytics> {
    const analytics = await this.calculateAdvancedAnalytics();
    
    return {
      ...analytics,
      insights: await this.generateGraphInsights(analytics),
      recommendations: await this.generateGraphRecommendations(analytics)
    };
  }

  /**
   * Export graph in various formats
   */
  async exportGraph(format: 'json' | 'csv' | 'graphml' | 'rdf'): Promise<string> {
    switch (format) {
      case 'json':
        return this.exportAsJSON();
      case 'csv':
        return this.exportAsCSV();
      case 'graphml':
        return this.exportAsGraphML();
      case 'rdf':
        return this.exportAsRDF();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Private helper methods
  private initializeGraph(): void {
    // Initialize with default configuration
    this.config = {
      embeddingModel: 'text-embedding-ada-002',
      similarityThreshold: 0.7,
      maxRelationships: 1000,
      ...this.config
    };
  }

  private async generateEntityEmbedding(entity: GraphEntity): Promise<number[]> {
    // Generate embedding based on entity properties
    const text = this.entityToText(entity);
    return await this.generateEmbedding(text);
  }

  private entityToText(entity: GraphEntity): string {
    const parts = [
      entity.type,
      entity.id,
      JSON.stringify(entity.properties)
    ];
    return parts.join(' ');
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Placeholder for embedding generation
    // Would integrate with OpenAI or other embedding service
    return Array.from({ length: 1536 }, () => Math.random() - 0.5);
  }

  private updateAnalytics(): void {
    this.analytics.totalEntities = this.entities.size;
    this.analytics.totalRelationships = this.relationships.size;
    this.analytics.averageDegree = this.calculateAverageDegree();
    this.analytics.clusteringCoefficient = this.calculateClusteringCoefficient();
    this.analytics.pathLength = this.calculateAveragePathLength();
  }

  private calculateAverageDegree(): number {
    if (this.entities.size === 0) return 0;
    
    let totalDegree = 0;
    for (const entityId of this.entities.keys()) {
      totalDegree += this.getNeighbors(entityId).length;
    }
    
    return totalDegree / this.entities.size;
  }

  private calculateClusteringCoefficient(): number {
    if (this.entities.size === 0) return 0;
    
    let totalCoefficient = 0;
    let validNodes = 0;

    for (const entityId of this.entities.keys()) {
      const neighbors = this.getNeighbors(entityId);
      if (neighbors.length < 2) continue;

      const neighborPairs = this.getNeighborPairs(neighbors);
      const connectedPairs = neighborPairs.filter(([a, b]) => 
        this.hasRelationship(a, b)
      ).length;

      const possiblePairs = (neighbors.length * (neighbors.length - 1)) / 2;
      totalCoefficient += connectedPairs / possiblePairs;
      validNodes++;
    }

    return validNodes > 0 ? totalCoefficient / validNodes : 0;
  }

  private calculateAveragePathLength(): number {
    if (this.entities.size < 2) return 0;
    
    let totalPathLength = 0;
    let pathCount = 0;
    const entities = Array.from(this.entities.keys());

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const path = this.findShortestPath(entities[i], entities[j]);
        if (path && path.length > 0) {
          totalPathLength += path.length - 1;
          pathCount++;
        }
      }
    }

    return pathCount > 0 ? totalPathLength / pathCount : 0;
  }

  private getNeighbors(entityId: string): string[] {
    return Array.from(this.adjacencyList.get(entityId) || new Set());
  }

  private getRelationship(fromEntity: string, toEntity: string): GraphRelationship | undefined {
    for (const relationship of this.relationships.values()) {
      if (relationship.fromEntity === fromEntity && relationship.toEntity === toEntity) {
        return relationship;
      }
    }
    return undefined;
  }

  private hasRelationship(fromEntity: string, toEntity: string): boolean {
    return this.getRelationship(fromEntity, toEntity) !== undefined;
  }

  private getNeighborPairs(neighbors: string[]): [string, string][] {
    const pairs: [string, string][] = [];
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        pairs.push([neighbors[i], neighbors[j]]);
      }
    }
    return pairs;
  }

  private findShortestPath(fromEntity: string, toEntity: string): string[] | null {
    const queue: string[][] = [[fromEntity]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === toEntity) {
        return path;
      }

      if (visited.has(current)) continue;
      visited.add(current);

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      }
    }

    return null;
  }

  private async findSimilarEntities(
    entityId: string,
    threshold: number,
    maxResults: number
  ): Promise<{ entity: GraphEntity; similarity: number; evidence: any[] }[]> {
    const entity = this.entities.get(entityId);
    if (!entity || !entity.embeddings) return [];

    const similar: { entity: GraphEntity; similarity: number; evidence: any[] }[] = [];

    for (const [id, otherEntity] of this.entities) {
      if (id === entityId || !otherEntity.embeddings) continue;

      const similarity = this.cosineSimilarity(entity.embeddings, otherEntity.embeddings);
      if (similarity >= threshold) {
        similar.push({
          entity: otherEntity,
          similarity,
          evidence: [{ type: 'embedding_similarity', value: similarity }]
        });
      }
    }

    return similar
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private async inferRelationshipType(entity1: GraphEntity, entity2: GraphEntity): Promise<string> {
    // Simple rule-based inference - could be enhanced with ML
    if (entity1.type === entity2.type) return 'similar_to';
    if (entity1.type === 'function' && entity2.type === 'class') return 'belongs_to';
    if (entity1.type === 'class' && entity2.type === 'function') return 'contains';
    return 'related_to';
  }

  private calculateRelationshipConfidence(
    entity1: GraphEntity,
    entity2: GraphEntity,
    relationshipType: string
  ): number {
    // Base confidence from entity metadata
    const baseConfidence = (entity1.metadata.confidence + entity2.metadata.confidence) / 2;
    
    // Adjust based on relationship type strength
    const typeStrength = this.getRelationshipTypeStrength(relationshipType);
    
    return Math.min(baseConfidence * typeStrength, 1.0);
  }

  private getRelationshipTypeStrength(type: string): number {
    const strengths: Record<string, number> = {
      'contains': 0.9,
      'belongs_to': 0.9,
      'implements': 0.8,
      'extends': 0.8,
      'depends_on': 0.7,
      'similar_to': 0.6,
      'related_to': 0.5
    };
    return strengths[type] || 0.5;
  }

  private async discoverStructuralRelationships(
    entityId: string,
    options: RelationshipDiscoveryOptions
  ): Promise<DiscoveredRelationship[]> {
    // Placeholder for structural relationship discovery
    return [];
  }

  private async discoverTemporalRelationships(
    entityId: string,
    options: RelationshipDiscoveryOptions
  ): Promise<DiscoveredRelationship[]> {
    // Placeholder for temporal relationship discovery
    return [];
  }

  private async getPathRelationships(path: string[]): Promise<string[]> {
    const relationships: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const relationship = this.getRelationship(path[i], path[i + 1]);
      relationships.push(relationship?.type || 'related');
    }
    return relationships;
  }

  private async calculatePathCoherence(path: string[]): Promise<number> {
    // Calculate how coherent the path is semantically
    let coherence = 1.0;
    
    for (let i = 0; i < path.length - 1; i++) {
      const entity1 = this.entities.get(path[i]);
      const entity2 = this.entities.get(path[i + 1]);
      
      if (entity1?.embeddings && entity2?.embeddings) {
        const similarity = this.cosineSimilarity(entity1.embeddings, entity2.embeddings);
        coherence *= similarity;
      }
    }
    
    return coherence;
  }

  private async calculateSemanticScore(
    fromEntity: string,
    toEntity: string,
    relationshipType: string
  ): Promise<number> {
    const entity1 = this.entities.get(fromEntity);
    const entity2 = this.entities.get(toEntity);
    
    if (!entity1?.embeddings || !entity2?.embeddings) return 0.5;
    
    const semanticSimilarity = this.cosineSimilarity(entity1.embeddings, entity2.embeddings);
    const typeStrength = this.getRelationshipTypeStrength(relationshipType);
    
    return semanticSimilarity * typeStrength;
  }

  private calculateDegreeCentrality(entityId: string): number {
    return this.getNeighbors(entityId).length / (this.entities.size - 1);
  }

  private async calculateBetweennessCentrality(entityId: string): Promise<number> {
    // Simplified betweenness centrality calculation
    let betweenness = 0;
    const entities = Array.from(this.entities.keys());

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const path = this.findShortestPath(entities[i], entities[j]);
        if (path && path.includes(entityId)) {
          betweenness++;
        }
      }
    }

    const totalPairs = (entities.length * (entities.length - 1)) / 2;
    return totalPairs > 0 ? betweenness / totalPairs : 0;
  }

  private async calculateClosenessCentrality(entityId: string): Promise<number> {
    let totalDistance = 0;
    let reachableNodes = 0;
    const entities = Array.from(this.entities.keys());

    for (const otherEntity of entities) {
      if (otherEntity === entityId) continue;
      
      const path = this.findShortestPath(entityId, otherEntity);
      if (path && path.length > 0) {
        totalDistance += path.length - 1;
        reachableNodes++;
      }
    }

    return reachableNodes > 0 ? (reachableNodes - 1) / totalDistance : 0;
  }

  private async calculateEigenvectorCentrality(entityId: string): Promise<number> {
    // Simplified eigenvector centrality
    const neighbors = this.getNeighbors(entityId);
    let score = 0;

    for (const neighborId of neighbors) {
      score += this.getNeighbors(neighborId).length;
    }

    const maxScore = Math.max(...Array.from(this.entities.keys()).map(id => 
      this.getNeighbors(id).length
    ));

    return maxScore > 0 ? score / maxScore : 0;
  }

  private async calculatePageRank(entityId: string): Promise<number> {
    // Simplified PageRank calculation
    const dampingFactor = 0.85;
    const neighbors = this.getNeighbors(entityId);
    
    let rank = (1 - dampingFactor) / this.entities.size;
    
    for (const neighborId of neighbors) {
      const neighborDegree = this.getNeighbors(neighborId).length;
      rank += dampingFactor / neighborDegree;
    }

    return rank;
  }

  private detectLouvainCommunities(resolution: number): Community[] {
    // Placeholder for Louvain community detection
    return [{
      id: 'community_1',
      entities: Array.from(this.entities.keys()),
      modularity: 0.5,
      labels: ['default']
    }];
  }

  private detectLabelPropagationCommunities(): Community[] {
    // Placeholder for label propagation
    return [{
      id: 'community_1',
      entities: Array.from(this.entities.keys()),
      modularity: 0.5,
      labels: ['default']
    }];
  }

  private detectInfomapCommunities(): Community[] {
    // Placeholder for Infomap
    return [{
      id: 'community_1',
      entities: Array.from(this.entities.keys()),
      modularity: 0.5,
      labels: ['default']
    }];
  }

  private async calculateAdvancedAnalytics(): Promise<GraphAnalytics> {
    return {
      ...this.analytics,
      density: this.calculateGraphDensity(),
      assortativity: this.calculateAssortativity(),
      smallWorldness: this.calculateSmallWorldness()
    };
  }

  private calculateGraphDensity(): number {
    const maxEdges = (this.entities.size * (this.entities.size - 1)) / 2;
    return maxEdges > 0 ? this.relationships.size / maxEdges : 0;
  }

  private calculateAssortativity(): number {
    // Placeholder for assortativity calculation
    return 0.1;
  }

  private calculateSmallWorldness(): number {
    // Placeholder for small-world coefficient
    return 1.2;
  }

  private async generateGraphInsights(analytics: GraphAnalytics): Promise<string[]> {
    const insights: string[] = [];
    
    if (analytics.clusteringCoefficient > 0.7) {
      insights.push('High clustering coefficient indicates strong community structure');
    }
    
    if (analytics.averagePathLength < 3) {
      insights.push('Short average path length suggests small-world properties');
    }
    
    if (analytics.density > 0.3) {
      insights.push('High graph density indicates well-connected entities');
    }
    
    return insights;
  }

  private async generateGraphRecommendations(analytics: GraphAnalytics): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (analytics.clusteringCoefficient < 0.3) {
      recommendations.push('Consider adding more relationships to improve clustering');
    }
    
    if (analytics.averagePathLength > 5) {
      recommendations.push('Consider adding bridge entities to reduce path lengths');
    }
    
    return recommendations;
  }

  private async exportAsJSON(): Promise<string> {
    const data = {
      entities: Array.from(this.entities.values()),
      relationships: Array.from(this.relationships.values()),
      analytics: this.analytics
    };
    return JSON.stringify(data, null, 2);
  }

  private async exportAsCSV(): Promise<string> {
    // Simple CSV export for entities
    const headers = 'id,type,properties,createdAt,updatedAt,source,confidence';
    const rows = Array.from(this.entities.values()).map(entity => 
      `${entity.id},${entity.type},"${JSON.stringify(entity.properties)}",${entity.metadata.createdAt},${entity.metadata.updatedAt},${entity.metadata.source},${entity.metadata.confidence}`
    );
    
    return [headers, ...rows].join('\n');
  }

  private async exportAsGraphML(): Promise<string> {
    // Placeholder for GraphML export
    return '<?xml version="1.0" encoding="UTF-8"?><graphml></graphml>';
  }

  private async exportAsRDF(): Promise<string> {
    // Placeholder for RDF export
    return '@prefix : <http://example.org/> .';
  }
}

// Supporting types
export interface KnowledgeGraphConfig {
  embeddingModel?: string;
  similarityThreshold?: number;
  maxRelationships?: number;
}

export interface RelationshipDiscoveryOptions {
  threshold?: number;
  maxResults?: number;
  includeTypes?: string[];
  excludeTypes?: string[];
}

export interface DiscoveredRelationship {
  fromEntity: string;
  toEntity: string;
  type: string;
  confidence: number;
  evidence: any[];
  properties: Record<string, any>;
}

export interface PathFindingOptions {
  maxDepth?: number;
  maxPaths?: number;
  weightProperty?: string;
}

export interface SemanticPath {
  entities: string[];
  relationships: string[];
  score: number;
  length: number;
  semanticCoherence: number;
}

export interface CentralityMeasures {
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  pagerank: number;
  composite: number;
}

export interface CommunityDetectionOptions {
  algorithm?: 'louvain' | 'label_propagation' | 'infomap';
  resolution?: number;
  minCommunitySize?: number;
}

export interface Community {
  id: string;
  entities: string[];
  modularity: number;
  labels: string[];
}

export interface GraphAnalytics {
  totalEntities: number;
  totalRelationships: number;
  averageDegree: number;
  clusteringCoefficient: number;
  pathLength: number;
  density?: number;
  assortativity?: number;
  smallWorldness?: number;
  insights?: string[];
  recommendations?: string[];
}
