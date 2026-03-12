import React, { useMemo } from 'react';
import { ScrollView, View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useForm } from '../../hooks/useForm';
import { FormContext } from '../../context/FormContext';
import { FormPage } from './FormPage';
import { ProgressBar } from '../layout/ProgressBar';
import { ThemeProvider, useTheme } from '../../theme';
function FormInner({
  config,
  style,
  contentContainerStyle
}) {
  const theme = useTheme();
  const form = useForm(config);
  const contextValue = useMemo(() => ({
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
    resetForm: form.resetForm
  }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [form.values, form.errors, form.touched, form.isSubmitting, form.currentPage]);
  const isMultiPage = form.totalPages > 1;
  const isLastPage = form.currentPage === form.totalPages - 1;
  const isFirstPage = form.currentPage === 0;
  const currentPageFields = isMultiPage ? config.pages?.[form.currentPage]?.fields ?? [] : config.fields ?? [];
  const styles = StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    header: {
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingTop: theme.spacing.pagePaddingV
    },
    content: {
      paddingBottom: 24
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingVertical: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background
    },
    btnPrimary: {
      flex: 1,
      height: theme.sizes.inputHeight,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.shape.borderRadius,
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnSecondary: {
      flex: 1,
      height: theme.sizes.inputHeight,
      borderWidth: theme.shape.borderWidth,
      borderColor: theme.colors.border,
      borderRadius: theme.shape.borderRadius,
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600'
    },
    btnTextSecondary: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500'
    }
  });
  return /*#__PURE__*/React.createElement(FormContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(View, {
    style: [{
      flex: 1
    }, style]
  }, /*#__PURE__*/React.createElement(ScrollView, {
    style: styles.scroll,
    contentContainerStyle: [styles.content, contentContainerStyle],
    keyboardShouldPersistTaps: "handled"
  }, config.showProgressBar !== false && isMultiPage ? /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    currentPage: form.currentPage,
    totalPages: form.totalPages,
    showLabel: config.showPageNumbers !== false
  })) : null, /*#__PURE__*/React.createElement(FormPage, {
    fields: currentPageFields
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.footer
  }, isMultiPage && !isFirstPage ? /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.btnSecondary,
    onPress: form.goToPrevPage,
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnTextSecondary
  }, config.prevLabel ?? 'Back')) : null, isMultiPage && !isLastPage ? /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.btnPrimary,
    onPress: form.goToNextPage,
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText
  }, config.nextLabel ?? 'Next')) : /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btnPrimary, form.isSubmitting && {
      opacity: 0.7
    }],
    onPress: form.handleSubmit,
    disabled: form.isSubmitting,
    activeOpacity: 0.8
  }, form.isSubmitting ? /*#__PURE__*/React.createElement(ActivityIndicator, {
    color: theme.colors.white
  }) : /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText
  }, config.submitLabel ?? 'Submit')))));
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
export function Form({
  theme,
  ...props
}) {
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(FormInner, props));
}
//# sourceMappingURL=index.js.map