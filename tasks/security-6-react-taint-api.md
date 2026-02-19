# Security-6: React Taint API Implementation

## Metadata

- **Task ID**: security-6-react-taint-api
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Data leakage prevention, Server Action security, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-1-server-action-hardening
- **Downstream Tasks**: None

## Context

Server Actions can accidentally leak sensitive data (PII, session tokens, internal IDs) to client components. React Taint API (`experimental_taintObjectReference`) provides compile-time and runtime protection by marking sensitive objects as "not for client consumption."

Current state: No React Taint API usage. Server Actions return DTOs but don't prevent accidental leakage of sensitive fields.

This addresses **Research Topic: React Taint API** from gemini2.md.

## Dependencies

- **Upstream Task**: `security-1-server-action-hardening` — secureAction wrapper must be in place
- **Required Packages**: React 19.0.0 (already in use), `@repo/infra`
- **React Version**: Requires React 19 (experimental API)

## Research

- **Primary topics**: [R-REACT-TAINT-API](RESEARCH-INVENTORY.md#r-react-taint-api) (new)
- **[2026-02] Gemini Research**: React Taint API prevents sensitive data leakage:
  - `experimental_taintObjectReference`: Marks objects as tainted (cannot be serialized to client)
  - `experimental_taintUniqueValue`: Marks unique values (IDs, tokens) as tainted
  - Build-time and runtime errors if tainted data reaches Client Components
- **Threat Model**: Accidental PII exposure, session token leakage, internal ID exposure
- **References**:
  - [docs/archive/research/gemini-production-audit-2026.md](../docs/archive/research/gemini-production-audit-2026.md) (Topic: Server Action Security)

## Related Files

- `packages/infra/src/security/taint.ts` – create – Taint API utilities
- `packages/infra/src/security/secure-action.ts` – modify – Integrate taint API for DTOs
- `packages/features/src/booking/lib/booking-actions.ts` – modify – Use taint API for sensitive fields
- `docs/architecture/security/react-taint-api.md` – create – Document taint API usage

## Acceptance Criteria

- [ ] Taint utility created: `packages/infra/src/security/taint.ts`
  - Helper functions for tainting sensitive objects
  - Type-safe wrappers for common patterns
- [ ] `secureAction` wrapper integrates taint API:
  - Automatically taints sensitive fields in DTOs
  - Configurable taint rules per action type
- [ ] Booking actions use taint API:
  - Session tokens tainted
  - Internal booking IDs tainted (use public IDs instead)
  - PII fields sanitized before serialization
- [ ] Documentation created: `docs/architecture/security/react-taint-api.md`
- [ ] Unit tests verify taint API behavior
- [ ] Build-time errors catch taint violations

## Technical Constraints

- Requires React 19.0.0 (experimental API)
- Must work with Next.js Server Actions serialization
- Taint API is experimental — monitor for breaking changes

## Implementation Plan

### Phase 1: Core Infrastructure

- [ ] Create `packages/infra/src/security/taint.ts`:

  ```typescript
  import { experimental_taintObjectReference, experimental_taintUniqueValue } from 'react';

  export function taintSensitiveObject<T extends object>(obj: T, reason: string): T {
    experimental_taintObjectReference(reason, obj);
    return obj;
  }

  export function taintUniqueValue(value: string | number, reason: string): void {
    experimental_taintUniqueValue(reason, value);
  }
  ```

### Phase 2: Integration

- [ ] Integrate taint API into `secureAction` wrapper
- [ ] Create DTO sanitization helpers:
  - `sanitizeBookingDTO`: Removes sensitive fields, taints remaining sensitive data
  - `sanitizeUserDTO`: Removes PII, taints internal IDs

### Phase 3: Application

- [ ] Refactor booking actions to use taint API
- [ ] Add taint checks to other Server Actions (user profile, admin actions)

### Phase 4: Documentation & Testing

- [ ] Document taint API usage patterns
- [ ] Write unit tests for taint utilities
- [ ] Verify build-time errors catch violations

## Testing

- [ ] Unit tests for taint utilities
- [ ] Integration tests verify tainted data cannot be serialized
- [ ] Build-time test: Attempt to pass tainted data to Client Component (should fail)

## Notes

- React Taint API is experimental — monitor React releases for changes
- Complements `security-1-server-action-hardening` by adding data leakage prevention
- Should be implemented alongside secureAction wrapper for maximum security
