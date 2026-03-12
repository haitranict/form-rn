import React from 'react';
import type { FieldConfig } from '../../types/field.types';
interface FieldRendererProps {
    field: FieldConfig;
}
/**
 * Renders the correct component based on field.type.
 * Add new field types here as the library grows.
 */
export declare function FieldRenderer({ field }: FieldRendererProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=FieldRenderer.d.ts.map