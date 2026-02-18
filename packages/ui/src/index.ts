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

// Notification
export { Toaster } from './components/Toaster';
export type { ToasterProps } from './components/Toaster';
export { toast, useToast } from './components/Toast';
export type { ToastOptions, ToastVariant } from './components/Toast';

// Navigation / Tabs
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './components/Tabs';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsVariant,
  TabsSize,
} from './components/Tabs';

// Action Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './components/DropdownMenu';

// Informational Overlay
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from './components/Tooltip';
export type { TooltipContentProps } from './components/Tooltip';

// Interactive Overlay
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
} from './components/Popover';
export type { PopoverHeaderProps } from './components/Popover';

// Status / Labels
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

// Identity
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from './components/Avatar';
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
} from './components/Avatar';

// Loading States
export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton';

// Layout Divider
export { Separator } from './components/Separator';
export type { SeparatorProps } from './components/Separator';

// Form Controls
export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize, SwitchVariant } from './components/Switch';
