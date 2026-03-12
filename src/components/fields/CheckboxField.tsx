import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { CheckboxFieldConfig } from '../../types/field.types';

interface CheckboxFieldProps {
  config: CheckboxFieldConfig;
}

export function CheckboxField({ config }: CheckboxFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);

  if (!isVisible) return null;

  const checked = Boolean(value);

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: isDisabled ? 0.5 : 1,
    },
    box: {
      width: theme.sizes.checkboxSize,
      height: theme.sizes.checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: checked ? theme.colors.primary : theme.colors.border,
      backgroundColor: checked ? theme.colors.primary : theme.colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    checkmark: {
      color: theme.colors.checkmark,
      fontSize: 12,
      fontWeight: '700',
    },
    label: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      flex: 1,
    },
  });

  return (
    <FieldWrapper description={config.description} error={error?.message} required={isRequired}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => { if (!isDisabled) { onChange(!checked); onBlur(); } }}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={config.label}
      >
        <View style={styles.box}>
          {checked ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.label}>{config.checkboxLabel ?? config.label}</Text>
      </TouchableOpacity>
    </FieldWrapper>
  );
}
