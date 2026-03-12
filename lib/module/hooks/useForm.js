import { useState, useCallback, useRef } from 'react';
import { validateAllFields, validateField } from '../utils/validation';
import { buildDefaultValues, flattenFields, filterSubmitValues } from '../utils/helpers';

/**
 * Core form state hook. Used internally by <Form> component.
 */
export function useForm(config) {
  const allFields = flattenFields(config.fields, config.pages);
  const pageFields = config.pages ? config.pages.map(p => p.fields) : [allFields];
  const totalPages = pageFields.length;
  const initialValues = buildDefaultValues(allFields);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const startTimeRef = useRef(Date.now());
  const setFieldValue = useCallback((fieldId, value) => {
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
      const error = validateField(fieldCfg, value, {
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
  const setFieldError = useCallback((fieldId, error) => {
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
  const setFieldTouched = useCallback((fieldId, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: isTouched
    }));
  }, []);
  const validateForm = useCallback(() => {
    const errs = validateAllFields(allFields, values);
    setErrors(errs);
    return errs;
  }, [allFields, values]);
  const validatePage = useCallback(pageIndex => {
    const fields = pageFields[pageIndex] ?? [];
    const errs = validateAllFields(fields, values);
    setErrors(prev => ({
      ...prev,
      ...errs
    }));
    return errs;
  }, [pageFields, values]);
  const goToPage = useCallback(page => {
    const clamped = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(clamped);
    config.onPageChange?.(clamped, totalPages);
  }, [config, totalPages]);
  const goToNextPage = useCallback(() => {
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
  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  const resetForm = useCallback(() => {
    setValues(buildDefaultValues(allFields));
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    setCurrentPage(0);
    startTimeRef.current = Date.now();
  }, [allFields]);
  const handleSubmit = useCallback(async () => {
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
        values: filterSubmitValues(values, allFields),
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