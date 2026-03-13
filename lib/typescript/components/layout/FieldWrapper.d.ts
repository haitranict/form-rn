import React from 'react';
import { type ViewStyle } from 'react-native';
interface FieldWrapperProps {
    children: React.ReactNode;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    style?: ViewStyle;
}
export declare function FieldWrapper({ children, label, description, error, required, style, }: FieldWrapperProps): React.JSX.Element;
export {};
//# sourceMappingURL=FieldWrapper.d.ts.map