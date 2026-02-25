/**
 * @file packages/ui/src/forms/validation-helpers.ts
 * @summary Validation helper functions and schemas.
 * @description Provides reusable validation patterns and schema definitions.
 * @security none
 * @adr none
 * @requirements DOMAIN-3-1
 */

/**
 * Form validation helpers and utilities
 */

import { z } from 'zod';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

// ─── Validation Patterns ─────────────────────────────────────────────────────--

export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  zipCode: /^\d{5}(-\d{4})?$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// ─── Enhanced Validation Schemas ─────────────────────────────────────────────────

export function createUserRegistrationSchema() {
  return z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(validationPatterns.strongPassword, 'Password must contain uppercase, lowercase, number, and special character'),
    confirmPassword: z.string(),
    phone: z.string().regex(validationPatterns.phone, 'Please enter a valid phone number').optional(),
    acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
}

export function createContactFormSchema() {
  return z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    phone: z.string().regex(validationPatterns.phone, 'Please enter a valid phone number').optional(),
    preferredContact: z.enum(['email', 'phone', 'both']).default('email'),
  });
}

export function createAddressSchema() {
  return z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(validationPatterns.zipCode, 'Please enter a valid ZIP code'),
    country: z.string().min(2, 'Country is required'),
    addressType: z.enum(['home', 'work', 'other']).default('home'),
  });
}

// ─── Form Validation Helpers ─────────────────────────────────────────────────--

export function validateField<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): Promise<boolean> {
  return form.trigger(fieldName);
}

export function validateAllFields<T extends FieldValues>(
  form: UseFormReturn<T>
): Promise<boolean> {
  return form.trigger();
}

export function hasFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): boolean {
  return !!form.formState.errors[fieldName];
}

export function getFieldErrorMessage<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): string | undefined {
  const error = form.formState.errors[fieldName];
  return error?.message as string;
}

export function clearFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): void {
  form.clearErrors(fieldName);
}

export function clearAllErrors<T extends FieldValues>(form: UseFormReturn<T>): void {
  form.clearErrors();
}

// ─── Form Submission Helpers ─────────────────────────────────────────────────--

export interface FormSubmissionResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

export async function submitForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  submitFn: (data: T) => Promise<T | void>,
  options: {
    validateOnSubmit?: boolean;
    resetOnSuccess?: boolean;
    scrollToError?: boolean;
  } = {}
): Promise<FormSubmissionResult<T>> {
  const {
    validateOnSubmit = true,
    resetOnSuccess = false,
    scrollToError = true,
  } = options;

  try {
    // Validate form if required
    if (validateOnSubmit) {
      const isValid = await validateAllFields(form);
      if (!isValid) {
        if (scrollToError) {
          const firstError = Object.keys(form.formState.errors)[0];
          const element = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }
        return {
          success: false,
          errors: Object.fromEntries(
            Object.entries(form.formState.errors).map(([key, error]) => [
              key,
              error?.message as string,
            ])
          ),
          message: 'Please fix the errors before submitting',
        };
      }
    }

    // Get form data and submit
    const data = form.getValues();
    const result = await submitFn(data);

    // Reset form on success if required
    if (resetOnSuccess) {
      form.reset();
    }

    return {
      success: true,
      data: result as T,
      message: 'Form submitted successfully',
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during submission',
    };
  }
}

// ─── Form Persistence Helpers ─────────────────────────────────────────────────--

export function saveFormData<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string
): void {
  try {
    const data = form.getValues();
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

export function loadFormData<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string
): void {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const data = JSON.parse(savedData);
      form.reset(data);
    }
  } catch (error) {
    console.error('Error loading form data:', error);
  }
}

export function clearFormData(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

// ─── Form Validation Rules ─────────────────────────────────────────────────────

export const validationRules = {
  required: (message = 'This field is required') => z.string().min(1, message),
  minLength: (min: number, message?: string) => z.string().min(min, message || `Must be at least ${min} characters`),
  maxLength: (max: number, message?: string) => z.string().max(max, message || `Must be no more than ${max} characters`),
  min: (min: number, message?: string) => z.number().min(min, message || `Must be at least ${min}`),
  max: (max: number, message?: string) => z.number().max(max, message || `Must be no more than ${max}`),
  email: (message = 'Please enter a valid email address') => z.string().email(message),
  url: (message = 'Please enter a valid URL') => z.string().url(message),
  pattern: (regex: RegExp, message = 'Invalid format') => z.string().regex(regex, message),
  optional: <T extends z.ZodType>(schema: T) => schema.optional(),
  nullable: <T extends z.ZodType>(schema: T) => schema.nullable(),
  array: <T extends z.ZodType>(schema: T, min?: number, max?: number) => {
    let arraySchema = z.array(schema);
    if (min !== undefined) arraySchema = arraySchema.min(min, `Must have at least ${min} items`);
    if (max !== undefined) arraySchema = arraySchema.max(max, `Must have no more than ${max} items`);
    return arraySchema;
  },
};
