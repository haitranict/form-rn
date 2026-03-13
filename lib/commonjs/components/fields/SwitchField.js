"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchField = SwitchField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function SwitchField({
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
  if (!isVisible) return null;
  const checked = Boolean(value);
  const styles = _reactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    label: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      flex: 1,
      marginRight: 12
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.row
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.label
  }, config.label), /*#__PURE__*/_react.default.createElement(_reactNative.Switch, {
    value: checked,
    onValueChange: v => {
      onChange(v);
      onBlur();
    },
    disabled: isDisabled,
    trackColor: {
      false: theme.colors.border,
      true: theme.colors.primaryLight
    },
    thumbColor: checked ? theme.colors.primary : theme.colors.textDisabled,
    accessibilityLabel: config.label
  })));
}
//# sourceMappingURL=SwitchField.js.map