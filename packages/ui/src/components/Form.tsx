'use client';

// File: packages/ui/src/components/Form.tsx  [TRACE:FILE=packages.ui.components.Form]
// Purpose: Form wrapper with React Hook Form and Zod validation integration.
//          Provides form validation, error handling, and accessible error display.
//
// Relationship: Depends on react-hook-form, @hookform/resolvers, zod, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for forms requiring validation. Integrates with existing form controls.
//
// Exports / Entry: Form component and sub-components, FormProps interfaces
// Used by: Contact forms, booking forms, admin interfaces
//
// Invariants:
// - Uses React Hook Form for form state management
// - Supports Zod schema validation
// - Accessible error messages
//
// Status: @public
// Features:
// - [FEAT:UI] React Hook Form integration
// - [FEAT:UI] Zod schema validation
// - [FEAT:ACCESSIBILITY] Accessible error messages

import * as React from 'react';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  Path,
  type DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FormProps<T extends FieldValues> extends Omit<
  React.HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  /** Form schema (Zod schema) */
  schema?: z.ZodSchema<T>;
  /** Default form values */
  defaultValues?: Partial<T>;
  /** Callback when form is submitted */
  onSubmit: (data: T) => void | Promise<void>;
  /** Form methods from useForm (for controlled forms) */
  form?: UseFormReturn<T>;
  /** Children */
  children: React.ReactNode;
}

export interface FormFieldProps<T extends FieldValues> {
  /** Field name */
  name: Path<T>;
  /** Render function */
  render: (props: {
    field: {
      value: unknown;
      onChange: (value: unknown) => void;
      onBlur: () => void;
      name: string;
      ref: React.Ref<unknown>;
    };
    fieldState: {
      error?: { message?: string };
      invalid: boolean;
      isDirty: boolean;
      isTouched: boolean;
    };
  }) => React.ReactNode;
}

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;
export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export type FormControlProps = React.HTMLAttributes<HTMLDivElement>;
export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

// ─── Components ──────────────────────────────────────────────────────────────

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  form: externalForm,
  children,
  className,
  ...props
}: FormProps<T>) {
  const internalForm = useForm<T>({
    resolver: schema
      ? zodResolver(schema as unknown as Parameters<typeof zodResolver>[0])
      : undefined,
    defaultValues: defaultValues as DefaultValues<T> | undefined,
  });

  const form = externalForm || internalForm;

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data as T);
  });

  return (
    <FormProvider {...(form as UseFormReturn<FieldValues>)}>
      <FormContext.Provider value={form as UseFormReturn<FieldValues>}>
        <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    </FormProvider>
  );
}

const FormContext = React.createContext<UseFormReturn<FieldValues> | null>(null);

export function FormField<T extends FieldValues>({ name, render }: FormFieldProps<T>) {
  const form = React.useContext(FormContext) as UseFormReturn<T> | null;
  if (!form) {
    throw new Error('FormField must be used within a Form component');
  }
  const fieldState = form.getFieldState(name as Path<T>);
  const value = form.getValues(name as Path<T>);
  const field = {
    value,
    onChange: (newValue: unknown) => form.setValue(name as Path<T>, newValue as T[Path<T>]),
    onBlur: () => form.trigger(name as Path<T>),
    name: name as string,
    ref: React.createRef(),
  };
  return <>{render({ field, fieldState })}</>;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
);
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => (
    // Note: This is a generic label component. Association with controls is handled by consumers.
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />
);
FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        className={cn('text-sm font-medium text-destructive', className)}
        role="alert"
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = 'FormMessage';
