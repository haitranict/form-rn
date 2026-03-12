import React, { useState } from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { TextFieldConfig } from '../../types/field.types';

interface TextFieldProps {
  config: TextFieldConfig;
}

export function TextField({ config }: TextFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [isFocused, setIsFocused] = useState(false);

  if (!isVisible) return null;

  const keyboardType: TextInputProps['keyboardType'] =
    config.type === 'email' ? 'email-address' :
    config.type === 'url' ? 'url' :
    'default';

  const secureTextEntry = config.type === 'password';

  const styles = StyleSheet.create({
    input: {
      height: theme.sizes.inputHeight,
      borderWidth: isFocused ? theme.shape.borderWidthFocused : theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : isFocused ? theme.colors.borderFocused : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      paddingHorizontal: theme.spacing.fieldPaddingH,
      fontSize: theme.typography.fontSizeInput,
      color: theme.colors.text,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
    },
  });

  return (
    <FieldWrapper
      label={config.label}
      description={config.description}
      error={error?.message}
      required={isRequired}
    >
      <TextInput
        style={[styles.input, config.style as object]}
        value={String(value ?? '')}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); onBlur(); }}
        placeholder={config.placeholder}
        placeholderTextColor={theme.colors.placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={!isDisabled}
        maxLength={config.maxLength}
        autoCapitalize={config.autoCapitalize ?? (config.type === 'email' ? 'none' : 'sentences')}
        autoComplete={config.type === 'email' ? 'email' : 'off'}
        accessibilityLabel={config.label}
      />
    </FieldWrapper>
  );
}
