import type { FormConfig } from '../types/form.types';
import type { FormErrors, FormTouchedFields } from '../types/validation.types';
import type { FieldConfig } from '../types/field.types';
/**
 * Core form state hook. Used internally by <Form> component.
 */
export declare function useForm(config: FormConfig): {
    values: Record<string, unknown>;
    errors: FormErrors;
    touched: FormTouchedFields;
    isSubmitting: boolean;
    submitCount: number;
    currentPage: number;
    totalPages: number;
    fields: FieldConfig[];
    pageFields: FieldConfig[][];
    setFieldValue: (fieldId: string, value: unknown) => void;
    setFieldError: (fieldId: string, error: import("../types/validation.types").FieldError | null) => void;
    setFieldTouched: (fieldId: string, isTouched?: boolean) => void;
    validateForm: () => FormErrors;
    validatePage: (pageIndex: number) => FormErrors;
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    resetForm: () => void;
    handleSubmit: () => Promise<void>;
};
//# sourceMappingURL=useForm.d.ts.map