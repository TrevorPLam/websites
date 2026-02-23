'use client';

// File: packages/ui/src/index.ts  [TRACE:FILE=packages.ui.index]
// Purpose: Shared UI component library entry point for the monorepo. Provides themeable
//          React components driven by CSS custom properties, enabling consistent design
//          systems across all template applications.
//
// Relationship: Depends on @repo/types (ThemeInjector), @repo/utils (cn), radix-ui, sonner.
//               Consumed by @repo/features, @repo/marketing-components, and all client layouts.
// System role: UI layer; presentational components only; theme via CSS variables.
// Assumptions: Consumers supply theme in globals.css; components receive standard HTML props.
//              Toaster must be mounted once at the app root to display toast notifications.
//
// Exports / Entry: All UI components — layout, primitives, form, disclosure, overlay,
//                  notification, feedback, navigation
// Used by: All template applications, any workspace needing UI components
//
// Invariants:
// - Components must be themeable via CSS custom properties
// - Must maintain backward compatibility for existing props
// - Components should be framework-agnostic within React ecosystem
// - No direct styling dependencies that conflict with site themes
//
// Status: @public
// Features:
// - [FEAT:UI_COMPONENTS] Reusable React component library
// - [FEAT:THEMING] CSS custom properties for theme support
// - [FEAT:DESIGN_SYSTEM] Consistent component design patterns
// - [FEAT:ACCESSIBILITY] Built-in accessibility features
// - [FEAT:RESPONSIVE] Mobile-first responsive design

/**
 * @repo/ui — Shared UI Component Library
 *
 * Themeable components driven by CSS custom properties.
 * Each site defines its own palette in globals.css; components adapt automatically.
 */

// Consolidated component exports for better tree-shaking and organization
export * from './layout';
export * from './primitives';
export * from './overlays';
export * from './navigation';
export * from './forms';
export * from './feedback';
export * from './advanced';
export * from './misc';
