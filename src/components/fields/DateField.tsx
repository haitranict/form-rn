import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { DateFieldConfig, TimeFieldConfig, DateTimeFieldConfig } from '../../types/field.types';

type DateLikeConfig = DateFieldConfig | TimeFieldConfig | DateTimeFieldConfig;

interface DateFieldProps {
  config: DateLikeConfig;
}

export function DateField({ config }: DateFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);
  const [show, setShow] = useState(false);

  if (!isVisible) return null;

  const mode = config.type === 'date' ? 'date' : config.type === 'time' ? 'time' : 'datetime';
  const dateValue = value instanceof Date ? value : value ? new Date(String(value)) : new Date();

  const formatDisplay = (d: Date): string => {
    if (mode === 'time') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (mode === 'date') return d.toLocaleDateString();
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const styles = StyleSheet.create({
    trigger: {
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: error ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.fieldPaddingH,
      backgroundColor: isDisabled ? theme.colors.labelBackground : theme.colors.inputBackground,
    },
    text: {
      flex: 1,
      fontSize: theme.typography.fontSizeInput,
      color: value ? theme.colors.text : theme.colors.placeholder,
    },
    icon: { fontSize: 18, color: theme.colors.textSecondary },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => { if (!isDisabled) setShow(true); }}
        activeOpacity={0.7}
        accessibilityLabel={config.label}
      >
        <Text style={styles.text}>
          {value ? formatDisplay(dateValue) : (config.placeholder ?? `Select ${mode}...`)}
        </Text>
        <Text style={styles.icon}>{mode === 'time' ? '🕐' : '📅'}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode={mode as 'date' | 'time' | 'datetime'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShow(Platform.OS === 'ios');
            if (selectedDate) { onChange(selectedDate); onBlur(); }
          }}
          minimumDate={(config as DateFieldConfig).minDate}
          maximumDate={(config as DateFieldConfig).maxDate}
        />
      )}
    </FieldWrapper>
  );
}
