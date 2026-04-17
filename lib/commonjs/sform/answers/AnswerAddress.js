"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerAddress = AnswerAddress;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function SearchModal({
  visible,
  data,
  labelKey,
  onSelect,
  onClose,
  title
}) {
  const [search, setSearch] = (0, _react.useState)('');
  const filtered = search ? data.filter(d => d[labelKey]?.toLowerCase().includes(search.toLowerCase())) : data;
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: visible,
    transparent: true,
    animationType: "slide",
    onRequestClose: onClose
  }, /*#__PURE__*/_react.default.createElement(_reactNative.KeyboardAvoidingView, {
    behavior: "padding",
    style: styles.overlay,
    keyboardVerticalOffset: _reactNative.Platform.OS === 'ios' ? 10 : 0
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.sheet
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.sheetTitle
  }, title), /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: styles.search,
    value: search,
    onChangeText: setSearch,
    placeholder: "T\xECm ki\u1EBFm...",
    placeholderTextColor: "#9AA0A6"
  }), /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    data: filtered,
    keyExtractor: (_, i) => String(i),
    ListFooterComponent: /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: {
        textAlign: 'center',
        color: '#9AA0A6',
        padding: 10
      }
    }, "\u0110\xE3 xem h\u1EBFt")),
    ListEmptyComponent: /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: {
        textAlign: 'center',
        color: '#9AA0A6',
        padding: 12
      }
    }, "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3")),
    ListHeaderComponent: /*#__PURE__*/_react.default.createElement(_reactNative.View, null),
    renderItem: ({
      item
    }) => /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      style: styles.option,
      onPress: () => {
        onSelect(item);
        onClose();
        setSearch('');
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.optionText
    }, item[labelKey]))
  }))));
}
function AnswerAddress({
  question,
  provinces,
  districts,
  towns,
  onChange,
  dvhc2025
}) {
  const [showProvince, setShowProvince] = (0, _react.useState)(false);
  const [showDistrict, setShowDistrict] = (0, _react.useState)(false);
  const [showTown, setShowTown] = (0, _react.useState)(false);
  const useDVHC2025 = !!dvhc2025;

  // Get selected province to filter wards
  const selectedProvinceItem = question.anwserItem.find(a => a.id === 2);
  const selectedProvinceName = selectedProvinceItem?.anwserValue || '';

  // Get wards for selected province (DVHC 2025 mode)
  const wards2025 = (0, _react.useMemo)(() => {
    if (!useDVHC2025 || !selectedProvinceName || !dvhc2025) return [];
    const province = dvhc2025.find(p => p.name === selectedProvinceName);
    return province?.level2s || [];
  }, [useDVHC2025, selectedProvinceName, dvhc2025]);
  const getItem = id => question.anwserItem.find(a => a.id === id);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, question.anwserItem.map(item => {
    if (item.id === 1) {
      // Street text
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
        style: styles.input,
        value: item.anwserValue,
        onChangeText: text => onChange(question, text, item),
        placeholder: item.anwserName,
        placeholderTextColor: "#9AA0A6"
      }));
    }
    if (item.id === 2) {
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        style: styles.picker,
        onPress: () => setShowProvince(true)
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn tỉnh/thành'), /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "\u25BC")), /*#__PURE__*/_react.default.createElement(SearchModal, {
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
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        style: [styles.picker, districts.length === 0 && styles.disabled],
        onPress: () => districts.length > 0 && setShowDistrict(true)
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn quận/huyện'), /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "\u25BC")), /*#__PURE__*/_react.default.createElement(SearchModal, {
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
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        key: item.id,
        style: styles.field
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.fieldLabel
      }, item.anwserName), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        style: [styles.picker, isDisabled && styles.disabled],
        onPress: () => !isDisabled && setShowTown(true)
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: [styles.pickerText, !item.anwserValue && styles.placeholder]
      }, item.anwserValue || 'Chọn phường/xã'), /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "\u25BC")), /*#__PURE__*/_react.default.createElement(SearchModal, {
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
const styles = _reactNative.StyleSheet.create({
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