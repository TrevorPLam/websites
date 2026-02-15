// File: packages/ui/src/index.ts  [TRACE:FILE=packages.ui.index]
// Purpose: Shared UI component library entry point for the monorepo. Provides themeable
//          React components driven by CSS custom properties, enabling consistent design
//          systems across all template applications.
//
// Exports / Entry: All UI components (Container, Section, Button, Card, Input, Select, Textarea, Accordion, Dialog)
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

// Layout
export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';
export { Section } from './components/Section';
export type { SectionProps } from './components/Section';

// Primitives
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';

// Form
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';
export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

// Disclosure
export { Accordion } from './components/Accordion';
export type { AccordionItem, AccordionProps } from './components/Accordion';

// Overlay
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/Dialog';
export type {
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
} from './components/Dialog';

// Theme
export { ThemeInjector } from './components/ThemeInjector';
export type { ThemeInjectorProps, ThemeColors } from './components/ThemeInjector';
