"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useForm = useForm;
var _react = require("react");
var _validation = require("../utils/validation");
var _helpers = require("../utils/helpers");
/**
 * Core form state hook. Used internally by <Form> component.
 */
function useForm(config) {
  const allFields = (0, _helpers.flattenFields)(config.fields, config.pages);
  const pageFields = config.pages ? config.pages.map(p => p.fields) : [allFields];
  const totalPages = pageFields.length;
  const initialValues = (0, _helpers.buildDefaultValues)(allFields);
  const [values, setValues] = (0, _react.useState)(initialValues);
  const [errors, setErrors] = (0, _react.useState)({});
  const [touched, setTouched] = (0, _react.useState)({});
  const [isSubmitting, setIsSubmitting] = (0, _react.useState)(false);
  const [submitCount, setSubmitCount] = (0, _react.useState)(0);
  const [currentPage, setCurrentPage] = (0, _react.useState)(0);
  const startTimeRef = (0, _react.useRef)(Date.now());
  const setFieldValue = (0, _react.useCallback)((fieldId, value) => {
    setValues(prev => {
      const next = {
        ...prev,
        [fieldId]: value
      };
      config.onChange?.(fieldId, value, next);
      return next;
    });
    // Re-validate on change if field was touched
    setErrors(prevErrors => {
      if (!touched[fieldId]) return prevErrors;
      const fieldCfg = allFields.find(f => f.id === fieldId);
      if (!fieldCfg) return prevErrors;
      const error = (0, _validation.validateField)(fieldCfg, value, {
        ...values,
        [fieldId]: value
      });
      const next = {
        ...prevErrors
      };
      if (error) {
        next[fieldId] = error;
      } else {
        delete next[fieldId];
      }
      return next;
    });
  }, [allFields, config, touched, values]);
  const setFieldError = (0, _react.useCallback)((fieldId, error) => {
    setErrors(prev => {
      const next = {
        ...prev
      };
      if (error) {
        next[fieldId] = error;
      } else {
        delete next[fieldId];
      }
      return next;
    });
  }, []);
  const setFieldTouched = (0, _react.useCallback)((fieldId, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: isTouched
    }));
  }, []);
  const validateForm = (0, _react.useCallback)(() => {
    const errs = (0, _validation.validateAllFields)(allFields, values);
    setErrors(errs);
    return errs;
  }, [allFields, values]);
  const validatePage = (0, _react.useCallback)(pageIndex => {
    const fields = pageFields[pageIndex] ?? [];
    const errs = (0, _validation.validateAllFields)(fields, values);
    setErrors(prev => ({
      ...prev,
      ...errs
    }));
    return errs;
  }, [pageFields, values]);
  const goToPage = (0, _react.useCallback)(page => {
    const clamped = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(clamped);
    config.onPageChange?.(clamped, totalPages);
  }, [config, totalPages]);
  const goToNextPage = (0, _react.useCallback)(() => {
    // Validate current page before proceeding
    const errs = validatePage(currentPage);
    const currentFields = pageFields[currentPage] ?? [];
    // Mark all current page fields as touched
    const touchedUpdates = {};
    currentFields.forEach(f => {
      touchedUpdates[f.id] = true;
    });
    setTouched(prev => ({
      ...prev,
      ...touchedUpdates
    }));
    if (Object.keys(errs).length === 0 && currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage, pageFields, totalPages, validatePage]);
  const goToPrevPage = (0, _react.useCallback)(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  const resetForm = (0, _react.useCallback)(() => {
    setValues((0, _helpers.buildDefaultValues)(allFields));
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    setCurrentPage(0);
    startTimeRef.current = Date.now();
  }, [allFields]);
  const handleSubmit = (0, _react.useCallback)(async () => {
    // Touch all fields
    const allTouched = {};
    allFields.forEach(f => {
      allTouched[f.id] = true;
    });
    setTouched(allTouched);
    const errs = validateForm();
    setSubmitCount(c => c + 1);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);
    try {
      await config.onSubmit({
        values: (0, _helpers.filterSubmitValues)(values, allFields),
        meta: {
          formId: config.id,
          submittedAt: new Date().toISOString(),
          duration: Date.now() - startTimeRef.current
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [allFields, config, validateForm, values]);
  return {
    // state
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    currentPage,
    totalPages,
    fields: allFields,
    pageFields,
    // setters
    setFieldValue,
    setFieldError,
    setFieldTouched,
    // actions
    validateForm,
    validatePage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetForm,
    handleSubmit
  };
}
//# sourceMappingURL=useForm.js.map