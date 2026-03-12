import React from 'react';
import type { DateFieldConfig, TimeFieldConfig, DateTimeFieldConfig } from '../../types/field.types';
type DateLikeConfig = DateFieldConfig | TimeFieldConfig | DateTimeFieldConfig;
interface DateFieldProps {
    config: DateLikeConfig;
}
export declare function DateField({ config }: DateFieldProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=DateField.d.ts.map