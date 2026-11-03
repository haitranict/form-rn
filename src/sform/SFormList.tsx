import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  type ViewStyle,
} from 'react-native';
import moment from 'moment';
import { apiGetFormList, type SFormApiConfig } from './hooks/useSFormApi';
import type { FormListItem } from './types/sform.types';
import { getBannerImageUrl } from './utils/bannerUtils';
import { cacheFormItems, setCachedFormItem } from './utils/formCache';

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

// ============================================================
// Props & Ref
// ============================================================

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

// ============================================================
// Main Component
// ============================================================

export const SFormList = forwardRef<SFormListRef, SFormListProps>(({
  shopId,
  apiConfig,
  onSelectForm,
  emptyMessage = 'Không có form khảo sát nào',
  style,
  refreshTrigger,
}, ref) => {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, refreshTrigger]);

  const loadForms = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('SFormList - Loading forms...', { shopId, baseUrl: apiConfig.baseUrl });
      const response = await apiGetFormList(apiConfig, shopId);
      console.log('SFormList - API Response:', response);
      
      if (response.statusId === 200) {
        const list = response.data || [];
        cacheFormItems(list);
        setForms(list);
        console.log('SFormList - Loaded forms count:', list.length);
      } else {
        const errorMsg = response.messager || 'Không thể tải danh sách form';
        console.log('SFormList - Error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('SFormList - Error:', err);
      const errorMessage = err?.message || 'Lỗi kết nối. Vui lòng thử lại.';
      setError(errorMessage);
      
      // Show alert with details for debugging
      Alert.alert(
        'Lỗi',
        `${errorMessage}\n\nDebug:\n- shopId: ${shopId}\n- baseUrl: ${apiConfig.baseUrl}\n- token: ${apiConfig.token ? 'có' : 'không'}`,
        [{ text: 'Thử lại', onPress: handleRetry }, { text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadForms();
  };

  const handleSelectForm = (item: FormListItem) => {
    setCachedFormItem(item);
    onSelectForm(item.accessKey, shopId, item);
  };

  // Update done count for a specific form (after submit success)
  const updateFormDoneCount = (formKey: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.accessKey === formKey
          ? { ...form, done: (form.done || 0) + 1 }
          : form
      )
    );
    console.log(`[SFormList] Updated done count for formKey: ${formKey}`);
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    refresh: loadForms,
    updateFormDoneCount,
  }));

  const renderFormItem = ({ item }: { item: FormListItem }) => {
    const isExpired = item.toDate ? item.toDate < parseInt(moment().format('YYYYMMDD'), 10) : false;
    const doneCount = Number(item.done ?? (item as any).Done ?? 0);
    const isCompleted = doneCount > 0;

    const rawLocked =
      item.locked ??
      item.Locked ??
      (item as any).isLocked ??
      (item as any).IsLocked ??
      (item as any).lock ??
      (item as any).Lock ??
      0;
    let isItemLocked = false;
    if (typeof rawLocked === 'boolean') {
      isItemLocked = rawLocked;
    } else if (typeof rawLocked === 'number') {
      isItemLocked = rawLocked > 0;
    } else if (typeof rawLocked === 'string') {
      const lower = rawLocked.trim().toLowerCase();
      isItemLocked = lower === 'true' || lower === 'yes' || lower === 'locked' || Number(lower) > 0;
    }

    return (
      <TouchableOpacity
        style={[
          styles.formItem,
          isCompleted && styles.formItemCompleted,
          isExpired && styles.formItemExpired,
          isItemLocked && styles.formItemLocked,
        ]}
        onPress={() => handleSelectForm(item)}
        activeOpacity={0.7}
      >
        {/* Banner Image */}
        {(() => {
          const imageUrl = getBannerImageUrl(item.banner);
          if (!imageUrl) return null;
          return (
            <Image
              source={{ uri: imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          );
        })()}
        
        <View style={styles.formItemContent}>
          {/* Nhãn Đã khoá hiển thị ở vị trí riêng (không chiếm chỗ số lần làm) */}
          {isItemLocked && (
            <View style={styles.lockedTagContainer}>
              <View style={styles.lockedTag}>
                <Text style={styles.lockedTagText}>🔒 ĐÃ KHOÁ</Text>
              </View>
            </View>
          )}

          <View style={styles.formItemHeader}>
            <Text style={styles.formName} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Vị trí bên phải vẫn giữ nguyên hiển thị số lần làm */}
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>
                  ✓ Đã làm ({doneCount})
                </Text>
              </View>
            )}
            {!isCompleted && isExpired && (
              <View style={styles.expiredBadge}>
                <Text style={styles.expiredText}>Hết hạn</Text>
              </View>
            )}
            {!isCompleted && !isExpired && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Chưa làm</Text>
              </View>
            )}
          </View>

          {item.subTitle && (
            <Text style={styles.description} numberOfLines={3}>
              {item.subTitle}
            </Text>
          )}

          {(item.fromDate || item.toDate) && (
            <View style={styles.dateRow}>
              {item.fromDate && (
                <Text style={styles.dateText}>
                  Từ: {moment(item.fromDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')}
                </Text>
              )}
              {item.toDate && (
                <Text style={[styles.dateText, isExpired && styles.dateExpired]}>
                  Đến: {moment(item.toDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================================
  // Render States
  // ============================================================

  if (loading) {
    return (
      <View style={[styles.container, styles.center, style]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Đang tải danh sách...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, style]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (forms.length === 0) {
    return (
      <View style={[styles.container, styles.center, style]}>
        <Text style={styles.emptyText}>📋 {emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={forms}
        renderItem={renderFormItem}
        keyExtractor={(item) => `${item.id}-${item.accessKey}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
});

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5F6368',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  formItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  formItemCompleted: {
    borderLeftColor: '#34A853',
    opacity: 0.85,
  },
  formItemExpired: {
    borderLeftColor: '#EA4335',
    opacity: 0.7,
  },
  formItemLocked: {
    borderLeftColor: '#D32F2F',
  },
  lockedTagContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  lockedTag: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    alignSelf: 'flex-start',
  },
  lockedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 0.5,
  },
  bannerImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8EAED',
  },
  formItemContent: {
    padding: 16,
  },
  formItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  formName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#202124',
    marginRight: 8,
  },
  lockedBadge: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C5221F',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34A853',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F9AB00',
  },
  expiredBadge: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA4335',
  },
  description: {
    fontSize: 14,
    color: '#5F6368',
    lineHeight: 20,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#5F6368',
  },
  dateExpired: {
    color: '#EA4335',
    fontWeight: '600',
  },
});
