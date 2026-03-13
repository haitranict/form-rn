"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextAreaField = TextAreaField;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function TextAreaField({
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
  const styles = _reactNative.StyleSheet.create({
    input: {
      borderWidth: isFocused ? theme.shape.borderWidthFocused : theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : isFocused ? theme.colors.borderFocused : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: theme.spacing.fieldPaddingH,
      paddingVertical: theme.spacing.fieldPaddingV,
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
      minHeight: (config.numberOfLines ?? 4) * 24,
      textAlignVertical: 'top'
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: [styles.input, config.style],
    value: String(value ?? ''),
    onChangeText: onChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => {
      setIsFocused(false);
      onBlur();
    },
    placeholder: config.placeholder,
    placeholderTextColor: theme.colors.placeholder,
    multiline: true,
    numberOfLines: config.numberOfLines ?? 4,
    maxLength: config.maxLength,
    editable: !isDisabled,
    accessibilityLabel: config.label
  }));
}
//# sourceMappingURL=TextAreaField.js.map