import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FieldWrapper } from '../layout/FieldWrapper';
import { useTheme } from '../../theme';
import { useFormField } from '../../hooks/useFormField';
import type { RatingFieldConfig } from '../../types/field.types';

interface RatingFieldProps {
  config: RatingFieldConfig;
}

export function RatingField({ config }: RatingFieldProps) {
  const theme = useTheme();
  const { value, error, onChange, onBlur, isVisible, isDisabled, isRequired } = useFormField(config);

  if (!isVisible) return null;

  const maxRating = config.maxRating ?? 5;
  const current = Number(value ?? 0);

  const iconMap = { star: '★', heart: '♥', thumb: '👍' };
  const icon = iconMap[config.icon ?? 'star'];

  const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 6 },
    star: {
      fontSize: theme.sizes.starSize,
      opacity: isDisabled ? 0.5 : 1,
    },
  });

  return (
    <FieldWrapper label={config.label} description={config.description} error={error?.message} required={isRequired}>
      <View style={styles.row}>
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => { if (!isDisabled) { onChange(star); onBlur(); } }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} of ${maxRating}`}
          >
            <Text style={[styles.star, { color: star <= current ? theme.colors.warning : theme.colors.border }]}>
              {icon}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </FieldWrapper>
  );
}
