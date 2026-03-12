import type { FieldConfig } from '../types/field.types';
import type { FieldError, FormErrors } from '../types/validation.types';
export declare function validateField(fieldConfig: FieldConfig, value: unknown, allValues: Record<string, unknown>): FieldError | null;
export declare function validateAllFields(fields: FieldConfig[], values: Record<string, unknown>): FormErrors;
//# sourceMappingURL=validation.d.ts.map