#!/usr/bin/env node

/**
 * @file mcp/servers/src/knowledge-graph-memory-fixed.ts
 * @summary Knowledge Graph Memory MCP Server for persistent AI intelligence.
 * @description Transforms raw text into interconnected knowledge graphs with temporal awareness.
 * @security No secrets logged; file system access limited to configured storage path.
 * @adr none
 * @requirements MCP-001, AI-002
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { z } from 'zod';

// Knowledge Graph Types
interface KnowledgeEntity {
  id: string;
  type: 'person' | 'project' | 'concept' | 'technology' | 'decision' | 'issue' | 'requirement';
  name: string;
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  temporalVersions: TemporalVersion[];
}

interface TemporalVersion {
  timestamp: Date;
  attributes: Record<string, any>;
  changeType: 'created' | 'updated' | 'deleted' | 'merged';
  context: string;
}

interface KnowledgeRelation {
  id: string;
  fromEntity: string;
  toEntity: string;
  type: 'is_a' | 'part_of' | 'related_to' | 'causes' | 'enables' | 'depends_on' | 'conflicts_with';
  strength: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  createdAt: Date;
  temporalHistory: TemporalRelation[];
}

interface TemporalRelation {
  timestamp: Date;
  strength: number;
  changeType: 'created' | 'strengthened' | 'weakened' | 'removed';
  context: string;
}

interface KnowledgeGraph {
  entities: Map<string, KnowledgeEntity>;
  relations: Map<string, KnowledgeRelation>;
  lastUpdated: Date;
  context: string;
}

export class KnowledgeGraphMemoryMCPServer {
  private server: McpServer;
  private graph: KnowledgeGraph;
  private storagePath: string;

  constructor(storagePath?: string) {
    this.server = new McpServer(
      {
        name: 'knowledge-graph-memory',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.storagePath = storagePath || './knowledge-graph.json';
    this.graph = {
      entities: new Map(),
      relations: new Map(),
      lastUpdated: new Date(),
      context: 'general',
    };

    this.setupTools();
    this.loadGraph();
  }

  private setupTools() {
    // Add entity to knowledge graph
    this.server.tool(
      'add-entity',
      'Add an entity to the knowledge graph with temporal tracking',
      {
        name: z.string().describe('Name of the entity'),
        type: z.enum(['person', 'project', 'concept', 'technology', 'decision', 'issue', 'requirement']).describe('Type of entity'),
        attributes: z.record(z.any()).describe('Attributes of the entity'),
        context: z.string().optional().describe('Context for this entity creation'),
      },
      async ({ name, type, attributes, context }) => {
        const entityId = this.generateEntityId(name, type);
        const now = new Date();

        const entity: KnowledgeEntity = {
          id: entityId,
          type,
          name,
          attributes,
          createdAt: now,
          updatedAt: now,
          temporalVersions: [
            {
              timestamp: now,
              attributes: { ...attributes },
              changeType: 'created',
              context: context || 'manual_creation',
            },
          ],
        };

        this.graph.entities.set(entityId, entity);
        this.graph.lastUpdated = now;

        return {
          content: [
            {
              type: 'text',
              text: `Entity "${name}" added to knowledge graph with ID: ${entityId}`,
            },
          ],
        };
      }
    );

    // Add relationship between entities
    this.server.tool(
      'add-relation',
      'Add a relationship between two entities in the knowledge graph',
      {
        fromEntityId: z.string().describe('ID of the source entity'),
        toEntityId: z.string().describe('ID of the target entity'),
        relationType: z.enum(['is_a', 'part_of', 'related_to', 'causes', 'enables', 'depends_on', 'conflicts_with']).describe('Type of relationship'),
        strength: z.number().min(0).max(1).default(0.8).describe('Strength of the relationship (0.0-1.0)'),
        confidence: z.number().min(0).max(1).default(0.8).describe('Confidence in this relationship (0.0-1.0)'),
        context: z.string().optional().describe('Context for this relationship'),
      },
      async ({ fromEntityId, toEntityId, relationType, strength, confidence, context }) => {
        const fromEntity = this.graph.entities.get(fromEntityId);
        const toEntity = this.graph.entities.get(toEntityId);

        if (!fromEntity || !toEntity) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Both entities must exist. Found: ${fromEntity ? 'from' : ''}${toEntity ? 'to' : ''}`,
              },
            ],
          };
        }

        const relationId = this.generateRelationId(fromEntityId, toEntityId, relationType);
        const now = new Date();

        const relation: KnowledgeRelation = {
          id: relationId,
          fromEntity: fromEntityId,
          toEntity: toEntityId,
          type: relationType,
          strength,
          confidence,
          createdAt: now,
          temporalHistory: [
            {
              timestamp: now,
              strength,
              changeType: 'created',
              context: context || 'manual_creation',
            },
          ],
        };

        this.graph.relations.set(relationId, relation);
        this.graph.lastUpdated = now;

        return {
          content: [
            {
              type: 'text',
              text: `Relationship added: ${fromEntity.name} -> ${relationType} -> ${toEntity.name} (strength: ${strength})`,
            },
          ],
        };
      }
    );

    // Query knowledge graph
    this.server.tool(
      'query-graph',
      'Query the knowledge graph for entities and relationships',
      {
        query: z.string().describe('Search query for entities and relationships'),
        entityTypes: z.array(z.string()).optional().describe('Filter by entity types'),
        relationTypes: z.array(z.string()).optional().describe('Filter by relationship types'),
        timeRange: z.string().optional().describe('Time range for results (e.g., "last-7-days")'),
        maxResults: z.number().default(20).describe('Maximum number of results to return'),
      },
      async ({ query, entityTypes, relationTypes, timeRange, maxResults }) => {
        const results = this.performGraphQuery(query, entityTypes, relationTypes, timeRange, maxResults);

        return {
          content: [
            {
              type: 'text',
              text: `Found ${results.length} results for "${query}":\n${JSON.stringify(results, null, 2)}`,
            },
          ],
        };
      }
    );

    // Get entity details with temporal history
    this.server.tool(
      'get-entity',
      'Get detailed information about an entity including temporal history',
      {
        entityId: z.string().describe('ID of the entity'),
        timeRange: z.string().optional().describe('Time range for temporal history'),
      },
      async ({ entityId, timeRange }) => {
        const entity = this.graph.entities.get(entityId);
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Entity not found with ID ${entityId}`,
              },
            ],
          };
        }

        let temporalVersions = entity.temporalVersions;
        if (timeRange) {
          const cutoff = this.parseTimeRange(timeRange);
          temporalVersions = temporalVersions.filter(v => v.timestamp >= cutoff);
        }

        return {
          content: [
            {
              type: 'text',
              text: `Entity Details:\n${JSON.stringify({ ...entity, temporalVersions }, null, 2)}`,
            },
          ],
        };
      }
    );

    // Find hidden connections
    this.server.tool(
      'find-hidden-connections',
      'Find hidden or indirect connections between entities',
      {
        fromEntityId: z.string().describe('ID of the source entity'),
        toEntityId: z.string().describe('ID of the target entity'),
        maxDepth: z.number().default(3).describe('Maximum depth for connection search'),
        minStrength: z.number().default(0.3).describe('Minimum strength threshold for connections'),
      },
      async ({ fromEntityId, toEntityId, maxDepth, minStrength }) => {
        const connections = this.findIndirectConnections(fromEntityId, toEntityId, maxDepth, minStrength);

        return {
          content: [
            {
              type: 'text',
              text: `Found ${connections.length} hidden connections:\n${JSON.stringify(connections, null, 2)}`,
            },
          ],
        };
      }
    );

    // Save knowledge graph to storage
    this.server.tool(
      'save-graph',
      'Save the knowledge graph to persistent storage',
      {
        backup: z.boolean().default(false).describe('Create a backup instead of overwriting'),
      },
      async ({ backup }) => {
        const filename = backup
          ? `${this.storagePath}.backup.${Date.now()}.json`
          : this.storagePath;

        const graphData = JSON.stringify(
          {
            entities: Object.fromEntries(this.graph.entities),
            relations: Object.fromEntries(this.graph.relations),
            lastUpdated: this.graph.lastUpdated,
            context: this.graph.context,
          },
          null,
          2
        );

        // Write to disk
        writeFileSync(filename, graphData, 'utf8');

        return {
          content: [
            {
              type: 'text',
              text: `Knowledge graph saved to ${filename}\nStats: ${this.graph.entities.size} entities, ${this.graph.relations.size} relations`,
            },
          ],
        };
      }
    );

    // Update entity with temporal tracking
    this.server.tool(
      'update-entity',
      'Update an entity with temporal tracking of changes',
      {
        entityId: z.string().describe('ID of the entity to update'),
        attributes: z.record(z.any()).describe('New attributes for the entity'),
        context: z.string().optional().describe('Context for this update'),
      },
      async ({ entityId, attributes, context }) => {
        const entity = this.graph.entities.get(entityId);
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Entity not found with ID ${entityId}`,
              },
            ],
          };
        }

        const now = new Date();
        const oldAttributes = { ...entity.attributes };
        
        // Update entity
        entity.attributes = { ...entity.attributes, ...attributes };
        entity.updatedAt = now;
        
        // Add temporal version
        entity.temporalVersions.push({
          timestamp: now,
          attributes: { ...entity.attributes },
          changeType: 'updated',
          context: context || 'manual_update',
        });

        this.graph.lastUpdated = now;

        return {
          content: [
            {
              type: 'text',
              text: `Entity "${entity.name}" updated with temporal tracking\nChanges: ${JSON.stringify(this.detectChanges(oldAttributes, entity.attributes), null, 2)}`,
            },
          ],
        };
      }
    );

    // Get temporal evolution of relationships
    this.server.tool(
      'get-relation-evolution',
      'Get the temporal evolution of relationships between entities',
      {
        relationId: z.string().describe('ID of the relationship'),
        timeRange: z.string().optional().describe('Time range for evolution analysis'),
      },
      async ({ relationId, timeRange }) => {
        const relation = this.graph.relations.get(relationId);
        if (!relation) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: Relationship not found with ID ${relationId}`,
              },
            ],
          };
        }

        let temporalHistory = relation.temporalHistory;
        if (timeRange) {
          const cutoff = this.parseTimeRange(timeRange);
          temporalHistory = temporalHistory.filter(h => h.timestamp >= cutoff);
        }

        const evolution = {
          current: relation,
          history: temporalHistory,
          trends: this.analyzeTemporalTrends(temporalHistory),
          predictions: this.predictRelationTrends(temporalHistory),
        };

        return {
          content: [
            {
              type: 'text',
              text: `Temporal evolution for relationship ${relationId}:\n${JSON.stringify(evolution, null, 2)}`,
            },
          ],
        };
      }
    );
  }

  private generateEntityId(name: string, type: string): string {
    return `${type}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
  }

  private generateRelationId(fromId: string, toId: string, type: string): string {
    return `${fromId}_${type}_${toId}_${Date.now()}`;
  }

  private performGraphQuery(
    query: string,
    entityTypes?: string[],
    relationTypes?: string[],
    timeRange?: string,
    maxResults: number = 20
  ): any[] {
    const results = [];
    const queryLower = query.toLowerCase();
    const cutoff = timeRange ? this.parseTimeRange(timeRange) : new Date(0);

    // Search entities
    for (const [id, entity] of this.graph.entities.entries()) {
      if (entityTypes && !entityTypes.includes(entity.type)) continue;
      if (entity.updatedAt < cutoff) continue;

      const matches = [
        entity.name.toLowerCase().includes(queryLower),
        JSON.stringify(entity.attributes).toLowerCase().includes(queryLower),
      ].some(Boolean);

      if (matches) {
        results.push({
          type: 'entity',
          id,
          entity,
          relevance: this.calculateRelevance(query, entity),
        });
      }
    }

    // Search relations
    for (const [id, relation] of this.graph.relations.entries()) {
      if (relationTypes && !relationTypes.includes(relation.type)) continue;
      if (relation.createdAt < cutoff) continue;

      const fromEntity = this.graph.entities.get(relation.fromEntity);
      const toEntity = this.graph.entities.get(relation.toEntity);

      if (fromEntity && toEntity) {
        const relationText = `${fromEntity.name} ${relation.type} ${toEntity.name}`;
        if (relationText.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'relation',
            id,
            relation,
            fromEntity,
            toEntity,
            relevance: relation.strength * relation.confidence,
          });
        }
      }
    }

    // Sort by relevance and limit results
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, maxResults);
  }

  private detectChanges(oldAttrs: any, newAttrs: any): any[] {
    const changes = [];
    
    for (const key in newAttrs) {
      if (!(key in oldAttrs)) {
        changes.push({ type: 'added', key, value: newAttrs[key] });
      } else if (oldAttrs[key] !== newAttrs[key]) {
        changes.push({ type: 'modified', key, oldValue: oldAttrs[key], newValue: newAttrs[key] });
      }
    }
    
    for (const key in oldAttrs) {
      if (!(key in newAttrs)) {
        changes.push({ type: 'removed', key, value: oldAttrs[key] });
      }
    }
    
    return changes;
  }

  private analyzeTemporalTrends(history: TemporalRelation[]): any[] {
    if (history.length < 2) return [];

    const trends = [];
    let strengthTrend = 0;
    
    for (let i = 1; i < history.length; i++) {
      const diff = history[i].strength - history[i - 1].strength;
      strengthTrend += diff;
    }

    if (strengthTrend > 0.1) {
      trends.push({ type: 'strengthening', trend: strengthTrend });
    } else if (strengthTrend < -0.1) {
      trends.push({ type: 'weakening', trend: strengthTrend });
    } else {
      trends.push({ type: 'stable', trend: 0 });
    }

    return trends;
  }

  private predictRelationTrends(history: TemporalRelation[]): any {
    if (history.length < 3) return { prediction: 'insufficient_data', confidence: 0 };

    const recent = history.slice(-3);
    const avgStrength = recent.reduce((sum, h) => sum + h.strength, 0) / recent.length;
    const trend = this.analyzeTemporalTrends(recent)[0];

    return {
      prediction: trend.type === 'strengthening' ? 'likely_to_strengthen' : 
                 trend.type === 'weakening' ? 'likely_to_weaken' : 'likely_to_remain_stable',
      confidence: Math.min(0.9, recent.length / 10),
      currentStrength: avgStrength,
    };
  }

  private parseTimeRange(timeRange: string): Date {
    const now = new Date();
    const match = timeRange.match(/last-(\d+)-(day|week|month|year)/);
    
    if (!match) return new Date(0);

    const value = parseInt(match[1]);
    const unit = match[2];

    const units = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };

    return new Date(now.getTime() - value * units[unit]);
  }

  private findIndirectConnections(
    fromId: string,
    toId: string,
    maxDepth: number,
    minStrength: number
  ): any[] {
    const connections = [];
    const visited = new Set<string>();
    const queue = [{ entityId: fromId, path: [], strength: 1.0 }];

    while (queue.length > 0 && connections.length < 10) {
      const current = queue.shift()!;
      
      if (current.entityId === toId) {
        connections.push({
          from: fromId,
          to: toId,
          path: current.path,
          strength: current.strength,
          depth: current.path.length,
        });
        continue;
      }

      if (visited.has(current.entityId)) continue;
      visited.add(current.entityId);

      for (const relation of this.graph.relations.values()) {
        let nextEntityId: string | null = null;
        let nextStrength = current.strength;

        if (relation.fromEntity === current.entityId) {
          nextEntityId = relation.toEntity;
          nextStrength *= relation.strength;
        } else if (relation.toEntity === current.entityId) {
          nextEntityId = relation.fromEntity;
          nextStrength *= relation.strength;
        }

        if (nextEntityId && nextStrength >= minStrength) {
          queue.push({
            entityId: nextEntityId,
            path: [...current.path, relation.id],
            strength: nextStrength,
          });
        }
      }
    }

    return connections.sort((a, b) => b.strength - a.strength);
  }

  private calculateRelevance(query: string, entity: KnowledgeEntity): number {
    const queryLower = query.toLowerCase();
    const nameMatch = entity.name.toLowerCase().includes(queryLower) ? 1.0 : 0.0;
    const attributeMatch = JSON.stringify(entity.attributes).toLowerCase().includes(queryLower)
      ? 0.7
      : 0.0;
    const recencyBonus = Math.max(
      0,
      1 - (Date.now() - entity.updatedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
    ); // 30-day decay

    return nameMatch + attributeMatch + recencyBonus;
  }

  private loadGraph(): void {
    try {
      if (existsSync(this.storagePath)) {
        const data = readFileSync(this.storagePath, 'utf8');
        const loaded = JSON.parse(data);
        
        this.graph = {
          entities: new Map(Object.entries(loaded.entities || {})),
          relations: new Map(Object.entries(loaded.relations || {})),
          lastUpdated: new Date(loaded.lastUpdated),
          context: loaded.context || 'general',
        };
        console.error('Knowledge graph loaded from:', this.storagePath);
      } else {
        console.error(
          'Knowledge graph file not found, starting with empty graph:',
          this.storagePath
        );
      }
    } catch (error) {
      console.error('Failed to load knowledge graph:', error);
      console.error('Starting with empty knowledge graph');
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Knowledge Graph Memory MCP Server running on stdio');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new KnowledgeGraphMemoryMCPServer();
  server.run().catch(console.error);
}
