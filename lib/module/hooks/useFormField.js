import { useCallback } from 'react';
import { useFormContext } from '../context/FormContext';
import { isFieldVisible, isFieldRequired, isFieldDisabled } from '../utils/conditionalLogic';

/**
 * Use inside any custom field component to read/write a specific field's
 * value, error, and touched state.
 */
export function useFormField(fieldConfig) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = useFormContext();
  const value = values[fieldConfig.id];
  const error = errors[fieldConfig.id];
  const isTouched = touched[fieldConfig.id] ?? false;
  const onChange = useCallback(val => {
    setFieldValue(fieldConfig.id, val);
  }, [fieldConfig.id, setFieldValue]);
  const onBlur = useCallback(() => {
    setFieldTouched(fieldConfig.id, true);
  }, [fieldConfig.id, setFieldTouched]);
  const isVisible = isFieldVisible(fieldConfig.conditional, values);
  const isDisabledByLogic = isFieldDisabled(fieldConfig.conditional, fieldConfig.disabled ?? false, values);
  const isRequiredByLogic = isFieldRequired(fieldConfig.conditional, typeof fieldConfig.validation?.required === 'boolean' ? fieldConfig.validation.required : fieldConfig.validation?.required?.value ?? false, values);
  return {
    value,
    error: isTouched ? error : undefined,
    isTouched,
    onChange,
    onBlur,
    isVisible,
    isDisabled: isDisabledByLogic,
    isRequired: isRequiredByLogic
  };
}
//# sourceMappingURL=useFormField.js.map