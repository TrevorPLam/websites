/**
 * @file packages/infrastructure/ui/src/index.ts
 * Tasks: [f-1] [f-3] [f-31] [f-32] [f-33] [f-34] [f-35] [f-37]
 *
 * Purpose: Main entry point for @repo/infrastructure-ui.
 *          Exports all composition, customization, and theme utilities.
 *
 * Package: @repo/infrastructure-ui
 * Used by: @repo/ui, @repo/marketing-components, client apps
 *
 * Architecture:
 *   - composition/: Slots, render-props, HOCs, context, providers
 *   - customization/: Runtime override hooks via React context
 *   - theme/: Theme system, dark mode, persistence
 *
 * Status: @public
 */

export * from './composition';
export * from './customization';
export * from './theme';
