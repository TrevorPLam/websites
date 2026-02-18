# UI Primitives (1.2–1.6) — Normalized Specs

**Optional Mode:** UI primitive → enforce Radix pattern + controlled/uncontrolled where applicable.
**Shared Dependencies:** `@repo/utils` (cn), `class-variance-authority` (cva), React 19.
**2026 Updates:** Unified Radix UI package, React 19 features, WCAG 3.0 preparation, Tailwind v4.

---

## 1.2 Toast Component

### 1️⃣ Objective Clarification

- Problem: No non-blocking notification system; users need feedback without modal blocking
- Layer: L2 (@repo/ui)
- Introduces: UI runtime (Toaster provider), sonner integration
- Uses `sonner` already in template; no new runtime contracts

### 2️⃣ Dependency Check

- **Completed:** None required
- **Packages:** `sonner: '^2.0.7'` in pnpm catalog (React 19 compatible: `'^18.0.0 || ^19.0.0 || ^19.0.0-rc'`)
- **Environment:** Client-only; must run in browser
- **CI:** `pnpm --filter @repo/ui build` green
- **Blockers:** None
- **2026 Notes:** Sonner v2.0.7 fully compatible with React 19.2; no useEffectEvent needed. Optional: use with Server Actions/useTransition for async feedback. React Server Components compatible with client boundary. Known issues (community): memory leaks with dismissed toasts, timing during dismiss animations. Performance: optimized for INP metric (<200ms target).

### 3️⃣ File System Plan

- **Create:** `packages/ui/src/components/Toast.tsx` (wrapper/re-export if using sonner directly), `packages/ui/src/components/Toaster.tsx` (Toaster placement)
- **Update:** `packages/ui/src/index.ts` — add `Toaster`, `toast` export
- **Delete:** None

### 4️⃣ Public API Design

```ts
export function Toaster(props?: ToasterProps): JSX.Element;
export const toast: ToastFn; // success, error, warning, info, loading
interface ToasterProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  visibleToasts?: number;
  duration?: number;
}
```

- `toast.success(msg, { description?, duration?, id?, action? })` — id for dedupe, action for CTA
- `toast.promise(promise, { loading, success, error })` — async operations with loading states

### 5️⃣ Data Contracts & Schemas

- No new schema. Sonner handles variants. Optional: typed event payload for analytics.

### 6️⃣ Internal Architecture

- Toaster: single provider at root; stacks toasts; pause-on-hover via sonner
- toast(): imperative API; no controlled mode needed
- ARIA: `aria-live="polite"` via sonner
- **2026:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React 19.2 optimizations; React Compiler auto-memoization ready

### 7️⃣ Performance & SEO

- LCP: No impact (lazy render when first toast fires)
- Bundle: sonner already in deps; no extra split
- SEO: Not relevant
- **2026 Optimizations:** React 19.2 rendering improvements; React Compiler compatibility
- **Bundle Strategy:** Tree-shaking friendly; sonner v2.0.7 < 10KB gzipped; optimized for React 19
- **INP Optimization:** Minimal main thread impact; lazy render on first toast; respects React 19 rendering optimizations

### 8️⃣ Accessibility

- ARIA live regions (sonner default)
- Focus not trapped; non-intrusive
- `prefers-reduced-motion`: respect via sonner/duration
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets not applicable to toasts); WCAG 3.0 preparation (Bronze level targeting)
- **Screen Readers:** Proper announcements via aria-live="polite"
- **Focus Management:** Non-intrusive; no focus trap (accessibility-first design)

### 9️⃣ Analytics

- None by default. Future: optional `onToast` callback for conversion events.

### 🔟 Testing Strategy

- Unit: `packages/ui/src/components/__tests__/Toast.test.tsx` — render Toaster, call toast.success, assert DOM
- **2026 Tools:** Vitest + React Testing Library for unit tests; Playwright for E2E. (Vitest preferred over Jest for new React work in 2025–2026.)
- **Coverage:** render + variant assertions + accessibility testing
- **E2E:** Critical path validation with Playwright

### 1️⃣1️⃣ Example Usage

```tsx
import { Toaster, toast } from '@repo/ui';
// In layout/root
<Toaster position="top-right" richColors closeButton />;
// Usage examples
toast.success('Booking confirmed', {
  description: 'Check your email for details',
  action: { label: 'View Booking', onClick: () => router.push('/booking') },
});
// Promise integration
const savePromise = fetch('/api/save', { method: 'POST' });
toast.promise(savePromise, {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save',
});
```

### 1️⃣2️⃣ Failure Modes

- Sonner version mismatch → pin in catalog
- SSR: Toaster must be client-only; wrap in dynamic import if needed

### 1️⃣3️⃣ AI Implementation Checklist

1. Ensure `sonner: '^2.0.7'` in `pnpm-workspace.yaml` catalog; add sonner to @repo/ui dependencies (catalog:)
2. Create `Toaster.tsx` wrapping `<Toaster />` from sonner with theme props
3. Re-export `toast` from sonner (Toast.tsx or index)
4. Add exports to `packages/ui/src/index.ts`
5. Run `pnpm --filter @repo/ui type-check build`
6. Add smoke test (Vitest + React Testing Library; repo currently uses Jest in @repo/ui — align in 2026)
7. Update `packages/features/src/booking/components/BookingForm.tsx` to import toast from `@repo/ui`

### 1️⃣4️⃣ Done Criteria

- Builds without warnings; Toaster renders; toast.success/error/warning/info work; no circular imports

### 1️⃣5️⃣ Anti-Overengineering

- Do NOT add custom queue logic; sonner handles stacking
- Do NOT add persistence (localStorage)
- Stop at sonner integration; no custom toast component

---

## 1.3 Tabs Component

### 1️⃣ Objective Clarification

- Problem: Tabbed content needs accessible tablist with roving focus
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Tabs wrapper

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Migration:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { Tabs as TabsPrimitive } from 'radix-ui'`
- **Repository Status:** radix-ui catalog entry exists; unified package already in use

### 3️⃣ File System Plan

- **Create:** `packages/ui/src/components/Tabs.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API Design

```ts
interface TabsProps extends Omit<RadixTabs.TabsProps, 'orientation'> {
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  variant?: 'default' | 'pills';
  size?: 'sm' | 'md';
  className?: string;
}
interface TabsListProps { children: ReactNode; className?: string; }
interface TabsTriggerProps { value: string; children: ReactNode; className?: string; }
interface TabsContentProps { value: string; children: ReactNode; className?: string; }
export const Tabs: React.ForwardRefExoticComponent<TabsProps>;
export const TabsList, TabsTrigger, TabsContent: ...
```

### 5️⃣ Data Contracts

- No new schema. Value strings must be unique per tabs instance.

### 6️⃣ Internal Architecture

- Radix Tabs + CVA variants; controlled/uncontrolled via `value` + `defaultValue`
- `activationMode`: automatic (default) vs manual (keyboard only)
- Transitions: use `prefers-reduced-motion: reduce` media query; disable animations when set
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)

### 7️⃣ Performance & SEO

- LCP: Lazy content OK if not visible initially
- SEO: All tab content in DOM (not hidden from crawlers if rendered)
- **Bundle Strategy:** Tree-shaking friendly; radix-ui optimized for React 19
- **INP Optimization:** Efficient keyboard navigation; minimal main thread impact

### 8️⃣ Accessibility

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Arrow key roving focus
- `aria-selected`, `aria-controls`, `aria-labelledby`
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets); WCAG 3.0 preparation (Bronze level targeting)
- **Focus Management:** Radix handles roving focus; respects user preferences
- **Screen Readers:** Proper semantic structure maintained with WAI-ARIA authoring practices

### 9️⃣ Analytics

- None by default

### 🔟 Testing

- `packages/ui/src/components/__tests__/Tabs.test.tsx` — keyboard nav, controlled/uncontrolled
- **2026 Strategy:** Playwright component testing + React Testing Library
- **Accessibility:** Automated a11y testing with axe-core
- **Visual Regression:** Storybook/Chromatic integration optional

### 1️⃣1️⃣ Example

```tsx
<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">Tab A</TabsTrigger>...
  </TabsList>
  <TabsContent value="a">Content A</TabsContent>
</Tabs>
```

### 1️⃣3️⃣ Checklist

1. Import Tabs primitive from unified radix-ui package
2. Create Tabs.tsx following Dialog.tsx pattern
3. Add CVA variants (horizontal/vertical, size)
4. Respect prefers-reduced-motion in transitions
5. Export; type-check; build
6. Add accessibility tests (axe-core integration)

### 1️⃣5️⃣ Anti-Overengineering

- No URL-synced tabs (that belongs in page-templates)
- No animations beyond CSS transition; no framer-motion

---

## 1.4 Dropdown Menu

### 1️⃣ Objective Clarification

- Problem: Clickable button revealing action list. Full keyboard semantics and nested menu support.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix DropdownMenu wrapper
- Current state: Select.tsx exists but is native HTML select (not Radix dropdown)
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { DropdownMenu } from 'radix-ui'`
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

### 3️⃣ File System Plan

- **Create:** `packages/ui/src/components/DropdownMenu.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API Design

```ts
export const DropdownMenu: typeof DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger: typeof DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent: typeof DropdownMenuPrimitive.Content;
export const DropdownMenuItem: typeof DropdownMenuPrimitive.Item;
export const DropdownMenuCheckboxItem: typeof DropdownMenuPrimitive.CheckboxItem;
export const DropdownMenuRadioGroup: typeof DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem: typeof DropdownMenuPrimitive.RadioItem;
export const DropdownMenuLabel: typeof DropdownMenuPrimitive.Label;
export const DropdownMenuSeparator: typeof DropdownMenuPrimitive.Separator;
export const DropdownMenuSub: typeof DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger: typeof DropdownMenuPrimitive.SubTrigger;
export const DropdownMenuSubContent: typeof DropdownMenuPrimitive.SubContent;
export const DropdownMenuArrow: typeof DropdownMenuPrimitive.Arrow;
export const DropdownMenuItemIndicator: typeof DropdownMenuPrimitive.ItemIndicator;
```

- Props extend Radix; add `variant`, `size` via CVA where sensible

### 5️⃣ Data Contracts & Schemas

- No new schema. Item selection handled by callbacks.
- **2026 Features:** Support for complex items with icons, shortcuts, and disabled states

### 6️⃣ Internal Architecture

- Radix DropdownMenu + CVA variants for styling
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Features:** Submenus, checkbox/radio items, collision handling, typeahead

### 7️⃣ Performance & SEO

- LCP: No impact (lazy render on interaction)
- Bundle: Tree-shaking friendly, < 15KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Radix optimized for tree-shaking
- **INP Optimization:** Efficient keyboard navigation; minimal main thread impact; portal rendering prevents layout shift

### 8️⃣ Accessibility

- Full keyboard navigation (arrow keys, Enter, Escape, typeahead)
- ARIA attributes handled by Radix (Menu Button WAI-ARIA pattern)
- Focus management and trap with roving tabindex
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets)
- **Screen Readers:** Proper semantic structure maintained
- **Focus Management:** Radix handles roving tabindex; respects user preferences

### 9️⃣ Analytics

- None

### 🔟 Testing Strategy

- Unit: `packages/ui/src/components/__tests__/DropdownMenu.test.tsx` — keyboard nav, nested menus, checkbox/radio items
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** Keyboard navigation, nested menus, collision handling, typeahead
- **Accessibility:** Automated a11y testing with axe-core
- **E2E:** Critical path validation with Playwright

### 1️⃣1️⃣ Example Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => copy()}>Copy</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => delete()}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 1️⃣2️⃣ Failure Modes

- Radix version mismatch → pin in catalog at v1.0.0
- Z-index conflicts → ensure proper stacking context

### 1️⃣3️⃣ AI Implementation Checklist

1. Import DropdownMenu primitives from unified radix-ui package
2. Create DropdownMenu.tsx with all sub-components
3. Add CVA variants for positioning/styling
4. Test keyboard navigation thoroughly (including typeahead)
5. Export all components; type-check; build
6. Add accessibility tests (axe-core integration)

### 1️⃣4️⃣ Done Criteria

- Builds; keyboard nav works; nested menus function; no Radix warnings

### 1️⃣5️⃣ Anti-Overengineering

- No custom positioning logic (Radix handles collision detection)
- No animations beyond CSS transitions
- Stop at Radix integration; no custom dropdown logic

---

## 1.5 Tooltip

### 1️⃣ Objective Clarification

- Problem: Small popup on hover/focus showing help text.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Tooltip wrapper
- Current state: No existing tooltip components in UI package
- **Repository Status**: radix-ui catalog entry exists; unified package already in use
- **2026 Requirements**: WCAG 2.2 AA compliance with 1.4.13 Content on Hover or Focus

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { Tooltip } from 'radix-ui'`
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

### 3️⃣ File System Plan

- **Create:** `packages/ui/src/components/Tooltip.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API Design

```ts
export const TooltipProvider: typeof TooltipPrimitive.Provider;
export const Tooltip: typeof TooltipPrimitive.Root;
export const TooltipTrigger: typeof TooltipPrimitive.Trigger;
export const TooltipContent: typeof TooltipPrimitive.Content;
export const TooltipArrow: typeof TooltipPrimitive.Arrow;
```

- **Positioning**: side (top|right|bottom|left), align, collisionPadding
- **Provider Props**: delayDuration, skipDelayDuration, disableHoverableContent
- **2026 Features**: Enhanced WCAG 2.2 compliance with hoverable content

### 5️⃣ Data Contracts & Schemas

- No new schema. Tooltip content handled as string/ReactNode.
- **2026 Features:** Support for rich content with proper ARIA semantics

### 6️⃣ Internal Architecture

- Radix Tooltip + CVA variants for styling
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Accessibility:** WCAG 2.2 1.4.13 Content on Hover or Focus compliance
- **Features:** Provider for global delay control, hoverable content, dismissible

### 7️⃣ Performance & SEO

- LCP: No impact (lazy render on hover/focus)
- Bundle: Tree-shaking friendly, < 10KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Radix optimized for tree-shaking
- **INP Optimization:** Efficient hover/focus handling; minimal main thread impact

### 8️⃣ Accessibility

- WCAG 2.2 1.4.13 Content on Hover or Focus compliance (dismissable, hoverable, persistent)
- ARIA attributes handled by Radix (Tooltip WAI-ARIA pattern)
- Focus management with escape key dismissal
- **2026 Standards:** 24×24 CSS pixels minimum for touch targets (where applicable)
- **Screen Readers:** Proper semantic structure with aria-describedby
- **Focus Management:** Escape key dismissal; hoverable content support

### 9️⃣ Analytics

- None by default. Optional: onOpen/onClose callbacks for user interaction tracking.

### 🔟 Testing Strategy

- Unit: `packages/ui/src/components/__tests__/Tooltip.test.tsx` — hover/focus, dismissible behavior
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** Hover/focus triggers, escape dismissal, WCAG 1.4.13 compliance
- **Accessibility:** Automated a11y testing with axe-core
- **E2E:** Critical path validation with Playwright

### 1️⃣1️⃣ Example Usage

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@repo/ui';

// In app root
<TooltipProvider delayDuration={400}>
  {/* Your app */}
</TooltipProvider>

// Usage
<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent side="top">
    Helpful information
  </TooltipContent>
</Tooltip>
```

### 1️⃣2️⃣ Failure Modes

- Radix version mismatch → pin in catalog at v1.0.0
- WCAG 1.4.13 violations → content disappears on hover
- Touch device accessibility → hover-only tooltips not accessible

### 1️⃣3️⃣ AI Implementation Checklist

1. Import Tooltip primitives from unified radix-ui package
2. Create Tooltip.tsx with Provider, Root, Trigger, Content, Arrow
3. Add CVA variants for positioning/styling
4. Ensure WCAG 1.4.13 compliance (hoverable content, escape dismissal)
5. Export all components; type-check; build
6. Add accessibility tests (axe-core integration)

### 1️⃣4️⃣ Done Criteria

- Builds; hover/focus work; escape dismissal works; WCAG 1.4.13 compliant

### 1️⃣5️⃣ Anti-Overengineering

- No rich HTML in tooltip; keep text-only for optimal a11y
- No custom positioning logic (Radix handles collision detection)
- Stop at Radix integration; no custom tooltip logic

---

## 1.6 Popover

### 1️⃣ Objective Clarification

- Problem: Rich interactive overlay (more complex than tooltip). Click-outside dismissal, focus management.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Popover wrapper
- Current state: No existing popover components in UI package
- **Repository Status**: radix-ui catalog entry exists; unified package already in use
- **2026 Requirements**: WCAG 2.2 AA compliance with Dialog WAI-ARIA pattern

### 2️⃣ Dependency Check

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { Popover } from 'radix-ui'`
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

### 3️⃣ File System Plan

- **Create:** `packages/ui/src/components/Popover.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API Design

```ts
export const Popover: typeof PopoverPrimitive.Root;
export const PopoverTrigger: typeof PopoverPrimitive.Trigger;
export const PopoverContent: typeof PopoverPrimitive.Content;
export const PopoverAnchor: typeof PopoverPrimitive.Anchor;
export const PopoverArrow: typeof PopoverPrimitive.Arrow;
export const PopoverClose: typeof PopoverPrimitive.Close;
```

- **Positioning**: side (top|right|bottom|left), align, collisionPadding
- **Modal Mode**: modal boolean for focus trapping behavior
- **Focus Management**: Fully managed and customizable

### 5️⃣ Data Contracts & Schemas

- No new schema. Popover content handled as ReactNode.
- **2026 Features:** Support for rich content with proper ARIA semantics

### 6️⃣ Internal Architecture

- Radix Popover + CVA variants for styling
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Accessibility:** WCAG 2.2 Dialog WAI-ARIA pattern compliance
- **Features:** Modal/non-modal modes, collision handling, arrow positioning, portal rendering

### 7️⃣ Performance & SEO

- LCP: No impact (lazy render on trigger)
- Bundle: Tree-shaking friendly, < 15KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Radix optimized for tree-shaking
- **INP Optimization:** Efficient trigger handling; minimal main thread impact; portal rendering prevents layout shift

### 8️⃣ Accessibility

- WCAG 2.2 Dialog WAI-ARIA pattern compliance
- ARIA attributes handled by Radix (role="dialog", aria-modal)
- Focus management with trap (modal mode) and proper restoration
- **2026 Standards:** 24×24 CSS pixels minimum for touch targets
- **Screen Readers:** Proper semantic structure with dialog role
- **Focus Management:** Escape key dismissal; focus restoration on close

### 9️⃣ Analytics

- None by default. Optional: onOpen/onClose callbacks for user interaction tracking.

### 🔟 Testing Strategy

- Unit: `packages/ui/src/components/__tests__/Popover.test.tsx` — trigger, modal/non-modal, focus management
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** Trigger behavior, modal focus trap, collision handling, accessibility
- **Accessibility:** Automated a11y testing with axe-core
- **E2E:** Critical path validation with Playwright

### 1️⃣1️⃣ Example Usage

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from '@repo/ui';

<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent side="bottom" align="center">
    <div>Rich content here</div>
    <PopoverArrow />
  </PopoverContent>
</Popover>

// Modal variant
<Popover modal>
  <PopoverTrigger>Open Modal Popover</PopoverTrigger>
  <PopoverContent>
    <div>Modal content with focus trap</div>
  </PopoverContent>
</Popover>
```

### 1️⃣2️⃣ Failure Modes

- Radix version mismatch → pin in catalog at v1.0.0
- Z-index conflicts → ensure proper stacking context
- Focus management issues in modal mode
- WCAG 2.2 violations → improper dialog semantics

### 1️⃣3️⃣ AI Implementation Checklist

1. Import Popover primitives from unified radix-ui package
2. Create Popover.tsx with Root, Trigger, Content, Anchor, Arrow, Close
3. Add CVA variants for positioning/styling
4. Test modal/non-modal modes and focus management
5. Export all components; type-check; build
6. Add accessibility tests (axe-core integration)

### 1️⃣4️⃣ Done Criteria

- Builds; trigger works; modal focus trap functions; no Radix warnings

### 1️⃣5️⃣ Anti-Overengineering

- Do NOT use for complex forms; use Dialog for modal forms
- No custom positioning logic (Radix handles collision detection)
- No animations beyond CSS transitions
- Stop at Radix integration; no custom popover logic

---

## 2026 Best Practices & Modern Standards

### React 19.2 Integration (October 2025)

- **<Activity /> Component**: New component for conditional rendering with performance optimization - use `mode="visible"|"hidden"` instead of conditional rendering for better performance
- **useEffectEvent Hook**: New hook for non-reactive event handlers in effects - prevents unnecessary effect re-runs
- **Partial Pre-rendering**: New `prerender()`, `resume()`, and `resumeAndPrerender()` APIs for static/dynamic hybrid rendering
- **Server Components**: All UI primitives are client components with proper "use client" boundaries
- **React Compiler**: Components are auto-memoization ready with stable prop patterns

### Unified Radix UI Package (May 2025)

- **Migration**: From individual `@radix-ui/react-*` to unified `radix-ui` package
- **Benefits**: Cleaner package.json, unified versioning, smaller bundle
- **Import Changes**: `import { Tabs } from 'radix-ui'` instead of `@radix-ui/react-tabs`
- **New Primitives**: PasswordToggleField (unstable preview) available

### WCAG 3.0 Preparation

- **Current Status**: Working draft with sections in Exploratory/Developing status (September 2025 update)
- **Timeline**: WCAG 3 not expected to be completed before 2028; WCAG 2 will not be deprecated for years after WCAG 3 finalization
- **Projected Timeline**: AG WG plans to develop projected WCAG 3 timeline by April 2026
- **Outcomes-Based Approach**: Moving beyond pass/fail to graded accessibility (Bronze/Silver/Gold)
- **Focus**: User needs assessment over technical compliance

### Modern CSS Architecture

- **Tailwind v4**: Stable release (early 2025) with CSS-first configuration, native container queries, zero-config content detection
- **Cascade Layers**: Organize styles as `@layer reset, defaults, patterns, components`
- **Container Queries**: Built-in support with `@container` and `@sm:`, `@md:` variants for component-level responsiveness
- **CSS-in-JS Alternatives**: Consider compile-time solutions for React Compiler optimization

### Performance Optimization 2026

- **React 19.2**: <Activity /> component for performance-aware conditional rendering, Partial Pre-rendering APIs
- **React Compiler v1.0**: Stable automatic memoization - eliminates need for manual `useMemo`/`useCallback` in most cases
- **Production Results**: Up to 12% improvement in initial loads and cross-page navigations, some interactions 2.5× faster
- **Bundle Strategy**: Tree-shaking friendly imports, < 10KB gzipped per component
- **Lazy Loading**: Component-level code splitting for large UI libraries

### Testing Strategy Evolution

- **Playwright Component Testing**: Still experimental but maturing - supports component isolation across Chromium, WebKit, Firefox
- **Layered Testing**: Vitest + React Testing Library + Playwright E2E (Jest being replaced by Vitest for performance)
- **Accessibility Testing**: Automated axe-core integration in CI/CD
- **Visual Regression**: Optional Storybook/Chromatic for design system consistency

### Styling Modernization

- **Design Tokens**: CSS custom properties for theme consistency
- **Component Variants**: CVA (class-variance-authority) for predictable styling
- **Dark Mode**: CSS custom properties with `data-theme` attribute
- **Motion Preferences**: Respect `prefers-reduced-motion` in all animations

### Development Experience 2026

- **TypeScript**: Strict mode with proper component prop typing
- **ESLint**: React 19 hooks plugin with Effect Events rules
- **Hot Module Replacement**: Fast development iteration
- **Component Documentation**: JSDoc with Storybook integration

### Migration Checklist

- [ ] Update package.json: Replace `@radix-ui/react-*` with `radix-ui`
- [ ] Update all imports: `from 'radix-ui'` instead of individual packages
- [ ] Add `eslint-plugin-react-hooks@latest` for React 19 rules (supports useEffectEvent)
- [ ] Configure Tailwind v4 with CSS-first configuration and container queries
- [ ] Add React Compiler v1.0: `babel-plugin-react-compiler@latest`
- [ ] Add Playwright component testing to CI pipeline (experimental but usable)
- [ ] Implement CSS cascade layers for styling architecture
- [ ] Update accessibility testing for WCAG 3.0 outcomes-based approach
