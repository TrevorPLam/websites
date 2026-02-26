/**
 * @file agent-memory/src/index.ts
 * @summary Enhanced memory system with confidence scoring and priority-based retrieval.
 * @description 2026 standards-compliant memory management with multi-factor scoring and diversity selection.
 * @security none
 * @requirements 2026-agentic-coding, memory-systems
 */
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Enhanced Memory System Types with 2026 Standards
export interface Episode {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  context: Record<string, any>;
  outcome: 'success' | 'failure' | 'partial';
  metadata: {
    environment: string;
    conditions: string[];
    duration: number;
    tags: string[];
    confidence: number; // 2026: Add confidence scoring
    priority: 'low' | 'medium' | 'high'; // 2026: Priority-based retrieval
    consolidationCount: number; // 2026: Track consolidation attempts
  };
  embeddings?: number[]; // 2026: Vector embeddings for semantic search
  hashId: string; // 2026: Content-addressed storage
}

export interface SemanticKnowledge {
  entity: string;
  relationships: Array<{
    target: string;
    type: 'is_a' | 'part_of' | 'related_to' | 'causes' | 'requires' | 'enables'; // 2026: Extended relationship types
    confidence: number;
    temporal?: 'past' | 'present' | 'future'; // 2026: Temporal relationships
    strength: number; // 2026: Relationship strength for ranking
  }>;
  attributes: Record<string, any>;
  source: string;
  lastUpdated: Date;
  accessCount: number; // 2026: Usage tracking for optimization
  lastAccessed: Date; // 2026: Access patterns
  verificationStatus: 'verified' | 'pending' | 'deprecated'; // 2026: Knowledge verification
}

export interface Procedure {
  id: string;
  name: string;
  steps: ProcedureStep[];
  triggers: string[];
  successRate: number;
  averageDuration: number;
  lastExecuted: Date;
  automationLevel: 'manual' | 'assisted' | 'automatic'; // 2026: Automation levels
  complexity: 'simple' | 'moderate' | 'complex'; // 2026: Complexity classification
  dependencies: string[]; // 2026: Procedure dependencies
  version: string; // 2026: Version tracking
  rollbackProcedure?: string; // 2026: Rollback capability
}

export interface ProcedureStep {
  action: string;
  parameters: Record<string, any>;
  conditions: string[];
  fallback?: string;
  timeout: number;
  retryPolicy: { // 2026: Structured retry policies
    maxAttempts: number;
    backoffStrategy: 'exponential' | 'linear' | 'immediate';
    retryConditions: string[];
  };
  monitoring?: { // 2026: Step-level monitoring
    metrics: string[];
    alerts: string[];
  };
  parallelizable: boolean; // 2026: Parallel execution support
}

// Enhanced Episodic Memory System with 2026 Best Practices
export class EpisodicMemory {
  private episodes: Map<string, Episode> = new Map();
  private vectorIndex: Map<string, string[]> = new Map();
  private consolidationQueue: Episode[] = []; // 2026: Consolidation pipeline
  private accessPatterns: Map<string, number> = new Map(); // 2026: Access tracking

  /**
   * Store a new episode with confidence scoring and content-addressed storage
   * @param episode - Episode data without ID and hashId
   * @returns Generated episode ID
   */
  async storeEpisode(episode: Omit<Episode, 'id' | 'hashId'>): Promise<string> {
    const id = uuidv4();
    const hashId = this.generateHashId(episode); // 2026: Content-addressed ID
    const fullEpisode: Episode = {
      ...episode,
      id,
      hashId,
      metadata: {
        ...episode.metadata,
        confidence: episode.metadata.confidence ?? 0.8, // 2026: Default confidence
        priority: episode.metadata.priority ?? 'medium',
        consolidationCount: 0
      }
    };

    this.episodes.set(id, fullEpisode);

    // Enhanced vector indexing with semantic search
    const searchText = this.createSearchText(fullEpisode);
    const keywords = this.extractKeywords(searchText);

    keywords.forEach(keyword => {
      if (!this.vectorIndex.has(keyword)) {
        this.vectorIndex.set(keyword, []);
      }
      this.vectorIndex.get(keyword)!.push(id);
    });

    // 2026: Track access patterns
    this.accessPatterns.set(id, 0);

    return id;
  }

  /**
   * Retrieve similar episodes based on context with multi-factor scoring and diversity selection
   * @param context - Search context for finding similar episodes
   * @param limit - Maximum number of episodes to return
   * @returns Array of similar episodes ranked by relevance and diversity
   */
  async retrieveSimilarEpisodes(context: string, limit: number = 5): Promise<Episode[]> {
    const keywords = this.extractKeywords(context);
    const episodeScores = new Map<string, number>();

    // Enhanced scoring with 2026 ranking algorithms
    keywords.forEach(keyword => {
      const episodeIds = this.vectorIndex.get(keyword) || [];
      episodeIds.forEach(id => {
        const currentScore = episodeScores.get(id) || 0;
        const episode = this.episodes.get(id)!;

        // 2026: Multi-factor scoring
        const priorityBonus = this.getPriorityBonus(episode.metadata.priority);
        const confidenceBonus = episode.metadata.confidence * 0.2;
        const recencyBonus = this.getRecencyBonus(episode.timestamp);

        episodeScores.set(id, currentScore + 1 + priorityBonus + confidenceBonus + recencyBonus);
      });
    });

    // Sort by score and return top episodes with diversity
    const sortedEpisodes = Array.from(episodeScores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit * 2) // Get more for diversity selection
      .map(([id]) => this.episodes.get(id)!);

    // 2026: Ensure diversity in results
    return this.ensureDiversity(sortedEpisodes, limit);
  }

  async getEpisode(id: string): Promise<Episode | null> {
    const episode = this.episodes.get(id) || null;
    if (episode) {
      // 2026: Track access patterns
      const currentCount = this.accessPatterns.get(id) || 0;
      this.accessPatterns.set(id, currentCount + 1);

      // Update last accessed if it's a semantic knowledge entry
      if ('lastAccessed' in episode) {
        episode.lastAccessed = new Date();
      }
    }
    return episode;
  }

  async updateEpisode(id: string, updates: Partial<Episode>): Promise<boolean> {
    const episode = this.episodes.get(id);
    if (!episode) return false;

    const updatedEpisode = { ...episode, ...updates };
    this.episodes.set(id, updatedEpisode);
    return true;
  }

  async deleteEpisode(id: string): Promise<boolean> {
    const episode = this.episodes.get(id);
    if (!episode) return false;

    this.episodes.delete(id);

    // Remove from vector index
    const searchText = this.createSearchText(episode);
    const keywords = this.extractKeywords(searchText);

    keywords.forEach(keyword => {
      const episodeIds = this.vectorIndex.get(keyword) || [];
      const index = episodeIds.indexOf(id);
      if (index > -1) {
        episodeIds.splice(index, 1);
        if (episodeIds.length === 0) {
          this.vectorIndex.delete(keyword);
        }
      }
    });

    return true;
  }

  private createSearchText(episode: Episode): string {
    return [
      episode.action,
      episode.userId,
      episode.outcome,
      ...Object.values(episode.context),
      ...episode.metadata.conditions,
      ...episode.metadata.tags
    ].join(' ').toLowerCase();
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, use proper NLP
    return text
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word))
      .map(word => word.toLowerCase());
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return stopWords.includes(word);
  }

  // 2026: Enhanced helper methods for advanced memory features
  private generateHashId(episode: Omit<Episode, 'id' | 'hashId'>): string {
    // Content-addressed hash generation (simplified)
    const content = JSON.stringify(episode);
    return btoa(content).slice(0, 16);
  }

  private getPriorityBonus(priority: 'low' | 'medium' | 'high'): number {
    switch (priority) {
      case 'high': return 0.5;
      case 'medium': return 0.2;
      case 'low': return 0;
    }
  }

  private getRecencyBonus(timestamp: Date): number {
    const daysSince = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 0.3 - daysSince * 0.01); // Decay over time
  }

  private ensureDiversity(episodes: Episode[], limit: number): Episode[] {
    // Simple diversity selection based on outcome types
    const selected: Episode[] = [];
    const outcomes = new Set<string>();

    for (const episode of episodes) {
      if (selected.length >= limit) break;
      if (!outcomes.has(episode.outcome)) {
        selected.push(episode);
        outcomes.add(episode.outcome);
      }
    }

    // Fill remaining slots with highest scored episodes
    while (selected.length < limit && selected.length < episodes.length) {
      const nextEpisode = episodes.find(ep => !selected.includes(ep));
      if (nextEpisode) selected.push(nextEpisode);
      else break;
    }

    return selected;
  }

  /**
   * Consolidate episodes to extract patterns and create semantic knowledge
   * Implements 2026 memory consolidation patterns for learning optimization
   */
  async consolidateEpisodes(): Promise<void> {
    // Implementation for episode consolidation
    // This would identify patterns and create semantic knowledge
    this.consolidationQueue.forEach(episode => {
      episode.metadata.consolidationCount++;
    });
    this.consolidationQueue = [];
  }
}

// Semantic Memory System
export class SemanticMemory {
  private knowledgeGraph: Map<string, SemanticKnowledge> = new Map();
  private entityIndex: Map<string, string[]> = new Map();

  async storeKnowledge(knowledge: Omit<SemanticKnowledge, 'lastUpdated'>): Promise<void> {
    const fullKnowledge: SemanticKnowledge = {
      ...knowledge,
      lastUpdated: new Date()
    };

    this.knowledgeGraph.set(knowledge.entity, fullKnowledge);

    // Update entity index
    fullKnowledge.relationships.forEach(rel => {
      if (!this.entityIndex.has(rel.target)) {
        this.entityIndex.set(rel.target, []);
      }
      this.entityIndex.get(rel.target)!.push(knowledge.entity);
    });
  }

  async query(query: string): Promise<SemanticKnowledge[]> {
    const entities = this.extractEntities(query);
    const results: SemanticKnowledge[] = [];

    entities.forEach(entity => {
      const knowledge = this.knowledgeGraph.get(entity);
      if (knowledge) {
        results.push(knowledge);
      }
    });

    return results;
  }

  async getRelatedEntities(entity: string, maxDepth: number = 2): Promise<Map<string, number>> {
    const related = new Map<string, number>();
    const visited = new Set<string>();
    const queue = [{ entity: entity, depth: 0, score: 1.0 }];

    while (queue.length > 0) {
      const { entity: currentEntity, depth, score } = queue.shift()!;

      if (visited.has(currentEntity) || depth > maxDepth) continue;
      visited.add(currentEntity);

      const knowledge = this.knowledgeGraph.get(currentEntity);
      if (!knowledge) continue;

      knowledge.relationships.forEach(rel => {
        const adjustedScore = score * rel.confidence;
        const currentScore = related.get(rel.target) || 0;

        if (adjustedScore > currentScore) {
          related.set(rel.target, adjustedScore);
          queue.push({ entity: rel.target, depth: depth + 1, score: adjustedScore });
        }
      });
    }

    return related;
  }

  async updateKnowledge(entity: string, updates: Partial<SemanticKnowledge>): Promise<boolean> {
    const existing = this.knowledgeGraph.get(entity);
    if (!existing) return false;

    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.knowledgeGraph.set(entity, updated);
    return true;
  }

  async deleteKnowledge(entity: string): Promise<boolean> {
    const knowledge = this.knowledgeGraph.get(entity);
    if (!knowledge) return false;

    this.knowledgeGraph.delete(entity);

    // Remove from entity index
    knowledge.relationships.forEach(rel => {
      const entities = this.entityIndex.get(rel.target);
      if (entities) {
        const index = entities.indexOf(entity);
        if (index > -1) {
          entities.splice(index, 1);
          if (entities.length === 0) {
            this.entityIndex.delete(rel.target);
          }
        }
      }
    });

    return true;
  }

  private extractEntities(text: string): string[] {
    // Simple entity extraction - in production, use proper NER
    const entities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    return entities.map(entity => entity.toLowerCase());
  }
}

// Procedural Memory System
export class ProceduralMemory {
  private procedures: Map<string, Procedure> = new Map();
  private triggerIndex: Map<string, string[]> = new Map();
  private executionStats: Map<string, { count: number; totalTime: number; successCount: number }> = new Map();

  async storeProcedure(procedure: Omit<Procedure, 'id' | 'lastExecuted'>): Promise<string> {
    const id = uuidv4();
    const fullProcedure: Procedure = { ...procedure, id, lastExecuted: new Date() };

    this.procedures.set(id, fullProcedure);

    // Update trigger index
    procedure.triggers.forEach(trigger => {
      if (!this.triggerIndex.has(trigger)) {
        this.triggerIndex.set(trigger, []);
      }
      this.triggerIndex.get(trigger)!.push(id);
    });

    // Initialize execution stats
    this.executionStats.set(id, { count: 0, totalTime: 0, successCount: 0 });

    return id;
  }

  async executeProcedure(procedureId: string, context: Record<string, any>): Promise<any> {
    const procedure = this.procedures.get(procedureId);
    if (!procedure) {
      throw new Error(`Procedure ${procedureId} not found`);
    }

    const startTime = Date.now();
    const stats = this.executionStats.get(procedureId)!;
    let result: any = context;

    try {
      for (const step of procedure.steps) {
        if (!this.evaluateConditions(step.conditions, result)) {
          continue;
        }

        const stepResult = await this.executeStep(step, result);
        result = { ...result, ...stepResult };
      }

      // Update stats
      stats.count++;
      stats.totalTime += Date.now() - startTime;
      stats.successCount++;
      procedure.successRate = stats.successCount / stats.count;
      procedure.averageDuration = stats.totalTime / stats.count;
      procedure.lastExecuted = new Date();

      return result;
    } catch (error) {
      // Update failure stats
      stats.count++;
      stats.totalTime += Date.now() - startTime;
      procedure.successRate = stats.successCount / stats.count;
      procedure.averageDuration = stats.totalTime / stats.count;
      procedure.lastExecuted = new Date();

      throw error;
    }
  }

  async findProcedures(trigger: string): Promise<Procedure[]> {
    const procedureIds = this.triggerIndex.get(trigger) || [];
    return procedureIds.map(id => this.procedures.get(id)!).filter(Boolean);
  }

  async getProcedure(id: string): Promise<Procedure | null> {
    return this.procedures.get(id) || null;
  }

  async updateProcedure(id: string, updates: Partial<Procedure>): Promise<boolean> {
    const procedure = this.procedures.get(id);
    if (!procedure) return false;

    const updated = { ...procedure, ...updates };
    this.procedures.set(id, updated);
    return true;
  }

  async deleteProcedure(id: string): Promise<boolean> {
    const procedure = this.procedures.get(id);
    if (!procedure) return false;

    this.procedures.delete(id);
    this.executionStats.delete(id);

    // Remove from trigger index
    procedure.triggers.forEach(trigger => {
      const procedureIds = this.triggerIndex.get(trigger);
      if (procedureIds) {
        const index = procedureIds.indexOf(id);
        if (index > -1) {
          procedureIds.splice(index, 1);
          if (procedureIds.length === 0) {
            this.triggerIndex.delete(trigger);
          }
        }
      }
    });

    return true;
  }

  private evaluateConditions(conditions: string[], context: Record<string, any>): boolean {
    return conditions.every(condition => {
      // Simple condition evaluation - in production, use proper expression parser
      const [key, operator, value] = condition.split(/\s+/);
      const contextValue = context[key];

      switch (operator) {
        case '==':
          return contextValue == value;
        case '!=':
          return contextValue != value;
        case '>':
          return Number(contextValue) > Number(value);
        case '<':
          return Number(contextValue) < Number(value);
        case 'exists':
          return contextValue !== undefined;
        default:
          return true;
      }
    });
  }

  private async executeStep(step: ProcedureStep, context: Record<string, any>): Promise<any> {
    // Simulate step execution
    const stepResult = {
      [`${step.action}_result`]: `Executed ${step.action} with parameters: ${JSON.stringify(step.parameters)}`,
      timestamp: new Date().toISOString()
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    return stepResult;
  }
}

// Unified Memory System
export class UnifiedMemorySystem {
  private episodic: EpisodicMemory;
  private semantic: SemanticMemory;
  private procedural: ProceduralMemory;

  constructor() {
    this.episodic = new EpisodicMemory();
    this.semantic = new SemanticMemory();
    this.procedural = new ProceduralMemory();
  }

  // Store different types of memories
  async storeEpisode(episode: Omit<Episode, 'id'>): Promise<string> {
    return await this.episodic.storeEpisode(episode);
  }

  async storeKnowledge(knowledge: Omit<SemanticKnowledge, 'lastUpdated'>): Promise<void> {
    await this.semantic.storeKnowledge(knowledge);
  }

  async storeProcedure(procedure: Omit<Procedure, 'id' | 'lastExecuted'>): Promise<string> {
    return await this.procedural.storeProcedure(procedure);
  }

  // Retrieve memories
  async retrieveEpisodes(context: string, limit?: number): Promise<Episode[]> {
    return await this.episodic.retrieveSimilarEpisodes(context, limit);
  }

  async queryKnowledge(query: string): Promise<SemanticKnowledge[]> {
    return await this.semantic.query(query);
  }

  async findProcedures(trigger: string): Promise<Procedure[]> {
    return await this.procedural.findProcedures(trigger);
  }

  // Execute procedures
  async executeProcedure(procedureId: string, context: Record<string, any>): Promise<any> {
    return await this.procedural.executeProcedure(procedureId, context);
  }

  // Advanced retrieval combining all memory types
  async comprehensiveSearch(query: string, context: Record<string, any>): Promise<{
    episodes: Episode[];
    knowledge: SemanticKnowledge[];
    procedures: Procedure[];
  }> {
    const [episodes, knowledge, procedures] = await Promise.all([
      this.retrieveEpisodes(query),
      this.queryKnowledge(query),
      this.findProcedures(query)
    ]);

    return { episodes, knowledge, procedures };
  }

  // Memory consolidation - extract patterns from episodic memory
  async consolidateMemory(): Promise<void> {
    // Get recent episodes
    const recentEpisodes = await this.episodic.retrieveSimilarEpisodes('', 100);

    // Extract patterns and convert to semantic knowledge
    const patterns = this.extractPatterns(recentEpisodes);

    for (const pattern of patterns) {
      await this.semantic.storeKnowledge(pattern);
    }
  }

  private extractPatterns(episodes: Episode[]): SemanticKnowledge[] {
    const patterns: SemanticKnowledge[] = [];
    const actionOutcomes = new Map<string, { success: number; failure: number; total: number }>();

    // Analyze action-outcome patterns
    episodes.forEach(episode => {
      const key = episode.action;
      if (!actionOutcomes.has(key)) {
        actionOutcomes.set(key, { success: 0, failure: 0, total: 0 });
      }

      const stats = actionOutcomes.get(key)!;
      stats.total++;
      if (episode.outcome === 'success') stats.success++;
      else if (episode.outcome === 'failure') stats.failure++;
    });

    // Create semantic knowledge from patterns
    actionOutcomes.forEach((stats, action) => {
      const successRate = stats.success / stats.total;

      if (stats.total >= 3 && successRate > 0.7) {
        patterns.push({
          entity: action,
          relationships: [{
            target: 'success',
            type: 'related_to',
            confidence: successRate,
            strength: 0.8
          }],
          attributes: {
            successRate,
            totalExecutions: stats.total,
            averageDuration: episodes
              .filter(e => e.action === action)
              .reduce((sum, e) => sum + e.metadata.duration, 0) / stats.total
          },
          source: 'episodic_consolidation',
          lastUpdated: new Date(),
          accessCount: 0,
          lastAccessed: new Date(),
          verificationStatus: 'pending' as const
        });
      }
    });

    return patterns;
  }
}
