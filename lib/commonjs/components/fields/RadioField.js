"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioField = RadioField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function RadioField({
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
  const styles = _reactNative.StyleSheet.create({
    optionsRow: {
      flexDirection: config.layout === 'horizontal' ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: 10
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      marginRight: config.layout === 'horizontal' ? 12 : 0,
      opacity: isDisabled ? 0.5 : 1
    },
    outer: {
      width: theme.sizes.radioSize,
      height: theme.sizes.radioSize,
      borderRadius: theme.sizes.radioSize / 2,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    outerSelected: {
      borderColor: theme.colors.primary
    },
    inner: {
      width: theme.sizes.radioSize / 2,
      height: theme.sizes.radioSize / 2,
      borderRadius: theme.sizes.radioSize / 4,
      backgroundColor: theme.colors.primary
    },
    label: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.optionsRow
  }, config.options.map(option => {
    const selected = value === option.value;
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      key: String(option.value),
      style: styles.option,
      onPress: () => {
        if (!isDisabled && !option.disabled) {
          onChange(option.value);
          onBlur();
        }
      },
      activeOpacity: 0.7,
      accessibilityRole: "radio",
      accessibilityState: {
        checked: selected
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.outer, selected && styles.outerSelected]
    }, selected ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.inner
    }) : null), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.label
    }, option.label));
  })));
}
//# sourceMappingURL=RadioField.js.map