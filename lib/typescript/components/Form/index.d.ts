import React from 'react';
import { type ViewStyle } from 'react-native';
import type { FormConfig } from '../../types/form.types';
import type { FormTheme } from '../../theme/defaultTheme';
interface FormProps {
    config: FormConfig;
    theme?: Partial<FormTheme>;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}
/**
 * Main Form component export.
 *
 * Usage:
 * ```tsx
 * <Form
 *   config={{
 *     id: 'my-form',
 *     fields: [...],
 *     onSubmit: (data) => console.log(data),
 *   }}
 * />
 * ```
 */
export declare function Form({ theme, ...props }: FormProps): React.JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map