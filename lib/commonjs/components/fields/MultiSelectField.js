"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelectField = MultiSelectField;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _FieldWrapper = require("../layout/FieldWrapper");
var _theme = require("../../theme");
var _useFormField = require("../../hooks/useFormField");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function MultiSelectField({
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
  const [open, setOpen] = (0, _react.useState)(false);
  if (!isVisible) return null;
  const selected = Array.isArray(value) ? value : [];
  const toggle = optVal => {
    const exists = selected.includes(optVal);
    let next;
    if (exists) {
      next = selected.filter(v => v !== optVal);
    } else {
      if (config.maxSelections && selected.length >= config.maxSelections) return;
      next = [...selected, optVal];
    }
    onChange(next);
  };
  const displayText = config.options.filter(o => selected.includes(o.value)).map(o => o.label).join(', ');
  const styles = _reactNative.StyleSheet.create({
    trigger: {
      minHeight: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      paddingVertical: 8,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground
    },
    triggerText: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: displayText ? theme.colors.text : theme.colors.placeholder
    },
    arrow: {
      fontSize: 12,
      color: theme.colors.textSecondary
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end'
    },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '60%'
    },
    doneButton: {
      padding: 16,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border
    },
    doneText: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 16
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    box: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
    },
    checkmark: {
      color: theme.colors.white,
      fontSize: 12,
      fontWeight: '700'
    },
    optionText: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text
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
      if (!isDisabled) setOpen(true);
    },
    activeOpacity: 0.7,
    accessibilityLabel: config.label
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.triggerText
  }, displayText || (config.placeholder ?? 'Select options...')), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.arrow
  }, "\u25BC")), /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: open,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => {
      onBlur();
      setOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.SafeAreaView, {
    style: styles.modal
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.sheet
  }, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    data: config.options,
    keyExtractor: item => String(item.value),
    renderItem: ({
      item
    }) => {
      const checked = selected.includes(item.value);
      return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        style: styles.option,
        onPress: () => toggle(item.value)
      }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: [styles.box, {
          borderColor: checked ? theme.colors.primary : theme.colors.border,
          backgroundColor: checked ? theme.colors.primary : 'transparent'
        }]
      }, checked ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.checkmark
      }, "\u2713") : null), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.optionText
      }, item.label));
    }
  }), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.doneButton,
    onPress: () => {
      onBlur();
      setOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.doneText
  }, "Done"))))));
}
//# sourceMappingURL=MultiSelectField.js.map