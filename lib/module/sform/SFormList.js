import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';
import moment from 'moment';
import { apiGetFormList } from './hooks/useSFormApi';

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
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, refreshTrigger]);
  const loadForms = async () => {
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
        setForms(response.data || []);
        console.log('SFormList - Loaded forms count:', response.data?.length || 0);
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
    const isCompleted = (item.done ?? 0) > 0; // Đã làm nếu done > 0

    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [styles.formItem, isCompleted && styles.formItemCompleted, isExpired && styles.formItemExpired],
      onPress: () => handleSelectForm(item),
      activeOpacity: 0.7
    }, (() => {
      console.log('[SFormList] item.banner:', item.banner);
      if (!item.banner) return null;
      try {
        const config = JSON.parse(item.banner);
        console.log('[SFormList] parsed config:', config);
        const imageUrl = config?.imageURL;
        console.log('[SFormList] extracted imageURL:', imageUrl);
        if (!imageUrl) return null;
        return /*#__PURE__*/React.createElement(Image, {
          source: {
            uri: imageUrl
          },
          style: styles.bannerImage,
          resizeMode: "cover"
        });
      } catch (e) {
        console.error('[SFormList] JSON parse error:', e);
        return null;
      }
    })(), /*#__PURE__*/React.createElement(View, {
      style: styles.formItemContent
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.formItemHeader
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.formName,
      numberOfLines: 2
    }, item.title), isCompleted && /*#__PURE__*/React.createElement(View, {
      style: styles.completedBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.completedText
    }, "\u2713 \u0110\xE3 l\xE0m ", item.done && item.done > 1 ? `(${item.done})` : '')), !isCompleted && isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.expiredBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.expiredText
    }, "H\u1EBFt h\u1EA1n")), !isCompleted && !isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.pendingBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.pendingText
    }, "Ch\u01B0a l\xE0m"))), item.subTitle && /*#__PURE__*/React.createElement(Text, {
      style: styles.description,
      numberOfLines: 3
    }, item.subTitle), (item.fromDate || item.toDate) && /*#__PURE__*/React.createElement(View, {
      style: styles.dateRow
    }, item.fromDate && /*#__PURE__*/React.createElement(Text, {
      style: styles.dateText
    }, "T\u1EEB: ", moment(item.fromDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')), item.toDate && /*#__PURE__*/React.createElement(Text, {
      style: [styles.dateText, isExpired && styles.dateExpired]
    }, "\u0110\u1EBFn: ", moment(item.toDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')))));
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
  bannerImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8EAED'
  },
  formItemContent: {
    padding: 16
  },
  formItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  formName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#202124',
    marginRight: 8
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