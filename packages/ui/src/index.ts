/**
 * @file packages/ui/src/index.ts
 * @summary UI package barrel export with enhanced primitives
 * @description Complete UI component library with CVA architecture, Radix UI integration, and WCAG 2.2 AA compliance
 * @security None - UI component exports only
 * @requirements PROD-UI-001, TASK-005
 */

// Enhanced primitives with loading states and full accessibility
export { Button as ButtonEnhanced } from './components/ButtonEnhanced';
export type { ButtonProps as ButtonEnhancedProps } from './components/ButtonEnhanced';

// Error boundaries and fallback UI components (consolidated)
export {
  ErrorBoundary,
  EnhancedErrorBoundary,
  RootErrorBoundary,
  WidgetErrorBoundary,
  useErrorBoundary,
  type ErrorContext,
  type EnhancedErrorBoundaryProps,
} from './components/ErrorBoundary';
export {
  ErrorFallback,
  LoadingFallback,
  NetworkErrorFallback,
  FormErrorFallback,
  WidgetFallback,
  PageFallback,
  InlineFallback,
  type BaseFallbackProps,
  type LoadingFallbackProps,
  type NetworkErrorFallbackProps,
  type FormErrorFallbackProps,
} from './components/FallbackUI';

// Toast notifications with promise-based loading states (consolidated)
export {
  Toast,
  Toaster,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastPromise,
  toastDismiss,
  toastDismissAll,
  validateToastAccessibility,
  type ToastProps,
  type ToastOptions,
  type ToasterProps,
} from './components/Sonner';

// Existing primitives
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Select } from './components/Select';
export type { SelectOption, SelectProps } from './components/Select';
export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';
export { Label } from './components/Label';
export type { LabelProps } from './components/Label';
export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';
export { RadioGroup, RadioGroupItem } from './components/RadioGroup';
export type { RadioGroupProps, RadioGroupItemProps } from './components/RadioGroup';
export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize, SwitchVariant } from './components/Switch';
export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';
export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton';
export { Progress } from './components/Progress';
export type { ProgressProps, ProgressVariant, ProgressSize } from './components/Progress';
export { Toggle } from './components/Toggle';
export type { ToggleProps, ToggleVariant, ToggleSize } from './components/Toggle';
export { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup';
export type { ToggleGroupProps, ToggleGroupItemProps } from './components/ToggleGroup';

// Enhanced design tokens with CSS custom properties (consolidated)
export {
  themeTokens,
  generateCSSVariables,
  applyTenantTheme,
  validateWCAGCompliance,
  type ThemeTokens,
} from './design-tokens';

// Re-export from sub-modules (consolidated barrel exports)
export * from './layout';
export * from './navigation';
export * from './overlays';
export * from './forms';
export * from './feedback';
export * from './advanced';
export * from './misc';
export * from './privacy';
export * from './booking';
export * from './design-tokens';
export * from './primitives';
