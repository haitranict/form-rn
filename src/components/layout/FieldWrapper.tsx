import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface FieldWrapperProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
}

export function FieldWrapper({
  children,
  label,
  description,
  error,
  required,
  style,
}: FieldWrapperProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.fieldGap,
    },
    label: {
      fontSize: theme.typography.fontSizeLabel,
      fontWeight: theme.typography.fontWeightLabel,
      color: error ? theme.colors.danger : theme.colors.text,
      marginBottom: theme.spacing.labelGap,
    },
    requiredStar: {
      color: theme.colors.danger,
    },
    description: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.labelGap,
    },
    error: {
      fontSize: theme.typography.fontSizeError,
      color: theme.colors.danger,
      marginTop: theme.spacing.helperGap,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.requiredStar}> *</Text> : null}
        </Text>
      ) : null}
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
