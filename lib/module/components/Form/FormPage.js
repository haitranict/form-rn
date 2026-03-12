import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FieldRenderer } from './FieldRenderer';
import { useTheme } from '../../theme';
export function FormPage({
  page,
  fields: directFields
}) {
  const theme = useTheme();
  const fields = page?.fields ?? directFields ?? [];
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingVertical: theme.spacing.pagePaddingV
    }
  });
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, fields.map(field => /*#__PURE__*/React.createElement(FieldRenderer, {
    key: field.id,
    field: field
  })));
}
//# sourceMappingURL=FormPage.js.map