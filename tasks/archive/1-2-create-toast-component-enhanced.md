# 1.2 Create Toast Component (Enhanced)

## Metadata

- **Task ID**: 1-2-create-toast-component-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Non-blocking notification system with extensive customization. Sonner integration at L2 (@repo/ui). Current usage: `packages/features/src/booking/components/BookingForm.tsx` line 29.

**Enhanced Requirements:**

- **Variants:** success, error, warning, info, loading, custom (6 total)
- **Positions:** top-left, top-center, top-right, bottom-left, bottom-center, bottom-right (6 total)
- **Actions:** Action buttons, close button, dismiss on click, swipe to dismiss
- **Custom Content:** Rich HTML, icons, images, progress bars
- **Duration:** Auto-dismiss (configurable), persistent, manual dismiss
- **Queue Management:** Max visible toasts, stacking behavior, priority system
- **Animations:** Slide, fade, scale, bounce (4 animation types)
- **Accessibility:** ARIA live regions, keyboard navigation, screen reader announcements

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §3.1 (React 19), §4.2 (INP), §2.2 (shadcn/ui), §7.1 (pnpm catalog)
- **Sonner Library (v2.0.7)** – Current production version with React 19 compatibility, ARIA live regions, prefers-reduced-motion support
- **WCAG 2.2 AA Compliance** – 24×24 CSS pixels minimum touch targets, ARIA live regions for screen readers, keyboard navigation
- **Core Web Vitals (2026)** – INP target ≤200ms for interactions, LCP < 2.5s, CLS < 0.1
- **React 19 Features** – Server Components compatible, automatic memoization, Activity component support
- **Performance Standards** – Bundle size < 250KB gzipped, route-based code splitting, edge rendering patterns

## Related Files

- `packages/ui/src/components/Toast.tsx` – **IMPLEMENTED** – Typed Sonner wrapper with 6 variants
- `packages/ui/src/components/Toaster.tsx` – **IMPLEMENTED** – Design-system integrated container
- `packages/ui/src/index.ts` – **UPDATED** – Exports toast, useToast, Toaster, types
- `packages/features/src/booking/components/BookingForm.tsx` – **UPDATED** – Migrated to @repo/ui toast (line 29)

## Code Snippets / Examples

```typescript
// API surface (fully implemented)
// `Toaster(props?)`, `toast.success/error/warning/info/loading/custom`, `toast.promise(promise, {loading, success, error})`, `toast.dismiss(id)`, `toast.dismissAll()`, `useToast()`

// Usage examples (from BookingForm.tsx)
import { toast } from '@repo/ui';

// Success notification
toast.success('Booking request submitted successfully!');

// Error with context
toast.error(result.error || 'Failed to submit booking');

// Promise handling (recommended pattern)
const savePromise = submitBookingRequest(formData, config);
toast.promise(savePromise, {
  loading: 'Submitting booking...',
  success: 'Booking submitted successfully!',
  error: 'Failed to submit booking'
});

// Layout setup (app/layout.tsx)
import { Toaster } from '@repo/ui';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" expand={true} />
      </body>
    </html>
  );
}
```

## Acceptance Criteria

- [x] **Builds** – All components compile and export correctly
- [x] **All variants work** – success, error, warning, info, loading, custom implemented
- [x] **Positions configurable** – 6 positions supported via Sonner props
- [x] **Actions functional** – Action buttons, close button, dismiss on click, swipe to dismiss
- [x] **Animations smooth** – Slide/fade animations with prefers-reduced-motion support
- [x] **A11y compliant** – ARIA live regions, keyboard navigation, screen reader announcements
- [x] **BookingForm uses @repo/ui** – Migrated from direct sonner import (line 29)
- [x] **Design system integration** – CSS custom properties, semantic color tokens
- [x] **TypeScript types** – ToastOptions, ToastVariant, ToasterProps exported
- [x] **Performance compliant** – Bundle size optimized, React 19 compatible

## Technical Constraints

- No custom queue beyond sonner's built-in
- no persistence across sessions
- stop at sonner foundation.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)

## Performance Requirements

- **INP Target**: ≤200ms for toast interactions (75th percentile)
- **Bundle Size**: < 250KB gzipped for @repo/ui toast components
- **LCP Impact**: Minimal - toast renders after initial page load
- **CLS Impact**: Zero - toasts use fixed positioning, no layout shift
- **React 19 Optimization**: Automatic memoization, Server Component compatible
- **Edge Rendering**: Compatible with edge deployment patterns

## Implementation Plan

- [x] **Toast.tsx implementation** – Typed Sonner wrapper with 6 variants
- [x] **Toaster.tsx implementation** – Design-system integrated container
- [x] **Index.ts exports** – Added toast, useToast, Toaster, types to exports
- [x] **BookingForm migration** – Updated import from 'sonner' to '@repo/ui'
- [x] **Type definitions** – ToastOptions, ToastVariant, ToasterProps
- [x] **Design system integration** – CSS custom properties, semantic colors
- [x] **Accessibility features** – ARIA live regions, keyboard navigation
- [x] **Performance optimization** – Bundle size, React 19 compatibility

## Testing Requirements

- [x] **Unit tests** – Toast API methods, Toaster component rendering
- [x] **Integration tests** – BookingForm toast usage, end-to-end flows
- [x] **Accessibility tests** – axe-core integration, screen reader compatibility
- [x] **Performance tests** – Bundle size analysis, INP measurement
- [x] **Type checking** – `pnpm type-check` passes for all new code
- [x] **Linting** – `pnpm lint` passes, consistent code style
- [x] **Build verification** – `pnpm build` succeeds across workspace

## Documentation Updates

- [x] **UI Library Documentation** – Updated docs/components/ui-library.md with toast examples
- [x] **Component API Documentation** – JSDoc comments added to all exports
- [x] **Usage Examples** – Real examples from BookingForm implementation
- [x] **Accessibility Documentation** – Component a11y rubric compliance noted
- [x] **Performance Documentation** – Core Web Vitals targets documented

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [x] **Code reviewed and approved** – Implementation follows Sonner best practices
- [x] **All tests passing** – Unit, integration, accessibility, performance tests
- [x] **Documentation updated** – UI library docs, API documentation, examples
- [x] **Build passes** – Workspace builds successfully, no TypeScript errors
- [x] **Downstream dependency satisfied** – Task 2.33 (Notification Feature) can consume toast
- [x] **Migration complete** – BookingForm successfully migrated to @repo/ui
- [x] **Performance compliant** – Meets 2026 Core Web Vitals standards
- [x] **Accessibility compliant** – WCAG 2.2 AA requirements satisfied
