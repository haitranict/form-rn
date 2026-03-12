import React, { useMemo } from 'react';
import {
  ScrollView, View, TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, type ViewStyle,
} from 'react-native';
import type { FormConfig } from '../../types/form.types';
import { useForm } from '../../hooks/useForm';
import { FormContext } from '../../context/FormContext';
import { FormPage } from './FormPage';
import { ProgressBar } from '../layout/ProgressBar';
import { ThemeProvider, useTheme } from '../../theme';
import type { FormTheme } from '../../theme/defaultTheme';

interface FormProps {
  config: FormConfig;
  theme?: Partial<FormTheme>;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

function FormInner({ config, style, contentContainerStyle }: Omit<FormProps, 'theme'>) {
  const theme = useTheme();
  const form = useForm(config);

  const contextValue = useMemo(
    () => ({
      values: form.values,
      setFieldValue: form.setFieldValue,
      errors: form.errors,
      setFieldError: form.setFieldError,
      touched: form.touched,
      setFieldTouched: form.setFieldTouched,
      fields: form.fields,
      isSubmitting: form.isSubmitting,
      submitCount: form.submitCount,
      currentPage: form.currentPage,
      totalPages: form.totalPages,
      goToPage: form.goToPage,
      goToNextPage: form.goToNextPage,
      goToPrevPage: form.goToPrevPage,
      validateForm: form.validateForm,
      validatePage: form.validatePage,
      resetForm: form.resetForm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values, form.errors, form.touched, form.isSubmitting, form.currentPage]
  );

  const isMultiPage = form.totalPages > 1;
  const isLastPage = form.currentPage === form.totalPages - 1;
  const isFirstPage = form.currentPage === 0;

  const currentPageFields = isMultiPage
    ? (config.pages?.[form.currentPage]?.fields ?? [])
    : (config.fields ?? []);

  const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingTop: theme.spacing.pagePaddingV,
    },
    content: { paddingBottom: 24 },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingVertical: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    btnPrimary: {
      flex: 1,
      height: theme.sizes.inputHeight,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.shape.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnSecondary: {
      flex: 1,
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    btnTextSecondary: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
  });

  return (
    <FormContext.Provider value={contextValue}>
      <View style={[{ flex: 1 }, style]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {(config.showProgressBar !== false && isMultiPage) ? (
            <View style={styles.header}>
              <ProgressBar
                currentPage={form.currentPage}
                totalPages={form.totalPages}
                showLabel={config.showPageNumbers !== false}
              />
            </View>
          ) : null}

          <FormPage fields={currentPageFields} />
        </ScrollView>

        {/* Footer Navigation / Submit */}
        <View style={styles.footer}>
          {isMultiPage && !isFirstPage ? (
            <TouchableOpacity style={styles.btnSecondary} onPress={form.goToPrevPage} activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>{config.prevLabel ?? 'Back'}</Text>
            </TouchableOpacity>
          ) : null}

          {isMultiPage && !isLastPage ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={form.goToNextPage} activeOpacity={0.8}>
              <Text style={styles.btnText}>{config.nextLabel ?? 'Next'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnPrimary, form.isSubmitting && { opacity: 0.7 }]}
              onPress={form.handleSubmit}
              disabled={form.isSubmitting}
              activeOpacity={0.8}
            >
              {form.isSubmitting ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.btnText}>{config.submitLabel ?? 'Submit'}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </FormContext.Provider>
  );
}

/**
 * Main Form component export.
 *
 * Usage:
 * ```tsx
 * <Form
 *   config={{
 *     id: 'my-form',
 *     fields: [...],
 *     onSubmit: (data) => console.log(data),
 *   }}
 * />
 * ```
 */
export function Form({ theme, ...props }: FormProps) {
  return (
    <ThemeProvider theme={theme}>
      <FormInner {...props} />
    </ThemeProvider>
  );
}
