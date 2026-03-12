import React from 'react';
import { type ViewStyle } from 'react-native';
import { type SFormApiConfig } from './hooks/useSFormApi';
import type { FormListItem } from './types/sform.types';
export interface SFormListProps {
    /** ID shop để lấy danh sách form */
    shopId: number;
    /** Cấu hình API */
    apiConfig: SFormApiConfig;
    /** Callback khi click vào 1 form */
    onSelectForm: (formKey: string, shopId: number, formItem: FormListItem) => void;
    /** Custom empty message */
    emptyMessage?: string;
    /** Custom style */
    style?: ViewStyle;
}
export declare function SFormList({ shopId, apiConfig, onSelectForm, emptyMessage, style, }: SFormListProps): React.JSX.Element;
//# sourceMappingURL=SFormList.d.ts.map