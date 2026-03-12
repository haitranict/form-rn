"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = Form;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _useForm = require("../../hooks/useForm");
var _FormContext = require("../../context/FormContext");
var _FormPage = require("./FormPage");
var _ProgressBar = require("../layout/ProgressBar");
var _theme = require("../../theme");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function FormInner({
  config,
  style,
  contentContainerStyle
}) {
  const theme = (0, _theme.useTheme)();
  const form = (0, _useForm.useForm)(config);
  const contextValue = (0, _react.useMemo)(() => ({
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
  const styles = _reactNative.StyleSheet.create({
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
  return /*#__PURE__*/_react.default.createElement(_FormContext.FormContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [{
      flex: 1
    }, style]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
    style: styles.scroll,
    contentContainerStyle: [styles.content, contentContainerStyle],
    keyboardShouldPersistTaps: "handled"
  }, config.showProgressBar !== false && isMultiPage ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.header
  }, /*#__PURE__*/_react.default.createElement(_ProgressBar.ProgressBar, {
    currentPage: form.currentPage,
    totalPages: form.totalPages,
    showLabel: config.showPageNumbers !== false
  })) : null, /*#__PURE__*/_react.default.createElement(_FormPage.FormPage, {
    fields: currentPageFields
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.footer
  }, isMultiPage && !isFirstPage ? /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.btnSecondary,
    onPress: form.goToPrevPage,
    activeOpacity: 0.8
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnTextSecondary
  }, config.prevLabel ?? 'Back')) : null, isMultiPage && !isLastPage ? /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.btnPrimary,
    onPress: form.goToNextPage,
    activeOpacity: 0.8
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, config.nextLabel ?? 'Next')) : /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btnPrimary, form.isSubmitting && {
      opacity: 0.7
    }],
    onPress: form.handleSubmit,
    disabled: form.isSubmitting,
    activeOpacity: 0.8
  }, form.isSubmitting ? /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, {
    color: theme.colors.white
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
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
function Form({
  theme,
  ...props
}) {
  return /*#__PURE__*/_react.default.createElement(_theme.ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/_react.default.createElement(FormInner, props));
}
//# sourceMappingURL=index.js.map