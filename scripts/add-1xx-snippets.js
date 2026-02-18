#!/usr/bin/env node
/**
 * Add standard code snippets from RESEARCH-INVENTORY to all 1.xx tasks that only have Related Patterns.
 */
const fs = require('fs');
const path = require('path');

const TASKS_DIR = path.join(__dirname, '..', 'tasks');

const STANDARD_SNIPPETS = `
### R-UI — React 19 component with ref (from RESEARCH-INVENTORY)
\`\`\`typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function MyPrimitive({ ref, className, ...props }: MyPrimitiveProps) {
  return (
    <Primitive.Root ref={ref} className={cn('base-styles', className)} {...props} />
  );
}
\`\`\`
### R-RADIX — ComponentRef type
\`\`\`typescript
type MyPrimitiveRef = React.ComponentRef<typeof Primitive.Root>;
\`\`\`
### R-A11Y — Touch target (2.5.8) and reduced motion
\`\`\`css
.touch-target { min-width: 24px; min-height: 24px; }
\`\`\`
\`\`\`typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
\`\`\`

`;

const FORM_SNIPPETS = `
### R-UI — React 19 component with ref (from RESEARCH-INVENTORY)
\`\`\`typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function MyPrimitive({ ref, className, ...props }: MyPrimitiveProps) {
  return (
    <Primitive.Root ref={ref} className={cn('base-styles', className)} {...props} />
  );
}
\`\`\`
### R-RADIX — ComponentRef type
\`\`\`typescript
type MyPrimitiveRef = React.ComponentRef<typeof Primitive.Root>;
\`\`\`
### R-FORM — Form with Zod resolver (from RESEARCH-INVENTORY)
\`\`\`typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1), email: z.string().email() });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});
\`\`\`
### R-A11Y — Touch target (2.5.8)
\`\`\`css
.touch-target { min-width: 24px; min-height: 24px; }
\`\`\`

`;

const sectionStart = '## Code Snippets / Examples\n\n';
const relatedOnly = '### Related Patterns\n';

const files = fs.readdirSync(TASKS_DIR)
  .filter(f => f.startsWith('1-') && f.endsWith('.md'))
  .sort((a, b) => {
    const na = a.match(/^1-(\d+)-/);
    const nb = b.match(/^1-(\d+)-/);
    return (na ? parseInt(na[1], 10) : 0) - (nb ? parseInt(nb[1], 10) : 0);
  });

let updated = 0;
for (const file of files) {
  const filePath = path.join(TASKS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const idx = content.indexOf(sectionStart);
  if (idx === -1) continue;
  const afterSection = content.slice(idx + sectionStart.length);
  if (!afterSection.startsWith(relatedOnly)) continue;
  const snippets = file === '1-23-create-form-component.md' ? FORM_SNIPPETS : STANDARD_SNIPPETS;
  const newSection = sectionStart + snippets.trim() + '\n\n' + relatedOnly + afterSection.slice(relatedOnly.length);
  content = content.slice(0, idx) + newSection;
  fs.writeFileSync(filePath, content, 'utf-8');
  updated++;
  console.log('Updated', file);
}
console.log('Done. Updated', updated, 'files.');