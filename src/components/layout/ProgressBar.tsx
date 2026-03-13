import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  currentPage: number;   // 0-indexed
  totalPages: number;
  showLabel?: boolean;
}

export function ProgressBar({ currentPage, totalPages, showLabel = true }: ProgressBarProps) {
  const theme = useTheme();
  const progress = totalPages > 1 ? (currentPage + 1) / totalPages : 1;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    track: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      width: `${progress * 100}%`,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    label: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary,
      textAlign: 'right',
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
      {showLabel && totalPages > 1 ? (
        <Text style={styles.label}>
          Step {currentPage + 1} of {totalPages}
        </Text>
      ) : null}
    </View>
  );
}
