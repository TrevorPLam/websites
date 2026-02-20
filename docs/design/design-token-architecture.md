# Design Token Architecture (C-5)

**Purpose:** Three-layer design token system per DTCG 2025.10 and THEGOAL.  
**Location:** `packages/config/tokens/` and `packages/config/tailwind-theme.css`.

## Layers

1. **Option tokens** (`option-tokens.css`) — Raw values: color primitives (HSL), spacing scale, type scale. No semantic naming.
2. **Decision tokens** (`decision-tokens.css`) — Semantic aliases: `--color-primary`, `--space-page`, and backward-compat `--primary`, `--background` for ThemeInjector.
3. **Component tokens** (`component-tokens.css`) — Component-specific: `--button-bg`, `--card-radius`, `--radius`.

## Usage

Clients import `@repo/config/tailwind-theme.css`, which imports the three token files and defines the Tailwind v4 `@theme` block. ThemeInjector overrides `--primary`, `--background`, etc. at runtime from `site.config.theme`.

## Token overrides (inf-4)

`site.config.theme.colors` may be partial. ThemeInjector merges overrides with `DEFAULT_THEME_COLORS` from `@repo/types`, so only provided keys need to be set in config.

## Verification

- Build a client; tokens resolve. Run `pnpm build` for affected packages.
