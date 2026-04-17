import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
function SearchModal({
  visible,
  data,
  labelKey,
  onSelect,
  onClose,
  title
}) {
  const [search, setSearch] = useState('');
  const filtered = search ? data.filter(d => d[labelKey]?.toLowerCase().includes(search.toLowerCase())) : data;
  return /*#__PURE__*/React.createElement(Modal, {
    visible: visible,
    transparent: true,
    animationType: "slide",
    onRequestClose: onClose
  }, /*#__PURE__*/React.createElement(KeyboardAvoidingView, {
    behavior: "padding",
    style: styles.overlay,
    keyboardVerticalOffset: Platform.OS === 'ios' ? 10 : 0
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.sheet
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.sheetTitle
  }, title), /*#__PURE__*/React.createElement(TextInput, {
    style: styles.search,
    value: search,
    onChangeText: setSearch,
    placeholder: "T\xECm ki\u1EBFm...",
    placeholderTextColor: "#9AA0A6"
  }), /*#__PURE__*/React.createElement(FlatList, {
    data: filtered,
    keyExtractor: (_, i) => String(i),
    ListFooterComponent: /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      style: {
        textAlign: 'center',
        color: '#9AA0A6',
        padding: 10
      }
    }, "\u0110\xE3 xem h\u1EBFt")),
    ListEmptyComponent: /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      style: {
        textAlign: 'center',
        color: '#9AA0A6',
        padding: 12
      }
    }, "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3")),
    ListHeaderComponent: /*#__PURE__*/React.createElement(View, null),
    renderItem: ({
      item
    }) => /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.option,
      onPress: () => {
        onSelect(item);
        onClose();
        setSearch('');
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.optionText
    }, item[labelKey]))
  }))));
}
export function AnswerAddress({
  question,
  provinces,
  districts,
  towns,
  onChange,
  dvhc2025
}) {
  const [showProvince, setShowProvince] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showTown, setShowTown] = useState(false);
  const useDVHC2025 = !!dvhc2025;

  // Get selected province to filter wards
  const selectedProvinceItem = question.anwserItem.find(a => a.id === 2);
  const selectedProvinceName = selectedProvinceItem?.anwserValue || '';

  // Get wards for selected province (DVHC 2025 mode)
  const wards2025 = useMemo(() => {
    if (!useDVHC2025 || !selectedProvinceName || !dvhc2025) return [];
    const province = dvhc2025.find(p => p.name === selectedProvinceName);
    return province?.level2s || [];
  }, [useDVHC2025, selectedProvinceName, dvhc2025]);
  const getItem = id => question.anwserItem.find(a => a.id === id);
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, question.anwserItem.map(item => {
    if (item.id === 1) {
      // Street text
      return /*#__PURE__*/React.createElement(View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/React.createElement(TextInput, {
        style: styles.input,
        value: item.anwserValue,
        onChangeText: text => onChange(question, text, item),
        placeholder: item.anwserName,
        placeholderTextColor: "#9AA0A6"
      }));
    }
    if (item.id === 2) {
      return /*#__PURE__*/React.createElement(View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: styles.picker,
        onPress: () => setShowProvince(true)
      }, /*#__PURE__*/React.createElement(Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn tỉnh/thành'), /*#__PURE__*/React.createElement(Text, null, "\u25BC")), /*#__PURE__*/React.createElement(SearchModal, {
        visible: showProvince,
        data: useDVHC2025 ? dvhc2025 || [] : provinces,
        labelKey: "name",
        title: "Ch\u1ECDn T\u1EC9nh/Th\xE0nh",
        onSelect: p => onChange(question, p, item),
        onClose: () => setShowProvince(false)
      }));
    }
    if (item.id === 3) {
      // Skip district field in DVHC 2025 mode
      if (useDVHC2025) return null;
      return /*#__PURE__*/React.createElement(View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: [styles.picker, districts.length === 0 && styles.disabled],
        onPress: () => districts.length > 0 && setShowDistrict(true)
      }, /*#__PURE__*/React.createElement(Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn quận/huyện'), /*#__PURE__*/React.createElement(Text, null, "\u25BC")), /*#__PURE__*/React.createElement(SearchModal, {
        visible: showDistrict,
        data: districts,
        labelKey: "name",
        title: "Ch\u1ECDn Qu\u1EADn/Huy\u1EC7n",
        onSelect: d => onChange(question, d, item),
        onClose: () => setShowDistrict(false)
      }));
    }
    if (item.id === 4) {
      const wardData = useDVHC2025 ? wards2025 : towns;
      const isDisabled = wardData.length === 0;
      return /*#__PURE__*/React.createElement(View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: [styles.picker, isDisabled && styles.disabled],
        onPress: () => !isDisabled && setShowTown(true)
      }, /*#__PURE__*/React.createElement(Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn phường/xã'), /*#__PURE__*/React.createElement(Text, null, "\u25BC")), /*#__PURE__*/React.createElement(SearchModal, {
        visible: showTown,
        data: wardData,
        labelKey: "name",
        title: "Ch\u1ECDn Ph\u01B0\u1EDDng/X\xE3",
        onSelect: t => onChange(question, t, item),
        onClose: () => setShowTown(false)
      }));
    }
    return null;
  }));
}
const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  field: {
    marginBottom: 4
  },
  fieldLabel: {
    fontSize: 13,
    color: '#5F6368',
    marginBottom: 4,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#202124'
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12
  },
  disabled: {
    backgroundColor: '#F8F9FA',
    opacity: 0.6
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#202124'
  },
  placeholder: {
    color: '#9AA0A6'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%'
  },
  sheetTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    padding: 16
  },
  search: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0'
  },
  optionText: {
    fontSize: 16,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerAddress.js.map