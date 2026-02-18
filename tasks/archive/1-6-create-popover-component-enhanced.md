# 1.6 Create Popover Component (Enhanced)

## Metadata

- **Task ID**: 1-6-create-popover-component-enhanced
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Tasks requiring floating interactive content

## Context

Rich interactive overlay for click-triggered floating content with advanced positioning and composition. This is a Layer L2 component providing modal/non-modal modes, collision detection, and composition slots.

**Enhanced Requirements:**

- **Positioning:** All 12 side/align combinations with collision detection
- **Composition:** Header, Body, Footer slots with optional close button
- **Interactions:** Click-outside dismiss, Escape key, focus management
- **Variants:** Modal and non-modal modes with configurable behavior
- **Accessibility:** Full WAI-ARIA dialog pattern compliance
- **Animations:** Scale + fade with collision-adjusted slide directions
- **Customization:** Configurable offsets, alignment, and styling

## Dependencies

- **Package**: @radix-ui/react-popover – required – provides accessible primitive
- **Package**: lucide-react – required – X icon for close button
- **Code**: packages/ui/src/components/Popover.tsx – **IMPLEMENTED** – component implementation
- **Code**: packages/ui/src/index.ts – **UPDATED** – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Color pickers, date pickers, inline forms, user profile cards

## Research & Evidence (Date-Stamped)

- **2026-02-18** Use Radix UI Popover primitive for accessibility and positioning - [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover)
- **2026-02-18** React 19 compatibility with ComponentRef patterns - [React 19 Blog](https://react.dev/blog/2024/12/05/react-v19)
- **2026-02-18** WCAG 2.2 AA compliance for floating overlays - [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/Understanding/)
- **2026-02-18** Focus management and keyboard navigation standards - [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- **2026-02-18** Performance optimization for Core Web Vitals - [Web.dev Performance](https://web.dev/vitals/)

## Related Files

- `packages/ui/src/components/Popover.tsx` – **IMPLEMENTED** – Component with 7 exports
- `packages/ui/src/index.ts` – **UPDATED** – Exports all Popover sub-components
- `packages/ui/package.json` – **VERIFIED** – radix-ui catalog dependency available
- `pnpm-workspace.yaml` – **VERIFIED** – React 19.0.0 catalog entry available

## Code Snippets / Examples

```typescript
// API surface (fully implemented)
// Root components: Popover, PopoverTrigger, PopoverAnchor, PopoverClose
// Content: PopoverContent (with positioning props)
// Composition: PopoverHeader, PopoverBody, PopoverFooter

// Basic usage example
import { Popover, PopoverTrigger, PopoverContent } from '@repo/ui';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>This is the popover content.</p>
  </PopoverContent>
</Popover>

// Advanced composition with header and footer
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverHeader, 
  PopoverBody, 
  PopoverFooter,
  PopoverClose 
} from '@repo/ui';

<Popover>
  <PopoverTrigger asChild>
    <Button>Settings</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <PopoverHeader showClose>
      <h3 className="font-medium">Settings</h3>
    </PopoverHeader>
    <PopoverBody>
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <Switch />
          <span>Enable notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <Switch />
          <span>Dark mode</span>
        </label>
      </div>
    </PopoverBody>
    <PopoverFooter>
      <Button size="sm">Save Changes</Button>
    </PopoverFooter>
  </PopoverContent>
</Popover>

// Positioning and alignment
<PopoverContent 
  side="bottom" 
  align="end" 
  sideOffset={8}
  className="w-96"
>
  <p>Aligned to end with 8px offset</p>
</PopoverContent>
```

## Acceptance Criteria

- [x] Component exports from packages/ui correctly
- [x] All 7 sub-components implemented (Root, Trigger, Anchor, Close, Content, Header, Body, Footer)
- [x] Supports all 12 side/align position combinations
- [x] Collision detection and automatic adjustment
- [x] Click-outside and Escape key dismiss functionality
- [x] Focus management and restoration
- [x] Composition slots working (Header, Body, Footer)
- [x] Optional close button in header
- [x] TypeScript types correct (ComponentRef patterns)
- [x] Build passes without errors
- [x] WCAG 2.2 AA compliant (ARIA attributes, keyboard navigation)
- [x] React 19 compatible (uses ComponentRef)

## Technical Constraints

- No custom positioning logic beyond Radix defaults
- Uses CSS custom properties for theming
- Must be a thin wrapper around Radix UI Popover primitive
- Follow existing component patterns in the repo (forwardRef, cn utility)
- All interactive elements meet WCAG 2.2 24×24 CSS pixel minimum target size
- Uses React.ComponentRef for React 19 compatibility

## Accessibility & Performance Requirements

- **WCAG 2.2 AA Compliance**: 24×24 CSS pixel minimum targets, proper ARIA roles
- **Focus Management**: Focus trapping, restoration, logical tab order
- **Keyboard Navigation**: Escape to close, proper focus handling
- **Screen Reader Support**: ARIA labels, descriptions, state announcements
- **Performance**: Minimal runtime overhead, tree-shakeable, < 2KB component size
- **React 19**: Server Component compatible, ComponentRef patterns
- **Design System**: CSS custom properties integration, semantic color tokens

## Implementation Plan

- [x] Import Popover primitive from radix-ui package
- [x] Create Root, Trigger, Anchor, Close components
- [x] Create Content component with positioning and animation
- [x] Create composition slots (Header, Body, Footer)
- [x] Add TypeScript types extending Radix props
- [x] Export component and types from index.ts
- [x] Verify build passes with current configuration
- [x] Test React 19 compatibility with ComponentRef patterns
- [x] Verify WCAG 2.2 compliance with accessibility testing

## Testing Requirements

- **Unit Tests**: Component rendering with different props, position combinations
- **Accessibility Tests**: axe-core integration, WCAG 2.2 AA compliance verification
- **Keyboard Navigation Tests**: Escape dismiss, focus management, tab order
- **Visual Regression Tests**: All position variants, composition slots, animations
- **React 19 Compatibility**: ComponentRef usage, no ElementRef warnings
- **Performance Tests**: Bundle size impact, interaction latency (< 100ms)
- **Cross-browser Tests**: Modern browser compatibility, assistive technology support
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [x] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Popover component
- [x] Update packages/ui exports – ensure Popover sub-components are in index
- [x] Add JSDoc comments for all exports
- [x] Document composition patterns and positioning options

## Design References

- Radix UI Popover documentation for API reference
- Material Design popover patterns for UX guidance

## Definition of Done

- [x] Code reviewed and approved (follows Radix UI patterns)
- [x] All tests passing (unit, accessibility, keyboard, visual regression)
- [x] Documentation updated (UI library docs, API examples, composition patterns)
- [x] Component builds successfully (no TypeScript errors)
- [x] Export available in packages/ui with proper types
- [x] WCAG 2.2 AA compliant (verified with axe-core)
- [x] React 19 compatible (uses ComponentRef patterns)
- [x] Performance compliant (bundle size, interaction latency)
- [x] Design system integrated (CSS custom properties)
- [x] Composition system functional (Header, Body, Footer slots)
