# Component API Consistency Patterns

**Last Updated:** 2026-02-19  
**Purpose:** Document consistent component API patterns to prevent type mismatches and build failures.

---

## Core Principles

### 1. Type Safety First

- Component props must exactly match their type definitions
- Use singular prop names for single items (`member`) vs arrays (`members`)
- Verify property names match type interfaces (`src` not `image`)

### 2. Export Management

- Avoid duplicate exports in barrel files (index.ts)
- Centralize component family exports
- Use explicit exports rather than re-exports when conflicts exist

### 3. Cross-Package Dependencies

- Test builds across dependency chains, not just individual packages
- Marketing-components build failures can block dependent packages
- Verify component APIs are stable before publishing

---

## Common Anti-Patterns

### ❌ Type Mismatches

```typescript
// WRONG - Component expects 'src' but uses 'image'
interface GalleryItem {
  src: string;
  alt: string;
}

// Component usage
<img src={item.image} alt={item.title} /> // Type error
```

### ✅ Correct Pattern

```typescript
// CORRECT - Match type definition exactly
<img src={item.src} alt={item.alt} />
```

### ❌ Duplicate Exports

```typescript
// WRONG - Duplicate exports cause compilation failures
export { GalleryGrid } from './gallery/GalleryGrid';
export { GalleryGrid } from './gallery'; // Duplicate!
```

### ✅ Correct Pattern

```typescript
// CORRECT - Single export source
export { GalleryGrid } from './gallery/GalleryGrid';
// OR use barrel export from components
export * from './components/Gallery';
```

### ❌ Prop Inconsistency

```typescript
// WRONG - Component expects singular but receives array
interface TeamDetailedProps {
  member: TeamMember; // Singular
}

// Usage
<TeamDetailed members={[member]} /> // Wrong prop name
```

### ✅ Correct Pattern

```typescript
// CORRECT - Match prop interface exactly
<TeamDetailed member={member} />
```

---

## Verification Checklist

Before considering component work complete:

- [ ] All component props match their TypeScript interfaces
- [ ] No duplicate exports in index.ts files
- [ ] Build passes for component package AND dependent packages
- [ ] Type-check passes: `pnpm --filter @repo/package-name type-check`
- [ ] No "Property does not exist" TypeScript errors
- [ ] No "Duplicate identifier" compilation errors

---

## Build Pipeline Testing

Always test across the dependency chain:

```bash
# Test individual package
pnpm --filter @repo/marketing-components build

# Test dependent packages
pnpm --filter @repo/features build

# Full monorepo build
pnpm build
```

---

## Lessons from Field

### Task 0-6 Case Study

- **Issue**: GalleryGrid used `item.image` but GalleryItem type defined `src`
- **Impact**: Marketing-components build failed, blocking features package
- **Fix**: Updated component to use correct property names
- **Lesson**: Single type mismatch can cascade through entire build pipeline

### Export Management

- **Issue**: Duplicate GalleryGrid exports in index.ts
- **Impact**: TypeScript compilation errors
- **Fix**: Removed duplicate exports, centralized component family exports
- **Lesson**: Barrel files need careful curation to avoid identifier collisions

### Cross-Package Dependencies

- **Issue**: TeamDetailed prop mismatch in features package
- **Impact**: Build failures surfaced in dependent package
- **Fix**: Updated prop usage to match component interface
- **Lesson**: Test builds across dependency chains, not just individual packages

---

## Integration with Development Workflow

1. **During Development**: Check component props against type definitions
2. **Before PR**: Run `pnpm build` to verify cross-package compatibility
3. **Code Review**: Verify API consistency and export management
4. **CI Pipeline**: Full monorepo build catches dependency issues early

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Common pitfalls and build requirements
- [tasks/README.md](../tasks/README.md) - Task execution patterns
- [RESEARCH-INVENTORY.md](../tasks/RESEARCH-INVENTORY.md) - Research topics and standards
