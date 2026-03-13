import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { TextAreaFieldConfig } from '../../types/field.types';

interface TextAreaFieldProps {
  config: TextAreaFieldConfig;
}

export function TextAreaField({ config }: TextAreaFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [isFocused, setIsFocused] = useState(false);

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    input: {
      borderWidth: isFocused ? theme.shape.borderWidthFocused : theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : isFocused ? theme.colors.borderFocused : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: theme.spacing.fieldPaddingH,
      paddingVertical: theme.spacing.fieldPaddingV,
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
      minHeight: (config.numberOfLines ?? 4) * 24,
      textAlignVertical: 'top',
    },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <TextInput
        style={[styles.input, config.style as object]}
        value={String(value ?? '')}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); onBlur(); }}
        placeholder={config.placeholder}
        placeholderTextColor={theme.colors.placeholder}
        multiline
        numberOfLines={config.numberOfLines ?? 4}
        maxLength={config.maxLength}
        editable={!isDisabled}
        accessibilityLabel={config.label}
      />
    </FieldWrapper>
  );
}
