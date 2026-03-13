"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectField = SelectField;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function SelectField({
  config
}) {
  const theme = (0, _theme.useTheme)();
  const {
    value,
    error,
    onChange,
    onBlur,
    isVisible,
    isDisabled,
    isRequired
  } = (0, _useFormField.useFormField)(config);
  const [open, setOpen] = (0, _react.useState)(false);
  const [search, setSearch] = (0, _react.useState)('');
  if (!isVisible) return null;
  const selected = config.options.find(o => o.value === value);
  const filtered = config.searchable ? config.options.filter(o => o.label.toLowerCase().includes(search.toLowerCase())) : config.options;
  const styles = _reactNative.StyleSheet.create({
    trigger: {
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground
    },
    triggerText: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: selected ? theme.colors.text : theme.colors.placeholder
    },
    arrow: {
      fontSize: 12,
      color: theme.colors.textSecondary
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end'
    },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%'
    },
    searchInput: {
      margin: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: 12,
      height: 40,
      fontSize: theme.typography.fontSizeInput
    },
    option: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    optionText: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text
    },
    optionSelected: {
      color: theme.colors.primary,
      fontWeight: '600'
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.trigger,
    onPress: () => {
      if (!isDisabled) setOpen(true);
    },
    activeOpacity: 0.7,
    accessibilityLabel: config.label
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.triggerText
  }, selected?.label ?? config.placeholder ?? 'Select...'), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.arrow
  }, "\u25BC")), /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: open,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => setOpen(false)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.SafeAreaView, {
    style: styles.modal
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.sheet
  }, config.searchable ? /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: styles.searchInput,
    value: search,
    onChangeText: setSearch,
    placeholder: "Search...",
    placeholderTextColor: theme.colors.placeholder
  }) : null, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    data: filtered,
    keyExtractor: item => String(item.value),
    renderItem: ({
      item
    }) => /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      style: styles.option,
      onPress: () => {
        onChange(item.value);
        onBlur();
        setOpen(false);
        setSearch('');
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [styles.optionText, item.value === value && styles.optionSelected]
    }, item.label))
  })))));
}
//# sourceMappingURL=SelectField.js.map