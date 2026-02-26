/**
 * @file packages/ui/src/forms/index.ts
 * @summary Form components barrel export.
 * @description Advanced form controls and form utilities.
 * @security None - UI form exports only.
 * @adr none
 * @requirements none
 */

export { Calendar } from '../components/Calendar';
export type { CalendarProps } from '../components/Calendar';
export { ColorPicker } from '../components/ColorPicker';
export type { ColorFormat, ColorPickerProps } from '../components/ColorPicker';
export { DatePicker } from '../components/DatePicker';
export type { DatePickerProps } from '../components/DatePicker';
export { FileUpload } from '../components/FileUpload';
export type { FileUploadProps } from '../components/FileUpload';
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/Form';
export type {
  FormControlProps,
  FormDescriptionProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
} from '../components/Form';
export { Rating } from '../components/Rating';
export type { RatingProps } from '../components/Rating';
export { Stepper } from '../components/Stepper';
export type { StepperProps, StepperStep } from '../components/Stepper';
export { TimePicker } from '../components/TimePicker';
export type { TimePickerProps } from '../components/TimePicker';

// Form utilities
export {
  createAddressSchema,
  createBaseUserSchema,
  createCheckboxField,
  createContactFormSchema,
  createDateField,
  createEmailField,
  createFormFieldConfig,
  createNewsletterSchema,
  createNumberField,
  createPasswordField,
  createPhoneField,
  createRequiredField,
  createSelectField,
  createUrlField,
  getFirstFormError,
  getFormFieldError,
  getFormState,
  handleSubmitWithValidation,
  hasFormErrors,
  isFormFieldDirty,
  isFormFieldTouched,
  resetFormExcept,
  resetFormToDefaults,
  scrollToFirstError,
  useFieldArrayEnhanced,
} from './form-utils';
export type {
  FieldArrayProps,
  FormFieldConfig,
  FormState,
  FormSubmissionOptions,
  UseFieldArrayReturn,
} from './form-utils';

// Field array components
export { DynamicFieldArray, FieldArrayItem } from './field-array';
export type { DynamicFieldArrayProps, FieldArrayItemProps } from './field-array';

// Validation helpers
export {
  clearAllErrors,
  clearFieldError,
  clearFormData,
  createUserRegistrationSchema,
  getFieldErrorMessage,
  hasFieldError,
  loadFormData,
  saveFormData,
  submitForm,
  validateAllFields,
  validateField,
  validationPatterns,
  validationRules,
} from './validation-helpers';
export type { FormSubmissionResult } from './validation-helpers';
