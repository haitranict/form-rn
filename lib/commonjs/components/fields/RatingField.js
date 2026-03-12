"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RatingField = RatingField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function RatingField({
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
  const maxRating = config.maxRating ?? 5;
  const current = Number(value ?? 0);
  const iconMap = {
    star: '★',
    heart: '♥',
    thumb: '👍'
  };
  const icon = iconMap[config.icon ?? 'star'];
  const styles = _reactNative.StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 6
    },
    star: {
      fontSize: theme.sizes.starSize,
      opacity: isDisabled ? 0.5 : 1
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.row
  }, Array.from({
    length: maxRating
  }, (_, i) => i + 1).map(star => /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    key: star,
    onPress: () => {
      if (!isDisabled) {
        onChange(star);
        onBlur();
      }
    },
    activeOpacity: 0.7,
    accessibilityRole: "button",
    accessibilityLabel: `Rate ${star} of ${maxRating}`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.star, {
      color: star <= current ? theme.colors.warning : theme.colors.border
    }]
  }, icon)))));
}
//# sourceMappingURL=RatingField.js.map