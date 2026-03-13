import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { CheckboxGroupFieldConfig } from '../../types/field.types';

interface CheckboxGroupFieldProps {
  config: CheckboxGroupFieldConfig;
}

export function CheckboxGroupField({ config }: CheckboxGroupFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);

  if (!isVisible) return null;

  const selectedValues: unknown[] = Array.isArray(value) ? value : [];

  const toggle = (optionValue: unknown) => {
    if (isDisabled) return;
    const exists = selectedValues.includes(optionValue);
    let next: unknown[];
    if (exists) {
      next = selectedValues.filter((v) => v !== optionValue);
    } else {
      if (config.maxSelections && selectedValues.length >= config.maxSelections) return;
      next = [...selectedValues, optionValue];
    }
    onChange(next);
    onBlur();
  };

  const styles = StyleSheet.create({
    container: {
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
    box: {
      width: theme.sizes.checkboxSize,
      height: theme.sizes.checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    checkmark: { color: theme.colors.checkmark, fontSize: 12, fontWeight: '700' },
    label: { fontSize: theme.typography.fontSizeInput, color: theme.colors.text },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <View style={styles.container}>
        {config.options.map((option) => {
          const checked = selectedValues.includes(option.value);
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={styles.option}
              onPress={() => toggle(option.value)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.box, { borderColor: checked ? theme.colors.primary : theme.colors.border, backgroundColor: checked ? theme.colors.primary : theme.colors.inputBackground }]}>
                {checked ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.label}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </FieldWrapper>
  );
}
