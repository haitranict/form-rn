import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { SectionHeaderConfig } from '../../types/field.types';

interface SectionHeaderProps {
  config: SectionHeaderConfig;
}

export function SectionHeader({ config }: SectionHeaderProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sectionGap,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: theme.shape.borderRadius,
      marginBottom: 12,
    },
    title: {
      fontSize: theme.typography.fontSizeSectionTitle,
      fontWeight: theme.typography.fontWeightSectionTitle,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.fontSizeHelper + 2,
      color: theme.colors.textSecondary,
      marginTop: 6,
    },
  });

  return (
    <View style={styles.container}>
      {config.imageUrl ? (
        <Image source={{ uri: config.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : null}
      <Text style={styles.title}>{config.title}</Text>
      {config.subtitle ? <Text style={styles.subtitle}>{config.subtitle}</Text> : null}
    </View>
  );
}
