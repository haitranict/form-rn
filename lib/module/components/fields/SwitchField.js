import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
export function SwitchField({
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
  const checked = Boolean(value);
  const styles = StyleSheet.create({
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
  return /*#__PURE__*/React.createElement(FieldWrapper, {
    description: config.description,
    error: error?.message,
    required: isRequired
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.row
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.label
  }, config.label), /*#__PURE__*/React.createElement(Switch, {
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