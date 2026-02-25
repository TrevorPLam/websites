/**
 * @file packages/ui/src/forms/index.ts
 * @summary Form components barrel export.
 * @description Advanced form controls and form utilities.
 * @security None - UI form exports only.
 * @adr none
 * @requirements none
 */

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../components/Form';
export type {
  FormProps,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormMessageProps,
} from '../components/Form';
export { Calendar } from '../components/Calendar';
export type { CalendarProps } from '../components/Calendar';
export { DatePicker } from '../components/DatePicker';
export type { DatePickerProps } from '../components/DatePicker';
export { TimePicker } from '../components/TimePicker';
export type { TimePickerProps } from '../components/TimePicker';
export { ColorPicker } from '../components/ColorPicker';
export type { ColorPickerProps, ColorFormat } from '../components/ColorPicker';
export { FileUpload } from '../components/FileUpload';
export type { FileUploadProps } from '../components/FileUpload';
export { Rating } from '../components/Rating';
export type { RatingProps } from '../components/Rating';
export { Stepper } from '../components/Stepper';
export type { StepperProps, StepperStep } from '../components/Stepper';

// Form utilities
export {
  useFieldArrayEnhanced,
  createRequiredField,
  createEmailField,
  createPasswordField,
  createPhoneField,
  createUrlField,
  createDateField,
  createNumberField,
  createSelectField,
  createCheckboxField,
  getFormState,
  hasFormErrors,
  getFirstFormError,
  scrollToFirstError,
  handleSubmitWithValidation,
  createFormFieldConfig,
  getFormFieldError,
  isFormFieldTouched,
  isFormFieldDirty,
  resetFormToDefaults,
  resetFormExcept,
  createBaseUserSchema,
  createAddressSchema,
  createContactFormSchema,
  createNewsletterSchema,
} from './form-utils';
export type {
  FieldArrayProps,
  UseFieldArrayReturn,
  FormState,
  FormSubmissionOptions,
  FormFieldConfig,
} from './form-utils';

// Field array components
export {
  FieldArrayItem,
  DynamicFieldArray,
} from './field-array';
export type {
  FieldArrayItemProps,
  DynamicFieldArrayProps,
} from './field-array';

// Validation helpers
export {
  validationPatterns,
  createUserRegistrationSchema,
  createContactFormSchema,
  createAddressSchema,
  validateField,
  validateAllFields,
  hasFieldError,
  getFieldErrorMessage,
  clearFieldError,
  clearAllErrors,
  submitForm,
  saveFormData,
  loadFormData,
  clearFormData,
  validationRules,
} from './validation-helpers';
export type {
  FormSubmissionResult,
} from './validation-helpers';
