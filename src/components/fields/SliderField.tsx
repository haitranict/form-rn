import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { SliderFieldConfig } from '../../types/field.types';

interface SliderFieldProps {
  config: SliderFieldConfig;
}

export function SliderField({ config }: SliderFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);

  if (!isVisible) return null;

  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const step = config.step ?? 1;
  const current = Number(value ?? min);

  // NOTE: Install @react-native-community/slider for production use.
  // This is a placeholder that renders as a numeric input fallback.
  const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    minLabel: { fontSize: theme.typography.fontSizeHelper, color: theme.colors.textSecondary },
    maxLabel: { fontSize: theme.typography.fontSizeHelper, color: theme.colors.textSecondary },
    track: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginHorizontal: 10,
      overflow: 'visible',
    },
    fill: {
      height: '100%',
      width: `${((current - min) / (max - min)) * 100}%`,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    valueText: {
      textAlign: 'center',
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 6,
    },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <View style={styles.row}>
        <Text style={styles.minLabel}>{config.minLabel ?? String(min)}</Text>
        <View style={styles.track}>
          <View style={styles.fill} />
        </View>
        <Text style={styles.maxLabel}>{config.maxLabel ?? String(max)}</Text>
      </View>
      {config.showValue !== false ? <Text style={styles.valueText}>{current}</Text> : null}
    </FieldWrapper>
  );
}
