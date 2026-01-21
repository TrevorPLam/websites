# components/AGENTS.md — React Components

Last Updated: 2026-01-21
Applies To: Any agent working in components/

**Quick Reference:** See `/BESTPR.md` for comprehensive repo standards.

## Purpose
This folder contains all React components for the marketing website. Components are organized into page-level components (root) and primitive UI components (`ui/`).

---

## Folder Structure

```
components/
├── AGENTS.md           # This file
├── ui/                 # Design system primitives (Button, Card, Input, etc.)
│   └── AGENTS.md       # UI-specific guidance
├── [PageComponent].tsx # Page-level components
└── ...
```

---

## Component Categories

### Page-Level Components (Root)

| Component | Purpose | Rendering |
|-----------|---------|-----------|
| `Hero.tsx` | Homepage hero section | Server |
| `Navigation.tsx` | Site header with mobile menu | Client |
| `Footer.tsx` | Site footer | Server |
| `ContactForm.tsx` | Lead capture form | Client |
| `SearchDialog.tsx` | Site search modal | Client |
| `SearchPage.tsx` | Full search page | Client |
| `ServicesOverview.tsx` | Services grid on homepage | Server |
| `ServiceDetailLayout.tsx` | Template for service pages | Server |
| `BlogPostContent.tsx` | Blog post renderer | Server |
| `Breadcrumbs.tsx` | Navigation breadcrumbs | Client |
| `FinalCTA.tsx` | Bottom-of-page CTA | Server |
| `SocialProof.tsx` | Testimonials section | Server |
| `ValueProps.tsx` | Value propositions grid | Server |
| `ErrorBoundary.tsx` | Error handling wrapper | Client |
| `InstallPrompt.tsx` | PWA install prompt | Client |
| `AnalyticsConsentBanner.tsx` | Analytics consent prompt + script gate | Client |
| `SkipToContent.tsx` | Accessibility skip link | Server |

### UI Primitives (`ui/`)

See `components/ui/AGENTS.md` for detailed documentation.

---

## Patterns

### Server vs Client Components

**Server Components (default):**
- No `'use client'` directive
- Can use async/await for data
- Better performance (no JS sent to client)
- Use for: Static content, layouts, data display

**Client Components:**
- Must have `'use client'` at top of file
- Required for: Forms, state, event handlers, browser APIs
- Current client components: Navigation, ContactForm, SearchDialog, Breadcrumbs, ErrorBoundary, InstallPrompt, AnalyticsConsentBanner

### Props Pattern

```typescript
// Always use TypeScript interfaces
interface ComponentProps {
  required: string
  optional?: boolean
  children?: React.ReactNode
}

// Export default (not named exports)
export default function Component({ required, optional = false }: ComponentProps) {
  // ...
}
```

### Styling Pattern

```typescript
// Use Tailwind classes only
<div className="bg-charcoal text-white p-4">

// For conditional classes, use cn() from lib/utils
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class')}>

// NEVER use:
// - Inline styles
// - CSS modules
// - Arbitrary Tailwind values like bg-[#123456]
```

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `@/components/ui/*` | Local | Design system primitives |
| `@/lib/*` | Local | Utilities, actions, data |
| `lucide-react` | External | Icons |
| `next/link` | External | Client-side navigation |
| `next/image` | External | Optimized images |

---

## Creating a New Component

1. **Determine type**: Page-level (root) or primitive (ui/)
2. **Determine rendering**: Server (default) or Client (needs interactivity)
3. **Create file**: `ComponentName.tsx` (PascalCase)
4. **Add JSDoc**: Document purpose, key props, any special behavior
5. **Use existing UI components**: Check `ui/` before creating new primitives
6. **Update this file**: Add to the component table above

### Component Template

```tsx
/**
 * ComponentName — Brief description
 * 
 * @example
 * <ComponentName prop="value" />
 */

import React from 'react'

interface ComponentNameProps {
  /** Description of prop */
  prop: string
}

export default function ComponentName({ prop }: ComponentNameProps) {
  return (
    <div>
      {/* Implementation */}
    </div>
  )
}
```

---

## Testing

Tests live in `__tests__/components/`. Key test files:
- `Navigation.test.tsx` - Nav and mobile menu behavior
- `ContactForm.test.tsx` - Form validation and submission
- `ErrorBoundary.test.tsx` - Error handling
- `ui/components.test.tsx` - UI primitive tests

---

## Accessibility Requirements

- All interactive elements must have focus states
- Images must have meaningful alt text
- Form fields must have associated labels
- Use semantic HTML (section, nav, main, etc.)
- Mobile menu must trap focus when open
