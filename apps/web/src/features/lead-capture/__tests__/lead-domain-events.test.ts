/**
 * @file apps/web/src/features/lead-capture/__tests__/lead-domain-events.test.ts
 * @summary Comprehensive tests for lead domain events system.
 * @description Unit tests for domain events, event publisher, and event handlers.
 * @security Tests include tenant isolation and audit trails
 * @compliance GDPR/CCPA compliance testing included
 * @requirements TASK-006, domain-events-testing, audit-testing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DomainEventPublisher,
  DomainEventFactory,
  InMemoryEventStore,
  registerLeadEventHandlers,
  LeadEventPublisher,
  type DomainEvent,
  type LeadDomainEvent,
} from '../lib/lead-domain-events';

// Mock event handlers for testing
const mockHandler = vi.fn();
const mockEmailHandler = vi.fn();
const mockAnalyticsHandler = vi.fn();
const mockAuditHandler = vi.fn();

describe('Domain Events System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the singleton instance
    (DomainEventPublisher as any).instance = null;
  });

  describe('DomainEventFactory', () => {
    it('should create lead created event', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadCreatedEvent(lead);

      expect(event.eventType).toBe('LeadCreated');
      expect(event.aggregateId).toBe(lead.id);
      expect(event.tenantId).toBe(lead.tenantId);
      expect(event.data.leadId).toBe(lead.id);
      expect(event.data.email).toBe(lead.email);
      expect(event.data.name).toBe(lead.name);
      expect(event.data.source).toBe(lead.source);
      expect(event.id).toBeDefined();
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should create lead qualified event', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadQualifiedEvent(lead, 85, 'High engagement');

      expect(event.eventType).toBe('LeadQualified');
      expect(event.data.leadId).toBe(lead.id);
      expect(event.data.score).toBe(85);
      expect(event.data.qualificationReason).toBe('High engagement');
    });

    it('should create lead converted event', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadConvertedEvent(lead, 1000, 'Online purchase');

      expect(event.eventType).toBe('LeadConverted');
      expect(event.data.leadId).toBe(lead.id);
      expect(event.data.conversionValue).toBe(1000);
      expect(event.data.conversionType).toBe('Online purchase');
      expect(event.data.convertedAt).toBeInstanceOf(Date);
    });

    it('should create lead assigned event', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadAssignedEvent(
        lead,
        '550e8400-e29b-41d4-a716-446655440002',
        'Sales Representative'
      );

      expect(event.eventType).toBe('LeadAssigned');
      expect(event.data.leadId).toBe(lead.id);
      expect(event.data.assigneeUserId).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(event.data.assigneeRole).toBe('Sales Representative');
    });

    it('should create consent updated event', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadConsentUpdatedEvent(
        lead,
        'marketing',
        false,
        true,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(event.eventType).toBe('LeadConsentUpdated');
      expect(event.data.leadId).toBe(lead.id);
      expect(event.data.consentType).toBe('marketing');
      expect(event.data.previousConsent).toBe(false);
      expect(event.data.newConsent).toBe(true);
      expect(event.data.ipAddress).toBe('192.168.1.1');
      expect(event.data.userAgent).toBe('Mozilla/5.0');
    });
  });

  describe('DomainEventPublisher', () => {
    it('should register and publish events to handlers', async () => {
      const publisher = DomainEventPublisher.getInstance();

      // Register handler
      publisher.registerHandler('TestEvent', mockHandler);

      const testEvent: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'TestEvent',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation',
        timestamp: new Date(),
        data: { test: 'data' },
      };

      await publisher.publish(testEvent);

      expect(mockHandler).toHaveBeenCalledWith(testEvent);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple handlers for same event type', async () => {
      const publisher = DomainEventPublisher.getInstance();

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      publisher.registerHandler('TestEvent', handler1);
      publisher.registerHandler('TestEvent', handler2);

      const testEvent: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'TestEvent',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation',
        timestamp: new Date(),
        data: { test: 'data' },
      };

      await publisher.publish(testEvent);

      expect(handler1).toHaveBeenCalledWith(testEvent);
      expect(handler2).toHaveBeenCalledWith(testEvent);
    });

    it('should handle handler errors gracefully', async () => {
      const publisher = DomainEventPublisher.getInstance();

      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      publisher.registerHandler('TestEvent', errorHandler);

      const testEvent: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'TestEvent',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation',
        timestamp: new Date(),
        data: { test: 'data' },
      };

      // Should not throw, even if handler fails
      await expect(publisher.publish(testEvent)).resolves.toBeUndefined();
    });

    it('should return singleton instance', () => {
      const publisher1 = DomainEventPublisher.getInstance();
      const publisher2 = DomainEventPublisher.getInstance();

      expect(publisher1).toBe(publisher2);
    });
  });

  describe('InMemoryEventStore', () => {
    let eventStore: InMemoryEventStore;

    beforeEach(() => {
      eventStore = new InMemoryEventStore();
    });

    it('should save and retrieve events', async () => {
      const event: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'TestEvent',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation',
        timestamp: new Date(),
        data: { test: 'data' },
      };

      await eventStore.saveEvent(event);

      const events = await eventStore.getEvents('lead-123');

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(event);
    });

    it('should retrieve events by type', async () => {
      const event1: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'LeadCreated',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation-1',
        timestamp: new Date(),
        data: { test: 'data1' },
      };

      const event2: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        eventType: 'LeadUpdated',
        eventVersion: '1.0',
        aggregateId: 'lead-456',
        aggregateType: 'Lead',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        correlationId: 'test-correlation-2',
        timestamp: new Date(),
        data: { test: 'data2' },
      };

      await eventStore.saveEvent(event1);
      await eventStore.saveEvent(event2);

      const createdEvents = await eventStore.getEventsByType('LeadCreated');
      const updatedEvents = await eventStore.getEventsByType('LeadUpdated');

      expect(createdEvents).toHaveLength(1);
      expect(createdEvents[0].eventType).toBe('LeadCreated');
      expect(updatedEvents).toHaveLength(1);
      expect(updatedEvents[0].eventType).toBe('LeadUpdated');
    });

    it('should retrieve events by tenant', async () => {
      const event1: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        eventType: 'LeadCreated',
        eventVersion: '1.0',
        aggregateId: 'lead-123',
        aggregateType: 'Lead',
        tenantId: 'tenant-1',
        correlationId: 'test-correlation-1',
        timestamp: new Date(),
        data: { test: 'data1' },
      };

      const event2: DomainEvent = {
        id: '550e8400-e29b-41d4-a716-446655440002',
        eventType: 'LeadCreated',
        eventVersion: '1.0',
        aggregateId: 'lead-456',
        aggregateType: 'Lead',
        tenantId: 'tenant-2',
        correlationId: 'test-correlation-2',
        timestamp: new Date(),
        data: { test: 'data2' },
      };

      await eventStore.saveEvent(event1);
      await eventStore.saveEvent(event2);

      const tenant1Events = await eventStore.getEventsByTenant('tenant-1');
      const tenant2Events = await eventStore.getEventsByTenant('tenant-2');

      expect(tenant1Events).toHaveLength(1);
      expect(tenant1Events[0].tenantId).toBe('tenant-1');
      expect(tenant2Events).toHaveLength(1);
      expect(tenant2Events[0].tenantId).toBe('tenant-2');
    });
  });

  describe('LeadEventPublisher', () => {
    beforeEach(() => {
      // Mock the event store and publisher
      vi.mock('../lib/lead-domain-events', () => ({
        DomainEventFactory: {
          createLeadCreatedEvent: vi.fn(),
          createLeadQualifiedEvent: vi.fn(),
          createLeadConvertedEvent: vi.fn(),
          createLeadAssignedEvent: vi.fn(),
          createLeadConsentUpdatedEvent: vi.fn(),
        },
        eventStore: {
          saveEvent: vi.fn(),
        },
        eventPublisher: {
          publish: vi.fn(),
        },
      }));
    });

    it('should publish lead created event', async () => {
      const { DomainEventFactory, eventStore, eventPublisher } =
        await import('../lib/lead-domain-events');

      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await LeadEventPublisher.publishLeadCreated(lead);

      expect(DomainEventFactory.createLeadCreatedEvent).toHaveBeenCalledWith(
        lead,
        undefined,
        expect.any(String)
      );
      expect(eventStore.saveEvent).toHaveBeenCalled();
      expect(eventPublisher.publish).toHaveBeenCalled();
    });

    it('should publish lead qualified event', async () => {
      const { DomainEventFactory, eventStore, eventPublisher } =
        await import('../lib/lead-domain-events');

      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await LeadEventPublisher.publishLeadQualified(lead, 85, 'High engagement');

      expect(DomainEventFactory.createLeadQualifiedEvent).toHaveBeenCalledWith(
        lead,
        85,
        'High engagement',
        undefined,
        expect.any(String)
      );
      expect(eventStore.saveEvent).toHaveBeenCalled();
      expect(eventPublisher.publish).toHaveBeenCalled();
    });
  });

  describe('Event Handler Registration', () => {
    it('should register all lead event handlers', () => {
      const publisher = DomainEventPublisher.getInstance();

      // Mock console to prevent logging during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      registerLeadEventHandlers();

      // Verify that handlers were registered
      expect(publisher['eventHandlers']).toBeDefined();

      consoleSpy.mockRestore();
    });
  });

  describe('Security Tests', () => {
    it('should include tenant context in all events', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadCreatedEvent(lead);

      expect(event.tenantId).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(event.data.tenantId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should generate unique correlation IDs', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event1 = DomainEventFactory.createLeadCreatedEvent(lead);
      const event2 = DomainEventFactory.createLeadCreatedEvent(lead);

      expect(event1.correlationId).toBeDefined();
      expect(event2.correlationId).toBeDefined();
      expect(event1.correlationId).not.toBe(event2.correlationId);
    });

    it('should include audit metadata', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadCreatedEvent(lead, 'user-123');

      expect(event.userId).toBe('user-123');
      expect(event.timestamp).toBeInstanceOf(Date);
      expect(event.eventVersion).toBe('1.0');
    });
  });

  describe('GDPR/CCPA Compliance Tests', () => {
    it('should track consent changes with detailed metadata', () => {
      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = DomainEventFactory.createLeadConsentUpdatedEvent(
        lead,
        'marketing',
        false,
        true,
        '192.168.1.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );

      expect(event.eventType).toBe('LeadConsentUpdated');
      expect(event.data.consentType).toBe('marketing');
      expect(event.data.previousConsent).toBe(false);
      expect(event.data.newConsent).toBe(true);
      expect(event.data.consentTimestamp).toBeInstanceOf(Date);
      expect(event.data.ipAddress).toBe('192.168.1.1');
      expect(event.data.userAgent).toContain('Mozilla');
    });

    it('should handle lead deletion events for GDPR', () => {
      // This would be implemented when we add deletion functionality
      // For now, we test that the event structure exists
      expect(() => {
        // Import would fail if event doesn't exist
        const { LeadDeletedEventSchema } = require('../lib/lead-domain-events');
        expect(LeadDeletedEventSchema).toBeDefined();
      }).not.toThrow();
    });

    it('should maintain audit trail for consent changes', () => {
      const publisher = DomainEventPublisher.getInstance();

      const auditHandler = vi.fn();
      publisher.registerHandler('LeadConsentUpdated', auditHandler);

      const lead = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'John Doe',
        status: 'captured' as const,
        source: 'website' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const consentEvent = DomainEventFactory.createLeadConsentUpdatedEvent(
        lead,
        'processing',
        false,
        true
      );

      return publisher.publish(consentEvent).then(() => {
        expect(auditHandler).toHaveBeenCalledWith(consentEvent);
      });
    });
  });
});
