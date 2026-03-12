"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderField = SliderField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function SliderField({
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
  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const step = config.step ?? 1;
  const current = Number(value ?? min);

  // NOTE: Install @react-native-community/slider for production use.
  // This is a placeholder that renders as a numeric input fallback.
  const styles = _reactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    minLabel: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary
    },
    maxLabel: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary
    },
    track: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginHorizontal: 10,
      overflow: 'visible'
    },
    fill: {
      height: '100%',
      width: `${(current - min) / (max - min) * 100}%`,
      backgroundColor: theme.colors.primary,
      borderRadius: 2
    },
    valueText: {
      textAlign: 'center',
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 6
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.row
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.minLabel
  }, config.minLabel ?? String(min)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.track
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.fill
  })), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.maxLabel
  }, config.maxLabel ?? String(max))), config.showValue !== false ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.valueText
  }, current) : null);
}
//# sourceMappingURL=SliderField.js.map