"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberField = NumberField;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function NumberField({
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
  const [isFocused, setIsFocused] = (0, _react.useState)(false);
  if (!isVisible) return null;

  // Validate min/max
  const handleChange = text => {
    const num = parseFloat(text);
    if (isNaN(num)) {
      onChange('');
      return;
    }

    // Check min/max constraints
    if (config.min !== undefined && num < config.min) {
      onChange(config.min);
      return;
    }
    if (config.max !== undefined && num > config.max) {
      onChange(config.max);
      return;
    }
    onChange(num);
  };
  const styles = _reactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: isFocused ? theme.shape.borderWidthFocused : theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : isFocused ? theme.colors.borderFocused : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      height: theme.sizes.inputHeight,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
      overflow: 'hidden'
    },
    affix: {
      paddingHorizontal: 10,
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.textSecondary
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.fieldPaddingH
    }
  });

  // Helper text for min/max
  const helperText = [];
  if (config.min !== undefined) helperText.push(`Min: ${config.min}`);
  if (config.max !== undefined) helperText.push(`Max: ${config.max}`);
  const helper = helperText.length > 0 ? helperText.join(' | ') : undefined;
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: helper || config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.row, config.style]
  }, config.prefix ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.affix
  }, config.prefix) : null, /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: styles.input,
    value: value !== '' && value !== undefined && value !== null ? String(value) : '',
    onChangeText: handleChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      setIsFocused(false);
      onBlur();
    },
    placeholder: config.placeholder,
    placeholderTextColor: theme.colors.placeholder,
    keyboardType: "numeric",
    editable: !isDisabled,
    accessibilityLabel: config.label
  }), config.suffix ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.affix
  }, config.suffix) : null));
}
//# sourceMappingURL=NumberField.js.map