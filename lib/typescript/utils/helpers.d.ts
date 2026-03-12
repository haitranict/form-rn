import type { FieldConfig } from '../types/field.types';
/**
 * Build default values map from field configs.
 */
export declare function buildDefaultValues(fields: FieldConfig[]): Record<string, unknown>;
/**
 * Flatten pages fields into a single array.
 */
export declare function flattenFields(fields?: FieldConfig[], pages?: Array<{
    fields: FieldConfig[];
}>): FieldConfig[];
/**
 * Deep clone a plain object (for form values).
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Filter out layout-only fields (section_header, divider) for submission.
 */
export declare function filterSubmitValues(values: Record<string, unknown>, fields: FieldConfig[]): Record<string, unknown>;
//# sourceMappingURL=helpers.d.ts.map