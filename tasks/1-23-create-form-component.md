# 1.23 Create Form Component

## Metadata

- **Owner**: AGENT
- **Priority / Severity**: P1
- **Related Epics / ADRs**: Component Library Epic
- **Upstream Tasks**: 1-21-create-checkbox-component.md, 1-22-create-label-component.md, 1-20-create-radio-group-component.md
- **Downstream Tasks**: Tasks requiring form validation

## Context

Form wrapper with validation and error handling needed for robust form experiences. This is a Layer L2 component providing form validation integration with accessible error display.

## Dependencies

- **Package**: react-hook-form – required – provides form validation and state management
- **Package**: @hookform/resolvers – optional – for schema validation integration
- **Code**: packages/ui/src/components/Form.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: Checkbox, Label, Radio Group components must exist
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Contact forms, booking forms, admin interfaces

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use React Hook Form for robust form validation - [React Hook Form](https://react-hook-form.com/)
- **2026-02-18** Ensure compatibility with React 19 patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** Implement proper form validation patterns - [Form Validation Best Practices](https://www.w3.org/WAI/ARIA/apg/patterns/form/)

## Related Files

- `packages/ui/src/components/Form.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Form components

## Code Snippets / Examples

```typescript
// Expected API components
export const Form = React.forwardRef<...>(...)
export const FormField = React.forwardRef<...>(...)
export const FormItem = React.forwardRef<...>(...)
export const FormLabel = React.forwardRef<...>(...)
export const FormControl = React.forwardRef<...>(...)
export const FormDescription = React.forwardRef<...>(...)
export const FormMessage = React.forwardRef<...>(...)

// Usage examples
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="Enter your email" {...field} />
        </FormControl>
        <FormDescription>
          We'll never share your email with anyone else.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
  <Button type="submit">Submit</Button>
</Form>

// With Zod validation
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
});
```

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Integrates with React Hook Form
- [ ] Supports schema validation (Zod)
- [ ] Accessible error messages
- [ ] Form field composition works
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- Use React Hook Form or Zod only (no custom validation libraries)
- Must integrate with existing form controls (Input, Checkbox, etc.)
- Follow existing component patterns in the repo
- Support both controlled and uncontrolled forms

## Accessibility & Performance Requirements

- Accessibility: Follow ARIA patterns for form validation and error announcements
- Performance: Efficient validation and minimal re-renders
- Error: Clear, accessible error messages with proper association

## Implementation Plan

- [ ] Install and import react-hook-form and resolvers
- [ ] Create Form component suite with forwarding refs
- [ ] Add React Hook Form integration
- [ ] Add schema validation support
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Form validation tests
- Error message display tests
- Schema validation integration tests

## Documentation Updates

- [ ] Add Form to component library docs
- [ ] Update component index/registry

## Design References

- React Hook Form documentation for API reference
- ARIA Form Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
