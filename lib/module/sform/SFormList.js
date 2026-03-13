import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import moment from 'moment';
import { apiGetFormList } from './hooks/useSFormApi';

// ============================================================
// Props
// ============================================================

// ============================================================
// Main Component
// ============================================================

export function SFormList({
  shopId,
  apiConfig,
  onSelectForm,
  emptyMessage = 'Không có form khảo sát nào',
  style
}) {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);
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
      if (response.code === 200) {
        setForms(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách form');
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
    onSelectForm(item.AccessKey, shopId, item);
  };
  const renderFormItem = ({
    item
  }) => {
    const isExpired = item.ToDate ? item.ToDate < parseInt(moment().format('YYYYMMDD'), 10) : false;
    const isCompleted = false; // Mặc định chưa làm (theo yêu cầu)

    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [styles.formItem, isCompleted && styles.formItemCompleted, isExpired && styles.formItemExpired],
      onPress: () => handleSelectForm(item),
      activeOpacity: 0.7
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.formItemHeader
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.formName,
      numberOfLines: 2
    }, item.Title), isCompleted && /*#__PURE__*/React.createElement(View, {
      style: styles.completedBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.completedText
    }, "\u2713 \u0110\xE3 l\xE0m")), !isCompleted && isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.expiredBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.expiredText
    }, "H\u1EBFt h\u1EA1n")), !isCompleted && !isExpired && /*#__PURE__*/React.createElement(View, {
      style: styles.pendingBadge
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.pendingText
    }, "Ch\u01B0a l\xE0m"))), item.SubTitle && /*#__PURE__*/React.createElement(Text, {
      style: styles.description,
      numberOfLines: 2
    }, item.SubTitle), (item.FromDate || item.ToDate) && /*#__PURE__*/React.createElement(View, {
      style: styles.dateRow
    }, item.FromDate && /*#__PURE__*/React.createElement(Text, {
      style: styles.dateText
    }, "T\u1EEB: ", moment(item.FromDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY')), item.ToDate && /*#__PURE__*/React.createElement(Text, {
      style: [styles.dateText, isExpired && styles.dateExpired]
    }, "\u0110\u1EBFn: ", moment(item.ToDate.toString(), 'YYYYMMDD').format('DD/MM/YYYY'))));
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
    keyExtractor: item => `${item.Id}-${item.AccessKey}`,
    contentContainerStyle: styles.listContent,
    ItemSeparatorComponent: () => /*#__PURE__*/React.createElement(View, {
      style: styles.separator
    })
  }));
}

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
    padding: 16,
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