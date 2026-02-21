<!--
@file docs/adr/0009-infrastructure-ui-composition-patterns.md
@role Architecture Decision Record
@summary Introduces @repo/infrastructure-ui for React composition utilities:
         slots, render-props, HOCs, context, providers, customization hooks, and theme system.
@invariants
  - Decision is binding; deviation requires a new ADR
  - Infrastructure-ui must not import from @repo/ui or any client package
  - All exports use standard React patterns only (no custom runtime)
@gotchas
  - Do not add third-party state management; context only
  - Theme system uses CSS variables only; no class-based dark mode
@verification
  - pnpm --filter @repo/infrastructure-ui type-check
  - pnpm test (composition.test.tsx + theme.test.ts)
@status accepted — 2026-02-19
-->

# ADR-0009: @repo/infrastructure-ui — React Composition Patterns

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Engineering team

---

## Context

As the monorepo grows to support multiple industry clients, several cross-cutting UI concerns emerge:

1. **Slot-based composition** — components need to expose "holes" for consumers to inject content without forking
2. **Render-props** — stateful components need to delegate rendering to consumers
3. **HOC utilities** — cross-cutting prop injection, conditional rendering, and ref forwarding
4. **Context factories** — eliminating boilerplate and enforcing consistent `useContext` safety
5. **Provider composition** — avoiding "Provider Hell" (deeply nested providers)
6. **Runtime customization** — allowing clients to override styles/props without forking components
7. **Theme system** — CSS-variable-based theming with dark mode, persistence, and switching

These patterns currently either don't exist (leading to duplication) or are implemented inconsistently across `@repo/ui` and `@repo/features`.

---

## Decision

Create **`@repo/infrastructure-ui`** (`packages/infrastructure/ui`) as the canonical home for React composition patterns used across the monorepo. It sits at Layer L0 (infrastructure) and has **no dependencies** on `@repo/ui`, `@repo/features`, or any client package.

### Package structure

```
packages/infrastructure/ui/src/
  composition/
    slots.ts          # SlotProvider, Slot, useSlot, hasSlot
    render-props.ts   # callRenderProp, mergeRenderProps, RenderPropResolver
    hocs.ts           # withDefaults, withCondition, composeHOCs, withForwardRef
    context.ts        # createStrictContext, createOptionalContext, createContextWithDefault
    provider.ts       # composeProviders, ProviderStack, createProvider
    index.ts
  customization/
    hooks.ts          # CustomizationProvider, useCustomization, useStyleOverride
    index.ts
  theme/
    system.ts         # ThemeConfig, DEFAULT_THEME, applyTheme, themeToCSS
    dark-mode.ts      # useSystemColorMode, useResolvedColorMode, usePrefersReducedMotion
    persistence.ts    # loadColorMode, saveColorMode, getThemeInitScript
    hooks.ts          # ThemeProvider, useTheme
    index.ts
  index.ts
```

### Key design choices

| Concern       | Decision                                           | Rationale                                                               |
| ------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| Slot system   | `SlotProvider` + `useSlot()`                       | Simpler than RSC `children` cloning; avoids React.Children.map pitfalls |
| Context       | `createStrictContext` throws on missing provider   | Fail-fast is better than silent undefined behavior                      |
| Theme         | CSS custom properties; `data-color-mode` attribute | Works with SSR; no class-based dark mode                                |
| Dark mode     | `window.matchMedia` with `addEventListener`        | Modern API; graceful fallback for legacy Safari                         |
| Persistence   | `localStorage` with SSR guard                      | Simple; no external dependency                                          |
| Customization | React Context + `useCustomization()` hook          | Avoids prop drilling; works at any depth                                |

---

## Consequences

### Positive

- **DRY**: No more duplicating context factories or provider stacks across packages
- **Type safety**: `createStrictContext` / `createOptionalContext` give clear error messages
- **No dependencies**: Infrastructure packages have zero runtime imports from upper layers
- **Testable**: All utilities are pure functions or standard React patterns

### Negative / Trade-offs

- **Indirection**: Consumers must import from two packages (`@repo/ui` + `@repo/infrastructure-ui`)
- **Learning curve**: Developers must understand when to use `Slot` vs. `children` prop patterns

### Neutral

- `@repo/infrastructure-ui` is **not** a replacement for `@repo/ui`. UI components (Button, Dialog, etc.) stay in `@repo/ui`. Infrastructure-ui only provides composition utilities.
- `@repo/infra` (middleware, env validation, security) is **separate** from `@repo/infrastructure-ui` (React composition patterns).

---

## Usage Examples

### Slot system

```typescript
// Host component exposes named slots
function Card({ children }: { children: React.ReactNode }) {
  return (
    <SlotProvider>
      {children}
      <CardInner />
    </SlotProvider>
  );
}

function CardInner() {
  const header = useSlot('header');
  const footer = useSlot('footer');
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">...</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Consumer fills slots
<Card>
  <Slot name="header"><h2>My Card</h2></Slot>
  <Slot name="footer"><Button>Save</Button></Slot>
</Card>
```

### Theme system

```typescript
// In layout.tsx
import { ThemeProvider, getThemeInitScript } from '@repo/infrastructure-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body>
        <ThemeProvider theme={buildTheme(siteConfig.theme)}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// In theme toggle component
function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useTheme();
  return <button onClick={toggleColorMode}>{colorMode === 'dark' ? '☀️' : '🌙'}</button>;
}
```

### Context factory

```typescript
const [AuthContext, useAuth] = createStrictContext<AuthState>('AuthContext');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthImplementation();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { useAuth };
```

---

## Alternatives Considered

| Alternative                  | Rejected because                                                       |
| ---------------------------- | ---------------------------------------------------------------------- |
| Add patterns to `@repo/ui`   | Mixes infrastructure concerns with UI components; harder to tree-shake |
| Radix UI compound components | Already used for primitives; slots needed for higher-level patterns    |
| Jotai / Zustand for state    | Overkill for composition patterns; adds external dependency            |
| CSS class-based dark mode    | Conflicts with Tailwind v4 CSS variable approach; fragile              |
