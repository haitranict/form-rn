import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { RadioFieldConfig } from '../../types/field.types';

interface RadioFieldProps {
  config: RadioFieldConfig;
}

export function RadioField({ config }: RadioFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    optionsRow: {
      flexDirection: config.layout === 'horizontal' ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: 10,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      marginRight: config.layout === 'horizontal' ? 12 : 0,
      opacity: isDisabled ? 0.5 : 1,
    },
    outer: {
      width: theme.sizes.radioSize,
      height: theme.sizes.radioSize,
      borderRadius: theme.sizes.radioSize / 2,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    outerSelected: { borderColor: theme.colors.primary },
    inner: {
      width: theme.sizes.radioSize / 2,
      height: theme.sizes.radioSize / 2,
      borderRadius: theme.sizes.radioSize / 4,
      backgroundColor: theme.colors.primary,
    },
    label: {
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
    },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <View style={styles.optionsRow}>
        {config.options.map((option) => {
          const selected = value === option.value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={styles.option}
              onPress={() => { if (!isDisabled && !option.disabled) { onChange(option.value); onBlur(); } }}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <View style={[styles.outer, selected && styles.outerSelected]}>
                {selected ? <View style={styles.inner} /> : null}
              </View>
              <Text style={styles.label}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </FieldWrapper>
  );
}
