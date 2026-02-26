// File: packages/infra/color/index.ts  [TRACE:FILE=packages.infra.color.index]
// Purpose: Barrel export for the @repo/infrastructure color module.
//          Re-exports color utilities, HSL parsing/formatting, WCAG contrast checking,
//          and palette constants.
//
// System role: Client-safe public surface for color primitives.
// Entry point: import from '@repo/infrastructure/color'
//
// Exports / Entry: See sub-module files for full export lists.
// Used by: ThemeInjector, @repo/ui components, accessibility tooling
//
// Invariants:
// - All exports are client-safe (no server-only imports)
// - HSL values follow the project format: "174 85% 33%" (no hsl() wrapper)
// - WCAG contrast ratios follow WCAG 2.2 AA (4.5:1 text, 3:1 large text/UI)
//
// Status: @public
// Features:
// - [FEAT:COLOR] Color utilities, HSL parsing, WCAG contrast, palette constants

export * from './utils';
export * from './contrast';
export * from './palette';
