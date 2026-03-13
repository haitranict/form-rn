import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
export function FieldWrapper({
  children,
  label,
  description,
  error,
  required,
  style
}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
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
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, style]
  }, label ? /*#__PURE__*/React.createElement(Text, {
    style: styles.label
  }, label, required ? /*#__PURE__*/React.createElement(Text, {
    style: styles.requiredStar
  }, " *") : null) : null, description ? /*#__PURE__*/React.createElement(Text, {
    style: styles.description
  }, description) : null, children, error ? /*#__PURE__*/React.createElement(Text, {
    style: styles.error
  }, error) : null);
}
//# sourceMappingURL=FieldWrapper.js.map