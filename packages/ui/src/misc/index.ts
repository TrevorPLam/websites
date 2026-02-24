/**
 * Miscellaneous components barrel export
 * Identity, theme, consent, and other utility components
 */

export { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
} from '../components/Avatar';
export { ThemeInjector } from '../components/ThemeInjector';
export type { ThemeInjectorProps, ThemeColors } from '../components/ThemeInjector';
export { ConsentProvider, useConsentContext } from '../contexts/ConsentContext';
export type { ConsentState } from '../contexts/ConsentContext';
export { useConsent } from '../hooks/useConsent';
export { useOfflineForm } from '../hooks/use-offline-form';
export { ScriptManager } from '../components/ScriptManager';
export type { ScriptConfig } from '../components/ScriptManager';
export { OfflineBanner } from '../components/OfflineBanner';
export { Accordion } from '../components/Accordion';
export type { AccordionItem, AccordionProps } from '../components/Accordion';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/Collapsible';
export type { CollapsibleProps, CollapsibleTriggerProps } from '../components/Collapsible';
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
} from '../components/Sheet';
export type {
  SheetProps,
  SheetTriggerProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
} from '../components/Sheet';
