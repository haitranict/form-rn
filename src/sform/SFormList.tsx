import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  type ViewStyle,
} from 'react-native';
import moment from 'moment';
import { apiGetFormList, type SFormApiConfig } from './hooks/useSFormApi';
import type { FormListItem } from './types/sform.types';

// ============================================================
// Props
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
}

// ============================================================
// Main Component
// ============================================================

export function SFormList({
  shopId,
  apiConfig,
  onSelectForm,
  emptyMessage = 'Không có form khảo sát nào',
  style,
}: SFormListProps) {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const loadForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetFormList(apiConfig, shopId);

      if (response.code === 200) {
        setForms(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách form');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadForms();
  };

  const handleSelectForm = (item: FormListItem) => {
    onSelectForm(item.AccessKey, shopId, item);
  };

  const renderFormItem = ({ item }: { item: FormListItem }) => {
    const isExpired = item.ToDate ? item.ToDate < parseInt(moment().format('YYYYMMDD'), 10) : false;
    const isCompleted = false; // Mặc định chưa làm (theo yêu cầu)
    
    return (
      <TouchableOpacity
        style={[
          styles.formItem,
          isCompleted && styles.formItemCompleted,
          isExpired && styles.formItemExpired,
        ]}
        onPress={() => handleSelectForm(item)}
        activeOpacity={0.7}
      >
        <View style={styles.formItemHeader}>
          <Text style={styles.formName} numberOfLines={2}>
            {item.Title}
          </Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Đã làm</Text>
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

        {item.SubTitle && (
          <Text style={styles.description} numberOfLines={2}>
            {item.SubTitle}
          </Text>
        )}

        {(item.FromDate || item.ToDate) && (
          <View style={styles.dateRow}>
            {item.FromDate && (
              <Text style={styles.dateText}>
                Từ: {moment(item.FromDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')}
              </Text>
            )}
            {item.ToDate && (
              <Text style={[styles.dateText, isExpired && styles.dateExpired]}>
                Đến: {moment(item.ToDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')}
              </Text>
            )}
          </View>
        )}
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
        keyExtractor={(item) => `${item.Id}-${item.AccessKey}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

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
    padding: 16,
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
