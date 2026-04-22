import React from 'react';
import { type ViewStyle } from 'react-native';
import { type SFormApiConfig } from './hooks/useSFormApi';
import type { FormListItem } from './types/sform.types';
/**
 * SFormList - Danh sách các form khảo sát
 *
 * ## Cập nhật số lần đã làm sau khi submit form:
 *
 * ### Cách 1: Update trực tiếp state (Recommended - Không cần fetch API)
 * ```tsx
 * // Screen List
 * const listRef = useRef<SFormListRef>(null);
 *
 * <SFormList
 *   ref={listRef}
 *   shopId={shopId}
 *   apiConfig={apiConfig}
 *   onSelectForm={(formKey, shopId, item) => {
 *     navigation.navigate('FormResult', {
 *       formKey,
 *       shopId,
 *       onSuccess: () => {
 *         // Update số lần đã làm khi submit thành công
 *         listRef.current?.updateFormDoneCount(formKey);
 *       }
 *     });
 *   }}
 * />
 *
 * // Screen FormResult
 * <SFormResult
 *   formKey={formKey}
 *   onSubmitSuccess={() => {
 *     route.params?.onSuccess?.(); // Gọi callback để update list
 *     navigation.goBack();
 *   }}
 * />
 * ```
 *
 * ### Cách 2: Refresh toàn bộ list (Fetch API lại)
 * ```tsx
 * const listRef = useRef<SFormListRef>(null);
 *
 * useFocusEffect(
 *   useCallback(() => {
 *     listRef.current?.refresh();
 *   }, [])
 * );
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
    /** Refresh danh sách form (fetch API lại) */
    refresh: () => void;
    /** Cập nhật số lần đã làm cho 1 form cụ thể (không cần fetch API) */
    updateFormDoneCount: (formKey: string) => void;
}
export declare const SFormList: React.ForwardRefExoticComponent<SFormListProps & React.RefAttributes<SFormListRef>>;
//# sourceMappingURL=SFormList.d.ts.map