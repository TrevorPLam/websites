/**
 * Form validation helpers and utilities
 * Provides comprehensive validation patterns and form state management
 */

import { z } from 'zod';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

// ─── Validation Patterns ───────────────────────────────────────────────────────

export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
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

export function createPaymentSchema() {
  return z.object({
    cardNumber: z.string().regex(validationPatterns.creditCard, 'Please enter a valid credit card number'),
    cardName: z.string().min(3, 'Name on card is required'),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
    expiryYear: z.string().regex(/^\d{2}$/, 'Invalid year'),
    cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
    billingAddress: createAddressSchema(),
    saveCard: z.boolean().default(false),
  }).refine(data => {
    const currentYear = new Date().getFullYear() % 100;
    const expiryYear = parseInt(data.expiryYear);
    const expiryMonth = parseInt(data.expiryMonth);
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < new Date().getMonth() + 1) return false;
    
    return true;
  }, {
    message: 'Card has expired',
    path: ['expiryYear'],
  });
}

export function createSurveySchema() {
  return z.object({
    overallSatisfaction: z.number().min(1).max(5, 'Please rate from 1 to 5'),
    recommendLikelihood: z.number().min(1).max(10, 'Please rate from 1 to 10'),
    features: z.array(z.string()).min(1, 'Please select at least one feature'),
    comments: z.string().optional(),
    contactPermission: z.boolean().default(false),
  });
}

// ─── Form State Management ─────────────────────────────────────────────────────

export interface FormProgress {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  isValid: boolean;
}

export function calculateFormProgress<T extends FieldValues>(
  form: UseFormReturn<T>,
  totalSteps: number
): FormProgress {
  const currentStep = Math.floor(Object.keys(form.formState.touchedFields).length / 2) + 1;
  const isValid = form.formState.isValid;
  const isCompleted = currentStep >= totalSteps && isValid;

  return {
    currentStep: Math.min(currentStep, totalSteps),
    totalSteps,
    isCompleted,
    isValid,
  };
}

export function getFormCompletionPercentage<T extends FieldValues>(
  form: UseFormReturn<T>,
  totalFields: number
): number {
  const touchedFields = Object.keys(form.formState.touchedFields).length;
  return Math.round((touchedFields / totalFields) * 100);
}

// ─── Form Validation Helpers ───────────────────────────────────────────────────

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

// ─── Form Submission Helpers ───────────────────────────────────────────────────

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

// ─── Form Persistence Helpers ───────────────────────────────────────────────────

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

// ─── Form Analytics Helpers ─────────────────────────────────────────────────────

export interface FormAnalytics {
  startTime: number;
  endTime?: number;
  completionTime?: number;
  fieldInteractions: Record<string, number>;
  errors: Record<string, number>;
  submissionAttempts: number;
  successfulSubmissions: number;
}

export function createFormAnalytics(): FormAnalytics {
  return {
    startTime: Date.now(),
    fieldInteractions: {},
    errors: {},
    submissionAttempts: 0,
    successfulSubmissions: 0,
  };
}

export function trackFieldInteraction<T extends FieldValues>(
  analytics: FormAnalytics,
  fieldName: Path<T>
): void {
  analytics.fieldInteractions[fieldName as string] = 
    (analytics.fieldInteractions[fieldName as string] || 0) + 1;
}

export function trackFieldError<T extends FieldValues>(
  analytics: FormAnalytics,
  fieldName: Path<T>
): void {
  analytics.errors[fieldName as string] = 
    (analytics.errors[fieldName as string] || 0) + 1;
}

export function trackSubmissionAttempt(analytics: FormAnalytics): void {
  analytics.submissionAttempts++;
}

export function trackSuccessfulSubmission(analytics: FormAnalytics): void {
  analytics.successfulSubmissions++;
  analytics.endTime = Date.now();
  analytics.completionTime = analytics.endTime - analytics.startTime;
}

// ─── Form Accessibility Helpers ─────────────────────────────────────────────────

export function generateFormAriaLabels<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldLabels: Record<Path<T>, string>
): Record<Path<T>, { 'aria-label': string; 'aria-invalid': boolean; 'aria-describedby'?: string }> {
  const labels: Record<string, any> = {};
  
  Object.keys(fieldLabels).forEach(fieldName => {
    const hasError = hasFieldError(form, fieldName as Path<T>);
    labels[fieldName] = {
      'aria-label': fieldLabels[fieldName as Path<T>],
      'aria-invalid': hasError,
      ...(hasError && { 'aria-describedby': `${fieldName}-error` }),
    };
  });
  
  return labels as Record<Path<T>, any>;
}

export function generateFormErrorIds<T extends FieldValues>(
  form: UseFormReturn<T>
): Record<Path<T>, string> {
  const errorIds: Record<string, string> = {};
  
  Object.keys(form.formState.errors).forEach(fieldName => {
    errorIds[fieldName] = `${fieldName}-error`;
  });
  
  return errorIds as Record<Path<T>, string>;
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
