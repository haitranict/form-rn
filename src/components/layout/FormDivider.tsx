import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { DividerConfig } from '../../types/field.types';

interface FormDividerProps {
  config?: DividerConfig;
}

export function FormDivider({ config }: FormDividerProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    divider: {
      height: config?.thickness ?? 1,
      backgroundColor: config?.color ?? theme.colors.border,
      marginVertical: theme.spacing.fieldGap,
    },
  });

  return <View style={styles.divider} />;
}
