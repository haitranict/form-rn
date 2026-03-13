import type { FieldConfig } from '../types/field.types';
/**
 * Use inside any custom field component to read/write a specific field's
 * value, error, and touched state.
 */
export declare function useFormField(fieldConfig: FieldConfig): {
    value: unknown;
    error: import("..").FieldError | undefined;
    isTouched: boolean;
    onChange: (val: unknown) => void;
    onBlur: () => void;
    isVisible: boolean;
    isDisabled: boolean;
    isRequired: boolean;
};
//# sourceMappingURL=useFormField.d.ts.map