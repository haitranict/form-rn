import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
export function CheckboxGroupField({
  config
}) {
  const theme = useTheme();
  const {
    value,
    error,
    onChange,
    onBlur,
    isVisible,
    isDisabled,
    isRequired
  } = useFormField(config);
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
  const styles = StyleSheet.create({
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
  return /*#__PURE__*/React.createElement(FieldWrapper, {
    label: config.label,
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, config.options.map(option => {
    const checked = selectedValues.includes(option.value);
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      key: String(option.value),
      style: styles.option,
      onPress: () => toggle(option.value),
      activeOpacity: 0.7,
      accessibilityRole: "checkbox",
      accessibilityState: {
        checked
      }
    }, /*#__PURE__*/React.createElement(View, {
      style: [styles.box, {
        borderColor: checked ? theme.colors.primary : theme.colors.border,
        backgroundColor: checked ? theme.colors.primary : theme.colors.inputBackground
      }]
    }, checked ? /*#__PURE__*/React.createElement(Text, {
      style: styles.checkmark
    }, "\u2713") : null), /*#__PURE__*/React.createElement(Text, {
      style: styles.label
    }, option.label));
  })));
}
//# sourceMappingURL=CheckboxGroupField.js.map