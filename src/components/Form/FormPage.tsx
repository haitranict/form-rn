import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FieldRenderer } from './FieldRenderer';
import type { FieldConfig } from '../../types/field.types';
import type { FormPage as FormPageType } from '../../types/form.types';
import { useTheme } from '../../theme';

interface FormPageProps {
  page?: FormPageType;
  fields?: FieldConfig[];
}

export function FormPage({ page, fields: directFields }: FormPageProps) {
  const theme = useTheme();
  const fields = page?.fields ?? directFields ?? [];

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingVertical: theme.spacing.pagePaddingV,
    },
  });

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <FieldRenderer key={field.id} field={field} />
      ))}
    </View>
  );
}
