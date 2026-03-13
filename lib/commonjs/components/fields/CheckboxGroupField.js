"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxGroupField = CheckboxGroupField;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function CheckboxGroupField({
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
  const selectedValues = Array.isArray(value) ? value : [];
  const toggle = optionValue => {
    if (isDisabled) return;
    const exists = selectedValues.includes(optionValue);
    let next;
    if (exists) {
      next = selectedValues.filter(v => v !== optionValue);
    } else {
      if (config.maxSelections && selectedValues.length >= config.maxSelections) return;
      next = [...selectedValues, optionValue];
    }
    onChange(next);
    onBlur();
  };
  const styles = _reactNative.StyleSheet.create({
    container: {
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
    box: {
      width: theme.sizes.checkboxSize,
      height: theme.sizes.checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
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
      color: theme.colors.text
    }
  });
  return /*#__PURE__*/_react.default.createElement(_FieldWrapper.FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, config.options.map(option => {
    const checked = selectedValues.includes(option.value);
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      key: String(option.value),
      style: styles.option,
      onPress: () => toggle(option.value),
      activeOpacity: 0.7,
      accessibilityRole: "checkbox",
      accessibilityState: {
        checked
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.box, {
        borderColor: checked ? theme.colors.primary : theme.colors.border,
        backgroundColor: checked ? theme.colors.primary : theme.colors.inputBackground
      }]
    }, checked ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.checkmark
    }, "\u2713") : null), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.label
    }, option.label));
  })));
}
//# sourceMappingURL=CheckboxGroupField.js.map