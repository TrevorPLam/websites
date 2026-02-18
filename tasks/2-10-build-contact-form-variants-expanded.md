# 2.10 Build Contact Form Variants (Expanded)

## Metadata

- **Task ID**: 2-10-build-contact-form-variants-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.23 (Form), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Contact Form variants with validation and integration. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Map, With Office Info, Multi-Step, With File Upload, With Calendar, With Chat, Sidebar, Full Page (10+ total)
- **Validation:** Client-side validation, error messages, success states
- **Integration:** Email service, CRM integration, webhook support

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.23 (Form) – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.23 (Form), 1.2 (Button); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics

- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-FORM**: React Hook Form, Zod, validation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-form) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References

- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-FORM](RESEARCH-INVENTORY.md#r-form) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/marketing-components/src/contact/types.ts` – modify – (see task objective)
- `ContactFormStandard.tsx` – modify – (see task objective)
- `ContactFormMinimal.tsx` – modify – (see task objective)
- `ContactFormWithMap.tsx` – modify – (see task objective)
- `ContactFormMultiStep.tsx` – modify – (see task objective)
- `ContactFormWithUpload.tsx` – modify – (see task objective)
- `contact/validation.tsx` – modify – (see task objective)
- `contact/integration.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### R-MARKETING — Contact form with composition

```typescript
interface ContactFormProps {
  title?: string;
  description?: string;
  variant?: 'standard' | 'minimal' | 'with-map' | 'multi-step';
  fields: ContactField[];
  onSubmit: (data: ContactFormData) => void;
  children?: React.ReactNode;
}
export function ContactForm({ title, description, variant = 'standard', fields, onSubmit, children }: ContactFormProps) {
  return (
    <section>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <form onSubmit={onSubmit}>{/* form fields */}</form>
      {children}
    </section>
  );
}
```

### R-UI — React 19 component with ref forwarding

```typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function ContactFormWrapper({ ref, className, ...props }: ContactFormWrapperProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('contact-form', className)}
      {...props}
    />
  );
}
```

### ComponentRef type for type-safe ref forwarding

```typescript
type ContactFormWrapperRef = React.ComponentRef<typeof Primitive.Root>;
```

### R-FORM — Form with Zod resolver

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().optional(),
  phone: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const form = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  defaultValues: { name: '', email: '', message: '', phone: '' },
});
```

### R-A11Y — Touch targets and form accessibility

```css
.contact-form-submit {
  min-width: 24px;
  min-height: 24px;
}

.contact-form-field {
  /* Ensure proper labeling and error association */
}
```

### Reduced motion detection

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### R-PERF — LCP optimization

- Page shell < 250 KB gzipped; component-level budgets (e.g. contact form < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets

### R-RADIX — Primitive wrapper pattern

```typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const ContactFormRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('contact-form-root', className)} {...props} />
));
```

### Form integration (from 1.23)

```typescript
interface FormProps {
  onSubmit: (data: any) => void;
  validation?: any;
  children: React.ReactNode;
}
```

### Button integration (from 1.2)

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Contact form types

```typescript
interface ContactField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for select fields
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  [key: string]: any; // for custom fields
}
```

### Form validation hook

```typescript
import { useFormState } from 'react-hook-form';

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    formState: { errors },
  } = useForm();

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Submit logic here
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, submitStatus, errors };
}
```

## Acceptance Criteria

- [ ] Types; variants; validation; integration; export.
- [ ] All 10+ variants render
- [ ] validation works
- [ ] integrations functional
- [ ] accessible.

## Technical Constraints

- No custom field types
- standard inputs only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; validation; integration; export.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes
