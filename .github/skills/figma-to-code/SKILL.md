---
name: figma-to-code
description: Convert Figma designs to production-ready React components using Figma MCP and design system patterns. Use this when asked to implement designs from Figma.
---

To convert Figma designs to React components:

1. **Access Figma design data**

   ```bash
   # Use Figma MCP to get design data
   npx @figma/mcp-server get-layer --file-id <file-id> --layer-id <layer-id>
   ```

2. **Analyze design structure**
   - Extract component hierarchy and properties
   - Identify reusable patterns and variants
   - Note spacing, typography, and color tokens

3. **Map to design system**
   - Check existing components in `packages/ui/`
   - Use design tokens from `packages/design-tokens/`
   - Follow shadcn/ui patterns for consistency

4. **Create React component structure**

   ```tsx
   'use client';

   import { cn } from '@/lib/utils';
   import { Button } from '@/components/ui/button';

   interface ComponentProps {
     className?: string;
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
   }

   export function Component({ className, variant = 'primary', size = 'md' }: ComponentProps) {
     return (
       <div className={cn('flex flex-col space-y-4', className)}>
         {/* Component implementation */}
       </div>
     );
   }
   ```

5. **Apply styling patterns**
   - Use Tailwind CSS classes from design tokens
   - Implement responsive design with mobile-first approach
   - Add hover and focus states for accessibility

6. **Handle dynamic content**
   - Use React props for dynamic text and images
   - Implement proper TypeScript types
   - Add loading states with Suspense

7. **Test component**

   ```bash
   # Run Storybook to visualize
   pnpm storybook
   ```

   - Test all variants and states
   - Verify responsive behavior
   - Check accessibility with axe-core

8. **Integration patterns**
   - Export from `packages/ui/index.ts`
   - Add to component documentation
   - Create usage examples

**Best Practices:**

- Always extract reusable components
- Use semantic HTML elements
- Implement proper ARIA labels
- Test with keyboard navigation
- Validate with accessibility tools

**Common Mappings:**

- Figma Auto Layout → Flexbox/Grid
- Figma Variants → Component props
- Figma Components → React components
- Figma Styles → CSS classes/Tokens

**Multi-tenant considerations:**

- Use theme tokens for brand customization
- Implement proper color contrast
- Test across different tenant configurations
