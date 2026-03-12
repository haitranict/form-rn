import { createContext, useContext } from 'react';
import type { FieldConfig } from '../types/field.types';
import type { FormErrors, FormTouchedFields } from '../types/validation.types';

export interface FormContextValue {
  // Values
  values: Record<string, unknown>;
  setFieldValue: (fieldId: string, value: unknown) => void;

  // Errors
  errors: FormErrors;
  setFieldError: (fieldId: string, error: import('../types/validation.types').FieldError | null) => void;

  // Touched
  touched: FormTouchedFields;
  setFieldTouched: (fieldId: string, isTouched?: boolean) => void;

  // Fields (flattened)
  fields: FieldConfig[];

  // Submission
  isSubmitting: boolean;
  submitCount: number;

  // Pagination
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;

  // Helpers
  validateForm: () => FormErrors;
  validatePage: (pageIndex: number) => FormErrors;
  resetForm: () => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used inside a <Form> component');
  }
  return ctx;
}
