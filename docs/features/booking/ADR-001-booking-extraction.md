# ADR-001: Booking Feature Extraction and Configuration-Driven Architecture

**Status:** Accepted  
**Date:** 2026-02-17  
**Deciders:** Auto (AI Agent)  
**Context:** Task 2.12 - Extract Booking Feature

**Evolution note:** Per [evolution-roadmap](../../architecture/evolution-roadmap.md), booking will evolve toward **canonical types** (Phase 2) and a **repository pattern** for internal storage. Adapters will translate to/from canonical; ADR-001 adapter pattern remains valid.

## Context

The booking feature was originally implemented in `clients/starter-template/features/booking/` with hardcoded service types and time slots. This prevented reuse across different industries and required code duplication for each new template.

## Decision

Extract booking feature to `packages/features/src/booking/` with a configuration-driven architecture:

1. **Configuration Interface**: Created `BookingFeatureConfig` that derives from `site.config.ts` `conversionFlow` (BookingFlowConfig)
2. **Schema Factory Pattern**: Replaced hardcoded `SERVICE_TYPES` and `TIME_SLOTS` with `createBookingFormSchema(config)` factory function
3. **Provider Adapter Pattern**: Introduced `BookingProviderAdapter` interface and `BaseBookingProviderAdapter` abstract class to eliminate ~300 lines of duplicated code across providers
4. **Configurable Components**: Updated `BookingForm` to accept `config` prop instead of using hardcoded constants

## Consequences

### Positive

- ✅ **Template-agnostic**: Booking feature can be used by any template with appropriate configuration
- ✅ **Reduced duplication**: Provider adapter pattern eliminates ~300 lines of duplicated code
- ✅ **Type-safe configuration**: Full TypeScript support for configuration-driven setup
- ✅ **Maintainability**: Single source of truth for booking logic
- ✅ **Extensibility**: Easy to add new providers via adapter pattern

### Negative

- ⚠️ **Migration required**: Existing templates must update to use new config-based API
- ⚠️ **Breaking change**: Old hardcoded constants no longer available
- ⚠️ **Configuration overhead**: Templates must provide `BookingFeatureConfig` when using BookingForm

### Neutral

- Configuration is derived from `site.config.ts`, maintaining single source of truth
- Backward compatibility can be maintained via wrapper functions if needed

## Implementation Details

### Configuration Flow

```typescript
// site.config.ts
conversionFlow: {
  type: 'booking',
  serviceCategories: ['haircut-style', 'color-highlights', ...],
  timeSlots: [
    { value: 'morning', label: 'Morning (9am - 12pm)' },
    ...
  ],
  maxAdvanceDays: 90,
}

// Usage
import { createBookingConfig } from '@repo/features/booking';
import { BookingForm } from '@repo/features/booking';

const config = createBookingConfig(siteConfig.conversionFlow);
<BookingForm config={config} />
```

### Provider Adapter Pattern

```typescript
// Base adapter provides common functionality
class BaseBookingProviderAdapter {
  abstract mapServiceId(serviceType: string): string;
  abstract mapTimeSlot(timeSlot: string): string;
  abstract buildRequestBody(data: BookingFormData): Record<string, unknown>;
  abstract parseResponse(json: unknown): BookingProviderResponse;

  // Common createBooking logic with error handling
  async createBooking(data: BookingFormData): Promise<BookingProviderResponse> {
    // Shared implementation
  }
}

// Provider-specific implementations
class MindbodyProvider extends BaseBookingProviderAdapter {
  mapServiceId(serviceType: string): string {
    /* ... */
  }
  // ...
}
```

## Alternatives Considered

1. **Keep hardcoded constants**: Rejected - prevents reuse across templates
2. **Environment variables**: Rejected - not flexible enough, requires deployment changes
3. **Database-driven config**: Rejected - overkill for static configuration, adds complexity
4. **Props-only approach**: Rejected - loses type safety and validation

## References

- Task 2.12: Extract Booking Feature
- TASKS.md (Part 2 Research): Adapter Pattern best practices
- ANALYSIS_ENHANCED.md: Provider duplication findings (INT-1)
