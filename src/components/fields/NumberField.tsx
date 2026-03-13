import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { NumberFieldConfig } from '../../types/field.types';

interface NumberFieldProps {
  config: NumberFieldConfig;
}

export function NumberField({ config }: NumberFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [isFocused, setIsFocused] = useState(false);

  if (!isVisible) return null;

  // Validate min/max
  const handleChange = (text: string) => {
    const num = parseFloat(text);
    if (isNaN(num)) {
      onChange('');
      return;
    }
    
    onChange(num);
  };

  // Validate min/max when blur
  const handleBlur = () => {
    setIsFocused(false);
    
    // Check constraints on blur
    const num = parseFloat(String(value));
    if (!isNaN(num)) {
      let finalValue = num;
      
      if (config.min !== undefined && num < config.min) {
        finalValue = config.min;
        onChange(finalValue);
      }
      if (config.max !== undefined && num > config.max) {
        finalValue = config.max;
        onChange(finalValue);
      }
    }
    
    onBlur();
  };

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: isFocused ? theme.shape.borderWidthFocused : theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : isFocused ? theme.colors.borderFocused : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      height: theme.sizes.inputHeight,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
      overflow: 'hidden',
    },
    affix: {
      paddingHorizontal: 10,
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.textSecondary,
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.fieldPaddingH,
    },
  });

  // Helper text for min/max
  const helperText = [];
  if (config.min !== undefined) helperText.push(`Min: ${config.min}`);
  if (config.max !== undefined) helperText.push(`Max: ${config.max}`);
  const helper = helperText.length > 0 ? helperText.join(' | ') : undefined;

  return (
    <FieldWrapper label={config.label} description={helper || config.description} error={error?.message} required={isRequired}>
      <View style={[styles.row, config.style as object]}>
        {config.prefix ? <Text style={styles.affix}>{config.prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value !== '' && value !== undefined && value !== null ? String(value) : ''}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={config.placeholder}
          placeholderTextColor={theme.colors.placeholder}
          keyboardType="numeric"
          editable={!isDisabled}
          accessibilityLabel={config.label}
        />
        {config.suffix ? <Text style={styles.affix}>{config.suffix}</Text> : null}
      </View>
    </FieldWrapper>
  );
}
