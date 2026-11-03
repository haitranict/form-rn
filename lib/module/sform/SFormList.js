import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';
import moment from 'moment';
import { apiGetFormList } from './hooks/useSFormApi';
import { getBannerImageUrl, setDefaultBaseUrl } from './utils/bannerUtils';
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

// ============================================================
// Main Component
// ============================================================

export const SFormList = /*#__PURE__*/forwardRef(({
  shopId,
  apiConfig,
  onSelectForm,
  emptyMessage = 'Không có form khảo sát nào',
  style,
  refreshTrigger
}, ref) => {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (apiConfig?.baseUrl) {
      setDefaultBaseUrl(apiConfig.baseUrl);
    }
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, refreshTrigger, apiConfig?.baseUrl]);
  const loadForms = async () => {
    if (apiConfig?.baseUrl) {
      setDefaultBaseUrl(apiConfig.baseUrl);
    }
    setLoading(true);
    setError(null);
    try {
      console.log('SFormList - Loading forms...', {
        shopId,
        baseUrl: apiConfig.baseUrl
      });
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
    } catch (err) {
      console.error('SFormList - Error:', err);
      const errorMessage = err?.message || 'Lỗi kết nối. Vui lòng thử lại.';
      setError(errorMessage);

      // Show alert with details for debugging
      Alert.alert('Lỗi', `${errorMessage}\n\nDebug:\n- shopId: ${shopId}\n- baseUrl: ${apiConfig.baseUrl}\n- token: ${apiConfig.token ? 'có' : 'không'}`, [{
        text: 'Thử lại',
        onPress: handleRetry
      }, {
        text: 'OK'
      }]);
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
    loadForms();
  };
  const handleSelectForm = item => {
    setCachedFormItem(item);
    onSelectForm(item.accessKey, shopId, item);
  };

  // Update done count for a specific form (after submit success)
  const updateFormDoneCount = formKey => {
    setForms(prevForms => prevForms.map(form => form.accessKey === formKey ? {
      ...form,
      done: (form.done || 0) + 1
    } : form));
    console.log(`[SFormList] Updated done count for formKey: ${formKey}`);
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    refresh: loadForms,
    updateFormDoneCount
  }));
  const renderFormItem = ({
    item
  }) => {
    const isExpired = item.toDate ? item.toDate < parseInt(moment().format('YYYYMMDD'), 10) : false;
    const doneCount = Number(item.done ?? item.Done ?? 0);
    const isCompleted = doneCount > 0;
    const rawLocked = item.locked ?? item.Locked ?? item.isLocked ?? item.IsLocked ?? item.lock ?? item.Lock ?? 0;
    let isItemLocked = false;
    if (typeof rawLocked === 'boolean') {
      isItemLocked = rawLocked;
    } else if (typeof rawLocked === 'number') {
      isItemLocked = rawLocked > 0;
    } else if (typeof rawLocked === 'string') {
      const lower = rawLocked.trim().toLowerCase();
      isItemLocked = lower === 'true' || lower === 'yes' || lower === 'locked' || Number(lower) > 0;
    }
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [styles.formItem, isCompleted && styles.formItemCompleted, isExpired && styles.formItemExpired, isItemLocked && styles.formItemLocked],
      onPress: () => handleSelectForm(item),
      activeOpacity: 0.7
    }, (() => {
      const imageUrl = getBannerImageUrl(item.banner, apiConfig?.baseUrl);
      if (!imageUrl) return null;
      return /*#__PURE__*/React.createElement(Image, {
        source: {
          uri: imageUrl
        },
        style: styles.bannerImage,
        resizeMode: "cover"
      });
    })(), /*#__PURE__*/React.createElement(View, {
      style: styles.formItemContent
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.formName
    }, item.title), item.subTitle && /*#__PURE__*/React.createElement(Text, {
      style: styles.description
    }, item.subTitle), (item.fromDate || item.toDate) && /*#__PURE__*/React.createElement(View, {
      style: styles.dateRow
    }, item.fromDate && /*#__PURE__*/React.createElement(Text, {
      style: styles.dateText
    }, "T\u1EEB: ", moment(item.fromDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')), item.toDate && /*#__PURE__*/React.createElement(Text, {
      style: [styles.dateText, isExpired && styles.dateExpired]
    }, "\u0110\u1EBFn: ", moment(item.toDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY'))), /*#__PURE__*/React.createElement(View, {
      style: styles.bottomStatusRow
    }, isItemLocked && /*#__PURE__*/React.createElement(View, {
      style: styles.lockedBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.lockedText
    }, "\uD83D\uDD12 \u0110\xE3 kho\xE1")), isCompleted && /*#__PURE__*/React.createElement(View, {
      style: styles.completedBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.completedText
    }, "\u2713 \u0110\xE3 l\xE0m (", doneCount, ")")), !isCompleted && isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.expiredBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.expiredText
    }, "H\u1EBFt h\u1EA1n")), !isCompleted && !isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.pendingBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.pendingText
    }, "Ch\u01B0a l\xE0m")))));
  };

  // ============================================================
  // Render States
  // ============================================================

  if (loading) {
    return /*#__PURE__*/React.createElement(View, {
      style: [styles.container, styles.center, style]
    }, /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: "large",
      color: "#4285F4"
    }), /*#__PURE__*/React.createElement(Text, {
      style: styles.loadingText
    }, "\u0110ang t\u1EA3i danh s\xE1ch..."));
  }
  if (error) {
    return /*#__PURE__*/React.createElement(View, {
      style: [styles.container, styles.center, style]
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.errorText
    }, "\u26A0\uFE0F ", error), /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.retryButton,
      onPress: handleRetry
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.retryButtonText
    }, "Th\u1EED l\u1EA1i")));
  }
  if (forms.length === 0) {
    return /*#__PURE__*/React.createElement(View, {
      style: [styles.container, styles.center, style]
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.emptyText
    }, "\uD83D\uDCCB ", emptyMessage));
  }
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, style]
  }, /*#__PURE__*/React.createElement(FlatList, {
    data: forms,
    renderItem: renderFormItem,
    keyExtractor: item => `${item.id}-${item.accessKey}`,
    contentContainerStyle: styles.listContent,
    ItemSeparatorComponent: () => /*#__PURE__*/React.createElement(View, {
      style: styles.separator
    })
  }));
});

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5F6368',
    fontWeight: '500'
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  listContent: {
    padding: 16
  },
  separator: {
    height: 12
  },
  formItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4'
  },
  formItemCompleted: {
    borderLeftColor: '#34A853',
    opacity: 0.85
  },
  formItemExpired: {
    borderLeftColor: '#EA4335',
    opacity: 0.7
  },
  formItemLocked: {
    borderLeftColor: '#D32F2F'
  },
  lockedTagContainer: {
    marginBottom: 8,
    flexDirection: 'row'
  },
  lockedTag: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    alignSelf: 'flex-start'
  },
  lockedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 0.5
  },
  bannerImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8EAED'
  },
  formItemContent: {
    padding: 16
  },
  formName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202124',
    lineHeight: 24,
    marginBottom: 8
  },
  bottomStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4'
  },
  lockedBadge: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5C2C7'
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D32F2F'
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34A853'
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F9AB00'
  },
  expiredBadge: {
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  expiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA4335'
  },
  description: {
    fontSize: 14,
    color: '#5F6368',
    lineHeight: 20,
    marginBottom: 8
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4
  },
  dateText: {
    fontSize: 13,
    color: '#5F6368'
  },
  dateExpired: {
    color: '#EA4335',
    fontWeight: '600'
  }
});
//# sourceMappingURL=SFormList.js.map