# Theme Injector — Config-Driven CSS Theming

**Last Updated:** 2026-02-14  
**Status:** Implemented (Task 0.14)  
**Package:** `@repo/ui` — `ThemeInjector` component

---

## Overview

The ThemeInjector bridges `site.config.ts` theme values with the rendered UI. Previously, changing theme values in site configuration had **zero visual effect** because `globals.css` used hardcoded values and no code generated CSS custom properties from config.

## Architecture

```
site.config.ts (theme: { primary: '174 85% 33%', ... })
       │
       ▼
  ThemeInjector (Server Component)
       │
       ▼
  <style>:root { --primary: hsl(174 85% 33%); ... }</style>
       │
       ▼
  Tailwind preset maps bg-primary → var(--primary)
       │
       ▼
  Visual output reflects config
```

## Usage

```tsx
// app/layout.tsx
import { ThemeInjector } from '@repo/ui';
import siteConfig from '@/site.config';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ThemeInjector theme={siteConfig.theme} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Supported Formats

ThemeInjector accepts two value formats:

| Format       | Example                             | Output                         |
| ------------ | ----------------------------------- | ------------------------------ |
| **Bare HSL** | `'174 85% 33%'`                     | `--primary: hsl(174 85% 33%);` |
| **Full CSS** | `'#0ea5a4'`, `'hsl(174, 85%, 33%)'` | Used as-is                     |

Bare HSL (space-separated H S% L%) is auto-wrapped in `hsl()`. Modern CSS accepts space-separated hsl values (no commas).

## Cascade & Fallbacks

- **globals.css** (`@layer base`) defines fallback values when no config override exists
- **ThemeInjector** outputs unlayered `:root` styles — higher specificity than `@layer base`
- Result: Config overrides fallbacks; fallbacks apply when ThemeInjector receives no theme

## Type Compatibility

ThemeInjector's `ThemeColors` interface is compatible with `@repo/shared` `ThemeColors` (no index signature) so `siteConfig.theme` passes type-check without casting.

## Limitations

- **Opacity modifiers** (`bg-primary/50`): The current preset uses `var(--primary)` directly. Full opacity-modifier support would require storing raw HSL values (`174 85% 33%`) and using `hsl(var(--primary) / <alpha-value>)` in the preset. See Task C.5 for three-layer design token architecture.
- **Server-only**: ThemeInjector is a Server Component — no client JS, no hydration concerns.

## Verification

To verify config-driven theming:

1. Change `site.config.ts` theme values (e.g., `primary: '0 100% 50%'` for red)
2. Run `pnpm dev` in the template
3. Primary-colored elements (buttons, links) should reflect the new color

---

**Related:** Task 0.14, Task C.5 (Design Token Architecture), `packages/config/tailwind-preset.js`
