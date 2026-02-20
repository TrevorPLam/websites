# Booking Feature Usage Guide

**Package:** `@repo/features/booking`  
**Version:** 1.0.0  
**Last Updated:** 2026-02-17

## Overview

The booking feature provides a configurable appointment scheduling system that derives its configuration from `site.config.ts`. It supports multiple external booking providers (Mindbody, Vagaro, Square) via an adapter pattern.

## Quick Start

### 1. Configure Site Config

Ensure your `site.config.ts` has a `booking` conversion flow:

```typescript
import type { SiteConfig } from '@repo/types';

const siteConfig: SiteConfig = {
  // ... other config
  conversionFlow: {
    type: 'booking',
    serviceCategories: [
      'haircut-style',
      'color-highlights',
      'treatment',
      'special-occasion',
      'consultation',
    ],
    timeSlots: [
      { value: 'morning', label: 'Morning (9am - 12pm)' },
      { value: 'afternoon', label: 'Afternoon (12pm - 4pm)' },
      { value: 'evening', label: 'Evening (4pm - 8pm)' },
    ],
    maxAdvanceDays: 90,
  },
};
```

### 2. Create Booking Config

```typescript
import { createBookingConfig } from '@repo/features/booking';
import type { BookingFeatureConfig } from '@repo/features/booking';

const bookingConfig: BookingFeatureConfig = createBookingConfig(siteConfig.conversionFlow);
```

### 3. Use BookingForm Component

```typescript
import { BookingForm } from '@repo/features/booking';

export default function BookPage() {
  const bookingConfig = createBookingConfig(siteConfig.conversionFlow);

  return (
    <div>
      <h1>Book an Appointment</h1>
      <BookingForm
        config={bookingConfig}
        prefilledService="haircut-style"
        onSuccess={(result) => {
          console.log('Booking submitted:', result.confirmationNumber);
        }}
        onError={(error) => {
          console.error('Booking failed:', error);
        }}
      />
    </div>
  );
}
```

## API Reference

### `createBookingConfig(flowConfig: BookingFlowConfig): BookingFeatureConfig`

Creates booking feature configuration from site config conversion flow.

**Parameters:**

- `flowConfig`: BookingFlowConfig from `site.config.ts`

**Returns:** `BookingFeatureConfig` with services, timeSlots, and maxAdvanceDays

**Example:**

```typescript
const config = createBookingConfig(siteConfig.conversionFlow);
// {
//   services: [
//     { id: 'haircut-style', label: 'Haircut Style' },
//     ...
//   ],
//   timeSlots: [
//     { value: 'morning', label: 'Morning (9am - 12pm)' },
//     ...
//   ],
//   maxAdvanceDays: 90,
// }
```

### `BookingForm` Component

Configurable booking form component.

**Props:**

- `config: BookingFeatureConfig` (required) - Booking configuration
- `className?: string` - Optional CSS class
- `prefilledService?: string` - Pre-select a service type
- `onSuccess?: (result: BookingSubmissionResult) => void` - Success callback
- `onError?: (error: string) => void` - Error callback

**Example:**

```typescript
<BookingForm
  config={bookingConfig}
  prefilledService="consultation"
  onSuccess={(result) => {
    router.push(`/booking-confirmation?id=${result.bookingId}`);
  }}
/>
```

### `submitBookingRequest(formData: FormData, config: BookingFeatureConfig)`

Server action for submitting booking requests.

**Parameters:**

- `formData: FormData` - Form data from BookingForm
- `config: BookingFeatureConfig` - Booking configuration

**Returns:** `Promise<BookingSubmissionResult>`

**Example:**

```typescript
'use server';

import { submitBookingRequest } from '@repo/features/booking';
import { createBookingConfig } from '@repo/features/booking';

export async function handleBooking(formData: FormData) {
  const config = createBookingConfig(siteConfig.conversionFlow);
  return await submitBookingRequest(formData, config);
}
```

## Customization

### Custom Service Labels

By default, service labels are auto-generated from IDs. To customize:

```typescript
const config = createBookingConfig(siteConfig.conversionFlow);
config.services = config.services.map((service) => ({
  ...service,
  label: customLabels[service.id] ?? service.label,
}));
```

### Custom Notes Placeholder

```typescript
const config = createBookingConfig(siteConfig.conversionFlow);
config.notesPlaceholder = 'Any specific requests or hair history...';
config.notesLabel = 'Notes for Stylist (Optional)';
```

## Provider Integration

The booking feature supports multiple external providers via adapter pattern:

- **Mindbody**: Wellness platform integration
- **Vagaro**: Appointment scheduling platform
- **Square**: Square Appointments API

Providers are configured via environment variables:

```env
MINDBODY_ENABLED=true
MINDBODY_API_KEY=your_api_key
MINDBODY_BUSINESS_ID=your_business_id

VAGARO_ENABLED=true
VAGARO_API_KEY=your_api_key
VAGARO_BUSINESS_ID=your_business_id

SQUARE_ENABLED=true
SQUARE_API_KEY=your_api_key
SQUARE_BUSINESS_ID=your_business_id
```

## Migration from Template

If migrating from `clients/starter-template/features/booking/`:

1. **Remove hardcoded imports:**

   ```typescript
   // Old
   import { SERVICE_TYPES, TIME_SLOTS } from '@/features/booking';

   // New
   import { createBookingConfig } from '@repo/features/booking';
   ```

2. **Update BookingForm usage:**

   ```typescript
   // Old
   <BookingForm />

   // New
   const config = createBookingConfig(siteConfig.conversionFlow);
   <BookingForm config={config} />
   ```

3. **Update server actions:**

   ```typescript
   // Old
   import { submitBookingRequest } from '@/features/booking';
   await submitBookingRequest(formData);

   // New
   import { submitBookingRequest, createBookingConfig } from '@repo/features/booking';
   const config = createBookingConfig(siteConfig.conversionFlow);
   await submitBookingRequest(formData, config);
   ```

## Type Safety

All types are exported from `@repo/features/booking`:

```typescript
import type {
  BookingFeatureConfig,
  BookingFormData,
  BookingSubmissionResult,
  BookingProvider,
  BookingProviderResponse,
} from '@repo/features/booking';
```

## Security

- ✅ Input validation via Zod schemas
- ✅ XSS protection via sanitization
- ✅ Bot detection via honeypot fields
- ✅ Rate limiting per email/IP
- ✅ Fraud detection patterns
- ✅ Secure provider API integration

## Testing

See `packages/features/src/booking/lib/__tests__/` for test examples.

## Evolution: Canonical Types and Repository

Per [NEW.md](../../NEW.md) and [ADR-012](../../adr/0012-canonical-types-data-contracts.md) (Phase 2):

- **Canonical types** — Booking will move to canonical types in `@repo/types/src/canonical/` (e.g. `CanonicalBookingRequest`, `CanonicalBookingResult`). Integration adapters translate provider-specific types to/from canonical.
- **Repository pattern** — Internal booking storage may use a `BookingRepository` interface; external providers remain adapter-based.
- **Current state** — Existing `BookingFormData`, `BookingSubmissionResult` continue; canonical migration is incremental (evol-5, evol-6).

## Related Documentation

- [ADR-001: Booking Feature Extraction](./ADR-001-booking-extraction.md)
- [ADR-012: Canonical Types and Data Contracts](../../adr/0012-canonical-types-data-contracts.md)
- [Site Configuration Guide](../../configuration/site-config.md)
- [Provider Integration Guide](./providers.md)
