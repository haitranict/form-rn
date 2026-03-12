"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxField = CheckboxField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function CheckboxField({
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
      opacity: isDisabled ? 0.5 : 1
    },
    box: {
      width: theme.sizes.checkboxSize,
      height: theme.sizes.checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: checked ? theme.colors.primary : theme.colors.border,
      backgroundColor: checked ? theme.colors.primary : theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    checkmark: {
      color: theme.colors.checkmark,
      fontSize: 12,
      fontWeight: '700'
    },
    label: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      flex: 1
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.row,
    onPress: () => {
      if (!isDisabled) {
        onChange(!checked);
        onBlur();
      }
    },
    activeOpacity: 0.7,
    accessibilityRole: "checkbox",
    accessibilityState: {
      checked
    },
    accessibilityLabel: config.label
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.box
  }, checked ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.checkmark
  }, "\u2713") : null), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.label
  }, config.checkboxLabel ?? config.label)));
}
//# sourceMappingURL=CheckboxField.js.map