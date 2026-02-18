# 1.14 Create Breadcrumb Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P2
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring navigation trails

## Context

Navigation breadcrumb trail with separator customization needed for site hierarchy. This is a Layer L2 component providing accessible navigation path with SEO benefits.

## Dependencies

- **Package**: @radix-ui/react-navigation-menu – optional – for navigation patterns
- **Code**: packages/ui/src/components/Breadcrumb.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Page templates, navigation features

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI primitives for accessibility and consistency - [Radix UI Navigation](https://www.radix-ui.com/primitives/docs/components/navigation-menu)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement SEO best practices for breadcrumbs - [Google Breadcrumb Guidelines](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## Related Files

- `packages/ui/src/components/Breadcrumb.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Breadcrumb components

## Code Snippets / Examples

```typescript
// Expected API components
export const Breadcrumb = React.forwardRef<...>(...)
export const BreadcrumbList = React.forwardRef<...>(...)
export const BreadcrumbItem = React.forwardRef<...>(...)
export const BreadcrumbLink = React.forwardRef<...>(...)
export const BreadcrumbSeparator = React.forwardRef<...>(...)
export const BreadcrumbPage = React.forwardRef<...>(...)

// Usage examples
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Renders breadcrumb trail with proper hierarchy
- [ ] Customizable separators (string or ReactNode)
- [ ] Supports maxItems for truncation
- [ ] Keyboard accessible navigation
- [ ] Proper ARIA attributes for screen readers
- [ ] SEO structured data support
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- Manual item creation only (no auto-generation from routes)
- Must follow existing component patterns in the repo
- Support custom separators and truncation
- Include structured data for SEO

## Accessibility & Performance Requirements

- Accessibility: Follow Radix UI implementation for screen readers and keyboard navigation
- Performance: Minimal runtime overhead; efficient rendering of long trails
- SEO: Include structured data for search engines

## Implementation Plan

- [ ] Create Breadcrumb component suite with forwarding refs
- [ ] Add separator customization support
- [ ] Add maxItems truncation logic
- [ ] Include ARIA attributes and structured data
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Keyboard navigation tests
- Visual regression tests for separator variants
- SEO structured data validation

## Documentation Updates

- [ ] Add Breadcrumb to component library docs
- [ ] Update component index/registry

## Design References

- Radix UI Navigation documentation for patterns
- Google Structured Data guidelines for breadcrumbs

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
