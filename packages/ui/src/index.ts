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

// Consent Management
export { ConsentProvider, useConsentContext } from './contexts/ConsentContext';
export type { ConsentState } from './contexts/ConsentContext';
export { useConsent } from './hooks/useConsent';
export { ScriptManager } from './components/ScriptManager';
export type { ScriptConfig } from './components/ScriptManager';

// Layout
export { Container } from './components/Container';
export type { ContainerProps } from './components/Container';
export { Section } from './components/Section';
export type { SectionProps } from './components/Section';
export { AspectRatio } from './components/AspectRatio';
export type { AspectRatioProps } from './components/AspectRatio';

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
export { Label } from './components/Label';
export type { LabelProps } from './components/Label';
export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';
export { RadioGroup, RadioGroupItem } from './components/RadioGroup';
export type { RadioGroupProps, RadioGroupItemProps } from './components/RadioGroup';

// Disclosure
export { Accordion } from './components/Accordion';
export type { AccordionItem, AccordionProps } from './components/Accordion';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/Collapsible';
export type { CollapsibleProps, CollapsibleTriggerProps } from './components/Collapsible';

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
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/AlertDialog';
export type {
  AlertDialogProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
} from './components/AlertDialog';

// Theme
export { ThemeInjector } from './components/ThemeInjector';
export type { ThemeInjectorProps, ThemeColors } from './components/ThemeInjector';

// Notification
export { Toaster } from './components/Toaster';
export type { ToasterProps } from './components/Toaster';
export { toast, useToast } from './components/Toast';
export type { ToastOptions, ToastVariant } from './components/Toast';

// Navigation / Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
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
export { Avatar, AvatarImage, AvatarFallback } from './components/Avatar';
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
export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';
export { Progress } from './components/Progress';
export type { ProgressProps, ProgressVariant, ProgressSize } from './components/Progress';
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/Breadcrumb';
export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
} from './components/Breadcrumb';
export { ScrollArea, ScrollBar } from './components/ScrollArea';
export type { ScrollAreaProps, ScrollBarProps } from './components/ScrollArea';
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/Resizable';
export type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
} from './components/Resizable';
export { Toggle } from './components/Toggle';
export type { ToggleProps, ToggleVariant, ToggleSize } from './components/Toggle';
export { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup';
export type { ToggleGroupProps, ToggleGroupItemProps } from './components/ToggleGroup';
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuRadioGroup,
} from './components/ContextMenu';
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubProps,
  ContextMenuSubContentProps,
  ContextMenuSubTriggerProps,
} from './components/ContextMenu';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './components/HoverCard';
export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
} from './components/HoverCard';
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarPortal,
  MenubarRadioGroup,
} from './components/Menubar';
export type {
  MenubarProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarContentProps,
  MenubarItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioItemProps,
  MenubarLabelProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubProps,
  MenubarSubContentProps,
  MenubarSubTriggerProps,
} from './components/Menubar';
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from './components/NavigationMenu';
export type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
} from './components/NavigationMenu';
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
} from './components/Sheet';
export type {
  SheetProps,
  SheetTriggerProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
} from './components/Sheet';
export { Calendar } from './components/Calendar';
export type { CalendarProps } from './components/Calendar';
export { DatePicker } from './components/DatePicker';
export type { DatePickerProps } from './components/DatePicker';
export { Alert, AlertTitle, AlertDescription } from './components/Alert';
export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertVariant,
} from './components/Alert';
export { Rating } from './components/Rating';
export type { RatingProps } from './components/Rating';
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './components/Pagination';
export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from './components/Pagination';
export { Stepper } from './components/Stepper';
export type { StepperProps, StepperStep } from './components/Stepper';
export { Timeline } from './components/Timeline';
export type { TimelineProps, TimelineItem } from './components/Timeline';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './components/Table';
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableColumn,
  SortDirection,
} from './components/Table';
export { TimePicker } from './components/TimePicker';
export type { TimePickerProps } from './components/TimePicker';
export { ColorPicker } from './components/ColorPicker';
export type { ColorPickerProps, ColorFormat } from './components/ColorPicker';
export { FileUpload } from './components/FileUpload';
export type { FileUploadProps } from './components/FileUpload';
export { Masonry } from './components/Masonry';
export type { MasonryProps } from './components/Masonry';
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './components/Form';
export type {
  FormProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
} from './components/Form';
export { TreeView } from './components/TreeView';
export type { TreeViewProps, TreeNode, TreeNodeProps } from './components/TreeView';
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './components/Carousel';
export type {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselPreviousProps,
  CarouselNextProps,
} from './components/Carousel';
export { VirtualList } from './components/VirtualList';
export type { VirtualListProps } from './components/VirtualList';
export { InfiniteScroll } from './components/InfiniteScroll';
export type { InfiniteScrollProps } from './components/InfiniteScroll';
export { DragAndDrop } from './components/DragAndDrop';
export type { DragAndDropProps, SortableItemProps } from './components/DragAndDrop';
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './components/Command';
export type {
  CommandProps,
  CommandDialogProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandShortcutProps,
  CommandSeparatorProps,
} from './components/Command';
export {
  SelectEnhanced,
  SelectEnhancedTrigger,
  SelectEnhancedValue,
  SelectEnhancedContent,
  SelectEnhancedItem,
  SelectEnhancedGroup,
  SelectEnhancedLabel,
  SelectEnhancedSeparator,
  SelectEnhancedScrollUpButton,
  SelectEnhancedScrollDownButton,
} from './components/SelectEnhanced';
export type {
  SelectEnhancedProps,
  SelectEnhancedTriggerProps,
  SelectEnhancedValueProps,
  SelectEnhancedContentProps,
  SelectEnhancedItemProps,
  SelectEnhancedGroupProps,
  SelectEnhancedLabelProps,
  SelectEnhancedSeparatorProps,
} from './components/SelectEnhanced';
