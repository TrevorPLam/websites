/**
 * @file packages/ui/src/forms/form-utils.ts
 * @summary Utility functions for form validation and management.
 * @description Provides common validation patterns and form helper functions.
 * @security none
 * @adr none
 * @requirements DOMAIN-3-1
 */

/**
 * Form utilities for enhanced form management
 * Provides field array helpers, validation utilities, and form state management
 */

import { UseFormReturn, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

// ─── Field Array Utilities ────────────────────────────────────────────────────────

export interface FieldArrayProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

export interface UseFieldArrayReturn<T extends FieldValues> {
  fields: { id: string; value: any }[];
  append: (value: any) => void;
  prepend: (value: any) => void;
  remove: (index: number) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: any) => void;
  update: (index: number, value: any) => void;
  replace: (index: number, value: any) => void;
}

export function useFieldArrayEnhanced<T extends FieldValues>({
  form,
  name,
}: FieldArrayProps<T>): UseFieldArrayReturn<T> {
  const { fields, append, prepend, remove, swap, move, insert, update, replace } = useFieldArray({
    control: form.control,
    name,
  });

  return {
    fields,
    append: (value: any) => append(value),
    prepend: (value: any) => prepend(value),
    remove: (index: number) => remove(index),
    swap: (indexA: number, indexB: number) => swap(indexA, indexB),
    move: (from: number, to: number) => move(from, to),
    insert: (index: number, value: any) => insert(index, value),
    update: (index: number, value: any) => update(index, value),
    replace: (index: number, value: any) => replace(index, value),
  };
}

// ─── Validation Utilities ───────────────────────────────────────────────────────

export function createRequiredField(message = 'This field is required') {
  return z.string().min(1, { message });
}

export function createEmailField(message = 'Please enter a valid email address') {
  return z.string().email({ message });
}

export function createPasswordField(
  minLength = 8,
  message = `Password must be at least ${minLength} characters`
) {
  return z.string().min(minLength, { message });
}

export function createPhoneField(message = 'Please enter a valid phone number') {
  return z.string().regex(/^\+?[\d\s\-\(\)]+$/, { message });
}

export function createUrlField(message = 'Please enter a valid URL') {
  return z.string().url({ message });
}

export function createDateField(message = 'Please enter a valid date') {
  return z.string().refine((date) => !isNaN(Date.parse(date)), { message });
}

export function createNumberField(
  min?: number,
  max?: number,
  message = 'Please enter a valid number'
) {
  let schema = z.string().regex(/^\d+$/, { message });

  if (min !== undefined) {
    schema = schema.refine((val) => parseInt(val) >= min, {
      message: `Number must be at least ${min}`,
    });
  }

  if (max !== undefined) {
    schema = schema.refine((val) => parseInt(val) <= max, {
      message: `Number must be at most ${max}`,
    });
  }

  return schema;
}

export function createCheckboxField(message = 'This field must be checked') {
  return z.boolean().refine((val) => val === true, { message });
}

export function createSelectField<T extends z.ZodTypeAny>(
  schema: T,
  message = 'Please select a valid option'
) {
  return schema.refine((val: any) => val !== undefined && val !== '', { message });
}

// ─── Form State Utilities ─────────────────────────────────────────────────────────

export interface FormState<T extends FieldValues> {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  touchedFields: Set<Path<T>>;
  dirtyFields: Set<Path<T>>;
  errors: Record<Path<T>, { message?: string }>;
}

export function getFormState<T extends FieldValues>(form: UseFormReturn<T>): FormState<T> {
  return {
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    touchedFields: new Set(Object.keys(form.formState.touchedFields) as Path<T>[]),
    dirtyFields: new Set(Object.keys(form.formState.dirtyFields) as Path<T>[]),
    errors: form.formState.errors as Record<Path<T>, { message?: string }>,
  };
}

export function hasFormErrors<T extends FieldValues>(form: UseFormReturn<T>): boolean {
  return Object.keys(form.formState.errors).length > 0;
}

export function getFirstFormError<T extends FieldValues>(
  form: UseFormReturn<T>
): { field: Path<T>; message: string } | null {
  const errors = form.formState.errors;
  const firstError = Object.entries(errors)[0];

  if (!firstError) return null;

  return {
    field: firstError[0] as Path<T>,
    message: firstError[1]?.message || 'Validation error',
  };
}

export function scrollToFirstError<T extends FieldValues>(form: UseFormReturn<T>) {
  const firstError = getFirstFormError(form);
  if (!firstError) return;

  const element = document.querySelector(
    `[name="${firstError.field}"], [data-field="${firstError.field}"]`
  ) as HTMLElement;

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

// ─── Form Submission Utilities ─────────────────────────────────────────────────--

export interface FormSubmissionOptions {
  scrollToError?: boolean;
  resetOnSubmit?: boolean;
}

export async function handleSubmitWithValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSubmit: (data: T) => void | Promise<void>,
  options: FormSubmissionOptions = {}
) {
  const { scrollToError = true, resetOnSubmit = false } = options;

  try {
    const isValid = await form.trigger();

    if (!isValid) {
      if (scrollToError) {
        scrollToFirstError(form);
      }
      return false;
    }

    const data = form.getValues();
    await onSubmit(data);

    if (resetOnSubmit) {
      form.reset();
    }

    return true;
  } catch (error) {
    console.error('Form submission error:', error);
    return false;
  }
}

// ─── Form Validation Schema Utilities ─────────────────────────────────────────--

export function createBaseUserSchema() {
  return z.object({
    firstName: createRequiredField('First name is required'),
    lastName: createRequiredField('Last name is required'),
    email: createEmailField(),
    phone: createPhoneField().optional(),
  });
}

export function createAddressSchema() {
  return z.object({
    street: createRequiredField('Street address is required'),
    city: createRequiredField('City is required'),
    state: createRequiredField('State is required'),
    zipCode: createRequiredField('ZIP code is required'),
    country: createRequiredField('Country is required'),
  });
}

export function createContactFormSchema() {
  return z.object({
    name: createRequiredField('Name is required'),
    email: createEmailField(),
    subject: createRequiredField('Subject is required'),
    message: createRequiredField('Message is required'),
    phone: createPhoneField().optional(),
  });
}

export function createNewsletterSchema() {
  return z.object({
    email: createEmailField(),
    firstName: z.string().optional(),
    preferences: z.object({
      marketing: z.boolean().default(false),
      product: z.boolean().default(true),
      newsletter: z.boolean().default(true),
    }),
  });
}

// ─── Additional Missing Functions ───────────────────────────────────────────────────

export interface FormFieldConfig {
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export function createFormFieldConfig(
  label: string,
  options: Partial<FormFieldConfig> = {}
): FormFieldConfig {
  return {
    label,
    placeholder: options.placeholder,
    required: options.required ?? false,
    disabled: options.disabled ?? false,
    description: options.description,
  };
}

export function getFormFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message as string | undefined;
}

export function isFormFieldTouched<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return fieldName in form.formState.touchedFields;
}

export function isFormFieldDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return fieldName in form.formState.dirtyFields;
}

export function resetFormToDefaults<T extends FieldValues>(
  form: UseFormReturn<T>,
  defaultValues?: Partial<T>
): void {
  form.reset(defaultValues);
}

export function resetFormExcept<T extends FieldValues>(
  form: UseFormReturn<T>,
  exceptFields: Path<T>[]
): void {
  const currentValues = form.getValues();
  const resetValues: Partial<T> = {};

  exceptFields.forEach(field => {
    resetValues[field] = currentValues[field];
  });

  form.reset(resetValues);
}
