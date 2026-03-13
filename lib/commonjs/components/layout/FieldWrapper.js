"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldWrapper = FieldWrapper;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../../theme");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FieldWrapper({
  children,
  label,
  description,
  error,
  required,
  style
}) {
  const theme = (0, _theme.useTheme)();
  const styles = _reactNative.StyleSheet.create({
    container: {
      marginBottom: theme.spacing.fieldGap
    },
    label: {
      fontSize: theme.typography.fontSizeLabel,
      fontWeight: theme.typography.fontWeightLabel,
      color: error ? theme.colors.danger : theme.colors.text,
      marginBottom: theme.spacing.labelGap
    },
    requiredStar: {
      color: theme.colors.danger
    },
    description: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.labelGap
    },
    error: {
      fontSize: theme.typography.fontSizeError,
      color: theme.colors.danger,
      marginTop: theme.spacing.helperGap
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, style]
  }, label ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.label
  }, label, required ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.requiredStar
  }, " *") : null) : null, description ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.description
  }, description) : null, children, error ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.error
  }, error) : null);
}
//# sourceMappingURL=FieldWrapper.js.map