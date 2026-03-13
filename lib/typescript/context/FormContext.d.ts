import type { FieldConfig } from '../types/field.types';
import type { FormErrors, FormTouchedFields } from '../types/validation.types';
export interface FormContextValue {
    values: Record<string, unknown>;
    setFieldValue: (fieldId: string, value: unknown) => void;
    errors: FormErrors;
    setFieldError: (fieldId: string, error: import('../types/validation.types').FieldError | null) => void;
    touched: FormTouchedFields;
    setFieldTouched: (fieldId: string, isTouched?: boolean) => void;
    fields: FieldConfig[];
    isSubmitting: boolean;
    submitCount: number;
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    validateForm: () => FormErrors;
    validatePage: (pageIndex: number) => FormErrors;
    resetForm: () => void;
}
export declare const FormContext: import("react").Context<FormContextValue | null>;
export declare function useFormContext(): FormContextValue;
//# sourceMappingURL=FormContext.d.ts.map