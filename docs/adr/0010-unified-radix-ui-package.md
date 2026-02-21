# ADR-0010: Unified Radix UI Package Strategy

## Status

Accepted

## Context

When implementing UI primitives for the marketing website monorepo, we needed to choose between:

1. Individual `@radix-ui/react-*` packages (traditional approach)
2. New unified `radix-ui` package (2026 best practice)

The Dialog component (Task 1.1) was the first primitive requiring this decision.

## Decision

**Use the unified `radix-ui` package for all new UI components.**

## Rationale

### Benefits of Unified Package

1. **Simplified Dependency Management**
   - Single dependency instead of multiple `@radix-ui/react-*` packages
   - Reduces package.json complexity
   - Eliminates version conflicts between Radix packages

2. **Better Tree Shaking**
   - Unified package is fully tree-shakable
   - Only ships components actually used
   - No bundle size penalty

3. **2026 Industry Standard**
   - Recommended by shadcn/ui as of February 2026
   - Aligns with current best practices
   - Future-proof choice

4. **Cleaner Imports**

   ```typescript
   // Before (individual packages)
   import { Dialog as DialogPrimitive } from '@radix-ui/react-dialog';

   // After (unified package)
   import { Dialog as DialogPrimitive } from 'radix-ui';
   ```

### Migration Considerations

- Existing components using individual packages continue to work
- Gradual migration possible using shadcn CLI: `pnpm dlx shadcn@latest migrate radix`
- No breaking changes to component APIs

## Implementation

### Package Configuration

```yaml
# pnpm-workspace.yaml
catalog:
  'radix-ui': '^1.0.0'
```

```json
// packages/ui/package.json
{
  "dependencies": {
    "radix-ui": "catalog:"
  }
}
```

### Component Pattern

```typescript
// Dialog.tsx example
import { Dialog as DialogPrimitive } from 'radix-ui';
```

## Consequences

### Positive

- ✅ Cleaner dependency graph
- ✅ Better developer experience
- ✅ Industry-standard approach
- ✅ Improved bundle efficiency
- ✅ Future-proof architecture

### Negative

- ⚠️ Requires migration for existing components (low effort)
- ⚠️ New pattern may require developer adjustment

### Risks

- **Low**: Unified package is well-maintained by Radix team
- **Low**: Backward compatibility maintained
- **Mitigation**: Gradual migration strategy available

## Future Implications

- All new UI primitives (Toast, Tabs, Dropdown, etc.) will use unified package
- Existing components will migrate during normal maintenance cycles
- Documentation will reflect unified package pattern

## References

- [shadcn/ui February 2026 Migration Guide](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui)
- [Radix Primitives Documentation](https://www.radix-ui.com/primitives)
- [Tree Shaking Performance Analysis](https://github.com/radix-ui/primitives/issues/336)

## Implementation Status

- [x] Dialog component using unified `radix-ui` package
- [x] Package configuration updated
- [x] Catalog entry added
- [ ] Migrate existing components (future maintenance)

---

_This ADR was created as part of Task 1.1 (Dialog Component implementation) and will guide all future UI primitive development. Renumbered from ADR-0005 to ADR-0010 to resolve duplicate numbering conflict._
