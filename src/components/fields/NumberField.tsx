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

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <View style={[styles.row, config.style as object]}>
        {config.prefix ? <Text style={styles.affix}>{config.prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value !== '' && value !== undefined && value !== null ? String(value) : ''}
          onChangeText={(text) => {
            const num = parseFloat(text);
            onChange(isNaN(num) ? '' : num);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur(); }}
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
