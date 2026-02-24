/**
 * @file packages/ui/src/forms/form-utils.ts
 * @summary Form utilities for enhanced form management.
 * @description Provides field array helpers, validation utilities, and form state management.
 * @security None - UI form utilities only.
 * @adr none
 * @requirements none
 */

import { UseFormReturn, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@repo/utils';

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

/**
 * Enhanced useFieldArray hook with additional utility methods.
 *
 * @param form - React Hook Form instance for managing the field array state.
 * @param name - Field name path in the form.
 * @returns Enhanced field array methods with additional utilities.
 */
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

/**
 * Creates a required field validation schema.
 *
 * @param message - Custom error message for required validation.
 * @returns Zod schema for required field validation.
 */
export function createRequiredField(message = 'This field is required') {
  return z.string().min(1, { message });
}

/**
 * Creates an email field validation schema.
 *
 * @param message - Custom error message for email validation.
 * @returns Zod schema for email field validation.
 */
export function createEmailField(message = 'Please enter a valid email address') {
  return z.string().email({ message });
}

/**
 * Creates a password field validation schema with security requirements.
 *
 * @param minLength - Minimum password length requirement.
 * @param requireUppercase - Whether to require uppercase letters.
 * @param requireLowercase - Whether to require lowercase letters.
 * @param requireNumbers - Whether to require numbers.
 * @param requireSpecialChars - Whether to require special characters.
 * @returns Zod schema for password field validation.
 */
export function createPasswordField(
  minLength = 8,
  message = `Password must be at least ${minLength} characters`
) {
  return z.string().min(minLength, { message });
}

/**
 * Creates a phone field validation schema.
 *
 * @param message - Custom error message for phone validation.
 * @returns Zod schema for phone field validation.
 */
export function createPhoneField(message = 'Please enter a valid phone number') {
  return z.string().regex(/^\+?[\d\s\-\(\)]+$/, { message });
}

/**
 * Creates a URL field validation schema.
 *
 * @param message - Custom error message for URL validation.
 * @returns Zod schema for URL field validation.
 */
export function createUrlField(message = 'Please enter a valid URL') {
  return z.string().url({ message });
}

/**
 * Creates a date field validation schema.
 *
 * @param message - Custom error message for date validation.
 * @returns Zod schema for date field validation.
 */
export function createDateField(message = 'Please enter a valid date') {
  return z.string().refine((date) => !isNaN(Date.parse(date)), { message });
}

/**
 * Creates a number field validation schema with optional range constraints.
 *
 * @param min - Minimum allowed value.
 * @param max - Maximum allowed value.
 * @param message - Custom error message for number validation.
 * @returns Zod schema for number field validation.
 */
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

/**
 * Creates a select field validation schema from enum options.
 *
 * @param schema - Zod enum schema defining the valid options.
 * @param message - Custom error message for select validation.
 * @returns Zod schema for select field validation.
 */
export function createSelectField<T extends z.ZodEnum<any>>(
  enumSchema: T,
  message = 'Please select a valid option'
) {
  return enumSchema;
}

/**
 * Creates a checkbox field validation schema.
 *
 * @param message - Custom error message for checkbox validation.
 * @returns Zod schema for checkbox field validation.
 */
export function createCheckboxField(message = 'This field must be checked') {
  return z.boolean().refine((val) => val === true, { message });
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

/**
 * Gets the current form state including dirty, valid, and submitting status.
 *
 * @param form - React Hook Form instance.
 * @returns Current form state object.
 */
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

/**
 * Checks if the form has any validation errors.
 *
 * @param form - React Hook Form instance.
 * @returns True if form has errors, false otherwise.
 */
export function hasFormErrors<T extends FieldValues>(form: UseFormReturn<T>): boolean {
  return Object.keys(form.formState.errors).length > 0;
}

/**
 * Gets the first validation error message from the form.
 *
 * @param form - React Hook Form instance.
 * @param fieldName - Optional specific field name to check.
 * @returns First error message or null if no errors.
 */
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

/**
 * Scrolls to the first form field with a validation error.
 *
 * @param form - React Hook Form instance.
 * @param options - Scroll behavior options.
 */
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

// ─── Form Submission Utilities ───────────────────────────────────────────────────

export interface FormSubmissionOptions {
  scrollToError?: boolean;
  resetOnSubmit?: boolean;
}

/**
 * Handles form submission with enhanced validation and error handling.
 *
 * @param form - React Hook Form instance.
 * @param onSubmit - Submit handler function.
 * @param options - Additional submission options.
 * @returns Promise resolving to submission result.
 */
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

// ─── Form Field Utilities ───────────────────────────────────────────────────────

export interface FormFieldConfig {
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Creates a standardized form field configuration object.
 *
 * @param config - Field configuration options.
 * @returns Normalized form field configuration.
 */
export function createFormFieldConfig(config: FormFieldConfig): FormFieldConfig {
  return {
    label: config.label,
    placeholder: config.placeholder,
    description: config.description,
    required: config.required,
    disabled: config.disabled,
  };
}

/**
 * Gets the validation error message for a specific form field.
 *
 * @param form - React Hook Form instance.
 * @param fieldName - Field name to check for errors.
 * @returns Error message or null if no error.
 */
export function getFormFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message;
}

/**
 * Checks if a form field has been touched by the user.
 *
 * @param form - React Hook Form instance.
 * @param fieldName - Field name to check.
 * @returns True if field has been touched, false otherwise.
 */
export function isFormFieldTouched<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return !!form.formState.touchedFields[fieldName];
}

/**
 * Checks if a form field has been modified (is dirty).
 *
 * @param form - React Hook Form instance.
 * @param fieldName - Field name to check.
 * @returns True if field is dirty, false otherwise.
 */
export function isFormFieldDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return !!form.formState.dirtyFields[fieldName];
}

// ─── Form Reset Utilities ───────────────────────────────────────────────────────

/**
 * Resets the form to its default values.
 *
 * @param form - React Hook Form instance.
 * @param options - Reset options.
 */
export function resetFormToDefaults<T extends FieldValues>(
  form: UseFormReturn<T>,
  defaultValues: Partial<T>
) {
  form.reset(defaultValues);
}

/**
 * Resets the form except for specified fields.
 *
 * @param form - React Hook Form instance.
 * @param exceptFields - Field names to exclude from reset.
 * @param options - Reset options.
 */
export function resetFormExcept<T extends FieldValues>(
  form: UseFormReturn<T>,
  excludeFields: Path<T>[]
) {
  const currentValues = form.getValues();
  const resetValues = { ...currentValues };

  excludeFields.forEach(field => {
    delete resetValues[field];
  });

  form.reset(resetValues as Partial<T>);
}

// ─── Form Validation Schema Utilities ───────────────────────────────────────────

/**
 * Creates a base user schema with common user fields.
 *
 * @returns Zod schema for user validation.
 */
export function createBaseUserSchema() {
  return z.object({
    firstName: createRequiredField('First name is required'),
    lastName: createRequiredField('Last name is required'),
    email: createEmailField(),
    phone: createPhoneField().optional(),
  });
}

/**
 * Creates an address schema with address-related fields.
 *
 * @returns Zod schema for address validation.
 */
export function createAddressSchema() {
  return z.object({
    street: createRequiredField('Street address is required'),
    city: createRequiredField('City is required'),
    state: createRequiredField('State is required'),
    zipCode: createRequiredField('ZIP code is required'),
    country: createRequiredField('Country is required'),
  });
}

/**
 * Creates a contact form schema with common contact fields.
 *
 * @returns Zod schema for contact form validation.
 */
export function createContactFormSchema() {
  return z.object({
    name: createRequiredField('Name is required'),
    email: createEmailField(),
    subject: createRequiredField('Subject is required'),
    message: createRequiredField('Message is required'),
    phone: createPhoneField().optional(),
  });
}

/**
 * Creates a newsletter subscription schema.
 *
 * @returns Zod schema for newsletter validation.
 */
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
