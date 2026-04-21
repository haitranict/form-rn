import React from 'react';
import { type ViewStyle } from 'react-native';
import { type SFormApiConfig } from './hooks/useSFormApi';
import type { FormListItem } from './types/sform.types';
/**
 * SFormList - Danh sách các form khảo sát
 *
 * ## Auto-refresh sau khi submit form:
 *
 * ### Cách 1: Sử dụng ref (Recommended)
 * ```tsx
 * const listRef = useRef<SFormListRef>(null);
 *
 * <SFormList
 *   ref={listRef}
 *   shopId={shopId}
 *   apiConfig={apiConfig}
 *   onSelectForm={(formKey, shopId, item) => {
 *     navigation.navigate('FormResult', { formKey, shopId });
 *   }}
 * />
 *
 * // Trong screen FormResult, sau khi submit thành công:
 * <SFormResult
 *   onSubmitSuccess={() => {
 *     // Refresh list khi quay lại
 *     navigation.goBack();
 *   }}
 * />
 *
 * // Trong screen List, dùng focus listener:
 * useFocusEffect(
 *   useCallback(() => {
 *     listRef.current?.refresh();
 *   }, [])
 * );
 * ```
 *
 * ### Cách 2: Sử dụng refreshTrigger
 * ```tsx
 * const [refreshTrigger, setRefreshTrigger] = useState(0);
 *
 * <SFormList
 *   shopId={shopId}
 *   apiConfig={apiConfig}
 *   refreshTrigger={refreshTrigger}
 *   onSelectForm={...}
 * />
 *
 * // Sau khi submit thành công:
 * setRefreshTrigger(prev => prev + 1);
 * ```
 */
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
    /** Trigger để refresh list (tăng số này lên để refresh) */
    refreshTrigger?: number;
}
export interface SFormListRef {
    /** Refresh danh sách form */
    refresh: () => void;
}
export declare const SFormList: React.ForwardRefExoticComponent<SFormListProps & React.RefAttributes<SFormListRef>>;
//# sourceMappingURL=SFormList.d.ts.map