import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
export function FormDivider({
  config
}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    divider: {
      height: config?.thickness ?? 1,
      backgroundColor: config?.color ?? theme.colors.border,
      marginVertical: theme.spacing.fieldGap
    }
  });
  return /*#__PURE__*/React.createElement(View, {
    style: styles.divider
  });
}
//# sourceMappingURL=FormDivider.js.map