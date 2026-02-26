/**
 * @file apps/web/src/features/lead-capture/lib/lead-domain-events.ts
 * @summary Domain events system for lead lifecycle management.
 * @description Event-driven architecture for lead state changes with audit trails.
 * @security All events include tenant context for multi-tenant isolation
 * @compliance GDPR/CCPA compliant event logging with data minimization
 */

import { z } from 'zod'
import type { Lead } from '@/entities/lead/model/lead.schema'

// Domain event base schema
export const DomainEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  eventVersion: z.string().default('1.0'),
  aggregateId: z.string().uuid(), // Lead ID
  aggregateType: z.string().default('Lead'),
  tenantId: z.string().uuid(),
  userId: z.string().optional(), // User who triggered the event
  correlationId: z.string().uuid(),
  causationId: z.string().uuid().optional(), // Event that caused this event
  timestamp: z.date(),
  data: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional()
})

export type DomainEvent = z.infer<typeof DomainEventSchema>

// Lead-specific event types
export type LeadEventType = 
  | 'LeadCreated'
  | 'LeadUpdated'
  | 'LeadQualified'
  | 'LeadConverted'
  | 'LeadAssigned'
  | 'LeadUnassigned'
  | 'LeadScoreChanged'
  | 'LeadConsentUpdated'
  | 'LeadExported'
  | 'LeadDeleted'

// Lead created event
export const LeadCreatedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadCreated'),
  data: z.object({
    leadId: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    source: z.enum(['website', 'referral', 'direct', 'social', 'email', 'paid', 'organic', 'other']),
    tenantId: z.string().uuid(),
    sessionId: z.string().optional(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().optional()
  })
})

// Lead updated event
export const LeadUpdatedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadUpdated'),
  data: z.object({
    leadId: z.string().uuid(),
    changes: z.record(z.unknown()),
    previousValues: z.record(z.unknown()).optional()
  })
})

// Lead qualified event
export const LeadQualifiedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadQualified'),
  data: z.object({
    leadId: z.string().uuid(),
    score: z.number().int().min(0).max(100),
    qualificationReason: z.string().optional()
  })
})

// Lead converted event
export const LeadConvertedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadConverted'),
  data: z.object({
    leadId: z.string().uuid(),
    conversionValue: z.number().optional(),
    conversionType: z.string().optional(),
    convertedAt: z.date()
  })
})

// Lead assigned event
export const LeadAssignedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadAssigned'),
  data: z.object({
    leadId: z.string().uuid(),
    assigneeUserId: z.string().uuid(),
    assigneeRole: z.string().optional(),
    previousAssigneeUserId: z.string().uuid().optional()
  })
})

// Lead unassigned event
export const LeadUnassignedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadUnassigned'),
  data: z.object({
    leadId: z.string().uuid(),
    previousAssigneeUserId: z.string().uuid(),
    reason: z.string().optional()
  })
})

// Lead score changed event
export const LeadScoreChangedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadScoreChanged'),
  data: z.object({
    leadId: z.string().uuid(),
    previousScore: z.number().int().min(0).max(100),
    newScore: z.number().int().min(0).max(100),
    scoringReason: z.string().optional()
  })
})

// Lead consent updated event
export const LeadConsentUpdatedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadConsentUpdated'),
  data: z.object({
    leadId: z.string().uuid(),
    consentType: z.enum(['marketing', 'processing', 'all']),
    previousConsent: z.boolean(),
    newConsent: z.boolean(),
    consentTimestamp: z.date(),
    ipAddress: z.string().ip().optional(),
    userAgent: z.string().optional()
  })
})

// Lead exported event
export const LeadExportedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadExported'),
  data: z.object({
    leadId: z.string().uuid(),
    exportFormat: z.enum(['csv', 'json', 'pdf']),
    exportReason: z.string(),
    requestedBy: z.string().uuid(),
    exportedAt: z.date()
  })
})

// Lead deleted event (for GDPR compliance)
export const LeadDeletedEventSchema = DomainEventSchema.extend({
  eventType: z.literal('LeadDeleted'),
  data: z.object({
    leadId: z.string().uuid(),
    deletionReason: z.enum(['gdpr_request', 'data_cleanup', 'duplicate', 'error']),
    requestedBy: z.string().uuid(),
    deletedAt: z.date(),
    anonymized: z.boolean().default(true)
  })
})

// Event type union
export type LeadDomainEvent = 
  | z.infer<typeof LeadCreatedEventSchema>
  | z.infer<typeof LeadUpdatedEventSchema>
  | z.infer<typeof LeadQualifiedEventSchema>
  | z.infer<typeof LeadConvertedEventSchema>
  | z.infer<typeof LeadAssignedEventSchema>
  | z.infer<typeof LeadUnassignedEventSchema>
  | z.infer<typeof LeadScoreChangedEventSchema>
  | z.infer<typeof LeadConsentUpdatedEventSchema>
  | z.infer<typeof LeadExportedEventSchema>
  | z.infer<typeof LeadDeletedEventSchema>

/**
 * Domain Event Publisher
 * Handles publishing domain events to various handlers
 */
export class DomainEventPublisher {
  private static instance: DomainEventPublisher
  private eventHandlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map()

  private constructor() {}

  static getInstance(): DomainEventPublisher {
    if (!DomainEventPublisher.instance) {
      DomainEventPublisher.instance = new DomainEventPublisher()
    }
    return DomainEventPublisher.instance
  }

  /**
   * Register an event handler for a specific event type
   */
  registerHandler(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)!.push(handler)
  }

  /**
   * Publish a domain event to all registered handlers
   */
  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.eventHandlers.get(event.eventType) || []
    
    // Execute all handlers concurrently
    await Promise.allSettled(
      handlers.map(handler => 
        handler(event).catch(error => {
          console.error(`Event handler failed for ${event.eventType}:`, error)
          // TODO: Add proper error logging and monitoring
        })
      )
    )
  }

  /**
   * Publish multiple events in a transaction
   */
  async publishBatch(events: DomainEvent[]): Promise<void> {
    // TODO: Implement transactional event publishing
    for (const event of events) {
      await this.publish(event)
    }
  }
}

/**
 * Domain Event Factory
 * Creates domain events with proper structure and metadata
 */
export class DomainEventFactory {
  /**
   * Create a lead created event
   */
  static createLeadCreatedEvent(
    lead: Lead,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadCreatedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadCreated',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        email: lead.email,
        name: lead.name,
        source: lead.source,
        tenantId: lead.tenantId,
        sessionId: lead.sessionId,
        ipAddress: lead.ipAddress,
        userAgent: lead.userAgent
      }
    }
  }

  /**
   * Create a lead updated event
   */
  static createLeadUpdatedEvent(
    lead: Lead,
    changes: Record<string, unknown>,
    previousValues?: Record<string, unknown>,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadUpdatedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadUpdated',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        changes,
        previousValues
      }
    }
  }

  /**
   * Create a lead qualified event
   */
  static createLeadQualifiedEvent(
    lead: Lead,
    score: number,
    qualificationReason?: string,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadQualifiedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadQualified',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        score,
        qualificationReason
      }
    }
  }

  /**
   * Create a lead converted event
   */
  static createLeadConvertedEvent(
    lead: Lead,
    conversionValue?: number,
    conversionType?: string,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadConvertedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadConverted',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        conversionValue,
        conversionType,
        convertedAt: new Date()
      }
    }
  }

  /**
   * Create a lead assigned event
   */
  static createLeadAssignedEvent(
    lead: Lead,
    assigneeUserId: string,
    assigneeRole?: string,
    previousAssigneeUserId?: string,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadAssignedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadAssigned',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        assigneeUserId,
        assigneeRole,
        previousAssigneeUserId
      }
    }
  }

  /**
   * Create a lead consent updated event
   */
  static createLeadConsentUpdatedEvent(
    lead: Lead,
    consentType: 'marketing' | 'processing' | 'all',
    previousConsent: boolean,
    newConsent: boolean,
    ipAddress?: string,
    userAgent?: string,
    userId?: string,
    correlationId?: string
  ): z.infer<typeof LeadConsentUpdatedEventSchema> {
    return {
      id: crypto.randomUUID(),
      eventType: 'LeadConsentUpdated',
      eventVersion: '1.0',
      aggregateId: lead.id,
      aggregateType: 'Lead',
      tenantId: lead.tenantId,
      userId,
      correlationId: correlationId || crypto.randomUUID(),
      timestamp: new Date(),
      data: {
        leadId: lead.id,
        consentType,
        previousConsent,
        newConsent,
        consentTimestamp: new Date(),
        ipAddress,
        userAgent
      }
    }
  }
}

/**
 * Event Store Interface
 * Defines the contract for event persistence
 */
export interface EventStore {
  saveEvent(event: DomainEvent): Promise<void>
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>
  getEventsByType(eventType: string, tenantId?: string): Promise<DomainEvent[]>
  getEventsByTenant(tenantId: string, fromTimestamp?: Date): Promise<DomainEvent[]>
}

/**
 * In-Memory Event Store (for development/testing)
 * TODO: Replace with persistent event store
 */
export class InMemoryEventStore implements EventStore {
  private events: Map<string, DomainEvent[]> = new Map()

  async saveEvent(event: DomainEvent): Promise<void> {
    const aggregateEvents = this.events.get(event.aggregateId) || []
    aggregateEvents.push(event)
    this.events.set(event.aggregateId, aggregateEvents)
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]> {
    const events = this.events.get(aggregateId) || []
    if (fromVersion !== undefined) {
      return events.filter(event => 
        parseInt(event.eventVersion.split('.')[1] || '0') >= fromVersion
      )
    }
    return events
  }

  async getEventsByType(eventType: string, tenantId?: string): Promise<DomainEvent[]> {
    const allEvents: DomainEvent[] = []
    for (const events of this.events.values()) {
      allEvents.push(...events)
    }
    
    return allEvents.filter(event => 
      event.eventType === eventType && 
      (!tenantId || event.tenantId === tenantId)
    )
  }

  async getEventsByTenant(tenantId: string, fromTimestamp?: Date): Promise<DomainEvent[]> {
    const allEvents: DomainEvent[] = []
    for (const events of this.events.values()) {
      allEvents.push(...events)
    }
    
    return allEvents.filter(event => 
      event.tenantId === tenantId &&
      (!fromTimestamp || event.timestamp >= fromTimestamp)
    )
  }
}

// Export singleton instances
export const eventPublisher = DomainEventPublisher.getInstance()
export const eventStore = new InMemoryEventStore() // TODO: Replace with persistent store
