"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateField = DateField;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _datetimepicker = _interopRequireDefault(require("@react-native-community/datetimepicker"));
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function DateField({
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
  const [show, setShow] = (0, _react.useState)(false);
  if (!isVisible) return null;
  const mode = config.type === 'date' ? 'date' : config.type === 'time' ? 'time' : 'datetime';
  const dateValue = value instanceof Date ? value : value ? new Date(String(value)) : new Date();
  const formatDisplay = d => {
    if (mode === 'time') return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    if (mode === 'date') return d.toLocaleDateString();
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };
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
    text: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: value ? theme.colors.text : theme.colors.placeholder
    },
    icon: {
      fontSize: 18,
      color: theme.colors.textSecondary
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
      if (!isDisabled) setShow(true);
    },
    activeOpacity: 0.7,
    accessibilityLabel: config.label
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.text
  }, value ? formatDisplay(dateValue) : config.placeholder ?? `Select ${mode}...`), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.icon
  }, mode === 'time' ? '🕐' : '📅')), show && /*#__PURE__*/_react.default.createElement(_datetimepicker.default, {
    value: dateValue,
    mode: mode,
    display: _reactNative.Platform.OS === 'ios' ? 'spinner' : 'default',
    onChange: (_, selectedDate) => {
      setShow(_reactNative.Platform.OS === 'ios');
      if (selectedDate) {
        onChange(selectedDate);
        onBlur();
      }
    },
    minimumDate: config.minDate,
    maximumDate: config.maxDate
  }));
}
//# sourceMappingURL=DateField.js.map