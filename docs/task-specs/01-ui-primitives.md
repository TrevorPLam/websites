# UI Primitives (1.2–1.6) — Normalized Specs

**Optional Mode:** UI primitive → enforce Radix pattern + controlled/uncontrolled where applicable.
**Shared Dependencies:** `@repo/utils` (cn), `class-variance-authority` (cva), React 19.

---

## 1.2 Toast Component

### 1️⃣ Objective Clarification
- Problem: No non-blocking notification system; users need feedback without modal blocking
- Layer: L2 (@repo/ui)
- Introduces: UI runtime (Toaster provider), sonner integration
- Uses `sonner` already in template; no new runtime contracts

### 2️⃣ Dependency Check
- **Completed:** None required
- **Packages:** `sonner` (already in template)
- **Environment:** Client-only; must run in browser
- **CI:** `pnpm --filter @repo/ui build` green
- **Blockers:** None

### 3️⃣ File System Plan
- **Create:** `packages/ui/src/components/Toast.tsx` (wrapper/re-export if using sonner directly), `packages/ui/src/components/Toaster.tsx` (Toaster placement)
- **Update:** `packages/ui/src/index.ts` — add `Toaster`, `toast` export
- **Delete:** None

### 4️⃣ Public API Design
```ts
export function Toaster(props?: ToasterProps): JSX.Element;
export const toast: ToastFn;  // success, error, warning, info
interface ToasterProps {
  position?: 'top-right' | 'top-center' | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
}
```
- `toast.success(msg, { description?, duration?, id? })` — id for dedupe

### 5️⃣ Data Contracts & Schemas
- No new schema. Sonner handles variants. Optional: typed event payload for analytics.

### 6️⃣ Internal Architecture
- Toaster: single provider at root; stacks toasts; pause-on-hover via sonner
- toast(): imperative API; no controlled mode needed
- ARIA: `aria-live="polite"` via sonner

### 7️⃣ Performance & SEO
- LCP: No impact (lazy render when first toast fires)
- Bundle: sonner already in deps; no extra split
- SEO: Not relevant

### 8️⃣ Accessibility
- ARIA live regions (sonner default)
- Focus not trapped; non-intrusive
- `prefers-reduced-motion`: respect via sonner/duration

### 9️⃣ Analytics
- None by default. Future: optional `onToast` callback for conversion events.

### 🔟 Testing Strategy
- Unit: `packages/ui/src/components/__tests__/Toast.test.tsx` — render Toaster, call toast.success, assert DOM
- Snapshot: optional
- Coverage: render + variant assertions

### 1️⃣1️⃣ Example Usage
```tsx
import { Toaster, toast } from '@repo/ui';
// In layout
<Toaster position="top-right" />
// Usage
toast.success('Booking confirmed', { description: 'Check your email' });
```

### 1️⃣2️⃣ Failure Modes
- Sonner version mismatch → pin in catalog
- SSR: Toaster must be client-only; wrap in dynamic import if needed

### 1️⃣3️⃣ AI Implementation Checklist
1. Add sonner to @repo/ui peerDependencies if not inherited
2. Create `Toaster.tsx` wrapping `<Toaster />` from sonner with theme props
3. Re-export `toast` from sonner
4. Add exports to `packages/ui/src/index.ts`
5. Run `pnpm --filter @repo/ui type-check build`
6. Add smoke test

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
- **Packages:** `@radix-ui/react-tabs` (add via pnpm catalog)
- **CI:** @repo/ui build green

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

### 7️⃣ Performance & SEO
- LCP: Lazy content OK if not visible initially
- SEO: All tab content in DOM (not hidden from crawlers if rendered)

### 8️⃣ Accessibility
- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Arrow key roving focus
- `aria-selected`, `aria-controls`, `aria-labelledby`

### 9️⃣ Analytics
- None by default

### 🔟 Testing
- `packages/ui/src/components/__tests__/Tabs.test.tsx` — keyboard nav, controlled/uncontrolled

### 1️⃣1️⃣ Example
```tsx
<Tabs defaultValue="a">
  <TabsList><TabsTrigger value="a">Tab A</TabsTrigger>...</TabsList>
  <TabsContent value="a">Content A</TabsContent>
</Tabs>
```

### 1️⃣3️⃣ Checklist
1. Add @radix-ui/react-tabs to @repo/ui
2. Create Tabs.tsx (Component Pattern Template from TODO.md)
3. Add CVA variants (horizontal/vertical, size)
4. Respect prefers-reduced-motion in transitions
5. Export; type-check; build

### 1️⃣5️⃣ Anti-Overengineering
- No URL-synced tabs (that belongs in page-templates)
- No animations beyond CSS transition; no framer-motion

---

## 1.4 Dropdown Menu

### 1️⃣ Objective Clarification
- Click-to-open action menu with keyboard nav, nested submenus
- Layer: L2, Radix DropdownMenu

### 2️⃣ Dependency Check
- **Packages:** `@radix-ui/react-dropdown-menu`

### 3️⃣ File System Plan
- **Create:** `packages/ui/src/components/DropdownMenu.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API
```ts
DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem,
DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
```
- Props extend Radix; add `variant`, `size` via CVA where sensible

### 5️⃣ Data Contracts
- None

### 6️⃣ Internal
- Radix + collision boundary, alignment; Portal by default

### 7️⃣ Performance
- Portal = no layout shift; lazy render on open

### 8️⃣ Accessibility
- Arrow keys, Enter, Escape; roving tabindex; `role="menu"`

### 9️⃣ Analytics
- None

### 1️⃣3️⃣ Checklist
- Same as Tabs: add dep → Component Pattern Template → export

### 1️⃣5️⃣ Anti-Overengineering
- No custom item rendering beyond Radix; no mega-menus

---

## 1.5 Tooltip

### 1️⃣ Objective Clarification
- Hover/focus popup for help text
- Layer: L2, `@radix-ui/react-tooltip`

### 2️⃣ Dependency Check
- **Packages:** `@radix-ui/react-tooltip`

### 3️⃣ File System Plan
- **Create:** `packages/ui/src/components/Tooltip.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API
```ts
TooltipProvider (delayDuration, skipDelayDuration), Tooltip, TooltipTrigger, TooltipContent
```
- Positioning: side (top|right|bottom|left), align, collisionPadding

### 5️⃣–9️⃣
- No schema; Radix handles focus/hover; no analytics

### 1️⃣3️⃣ Checklist
- Add Radix tooltip; wrap with TooltipProvider; export

### 1️⃣5️⃣ Anti-Overengineering
- No rich HTML in tooltip; keep text-only for a11y

---

## 1.6 Popover

### 1️⃣ Objective Clarification
- Rich overlay (more complex than tooltip); click-outside dismiss
- Layer: L2, `@radix-ui/react-popover`

### 2️⃣ Dependency Check
- **Packages:** `@radix-ui/react-popover`

### 3️⃣ File System Plan
- **Create:** `packages/ui/src/components/Popover.tsx`
- **Update:** `packages/ui/src/index.ts`

### 4️⃣ Public API
```ts
Popover, PopoverTrigger, PopoverContent, PopoverAnchor
```
- modal: boolean; collision padding; focus management

### 5️⃣–9️⃣
- No schema; focus trap when modal; no analytics

### 1️⃣3️⃣ Checklist
- Radix popover; export; type-check; build

### 1️⃣5️⃣ Anti-Overengineering
- Do NOT use for complex forms; use Dialog for modal forms
