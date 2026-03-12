import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
export function SectionHeader({
  config
}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sectionGap,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: theme.shape.borderRadius,
      marginBottom: 12
    },
    title: {
      fontSize: theme.typography.fontSizeSectionTitle,
      fontWeight: theme.typography.fontWeightSectionTitle,
      color: theme.colors.text
    },
    subtitle: {
      fontSize: theme.typography.fontSizeHelper + 2,
      color: theme.colors.textSecondary,
      marginTop: 6
    }
  });
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, config.imageUrl ? /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: config.imageUrl
    },
    style: styles.image,
    resizeMode: "cover"
  }) : null, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, config.title), config.subtitle ? /*#__PURE__*/React.createElement(Text, {
    style: styles.subtitle
  }, config.subtitle) : null);
}
//# sourceMappingURL=SectionHeader.js.map