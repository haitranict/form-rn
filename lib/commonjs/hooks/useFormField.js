"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormField = useFormField;
var _react = require("react");
var _FormContext = require("../context/FormContext");
var _conditionalLogic = require("../utils/conditionalLogic");
/**
 * Use inside any custom field component to read/write a specific field's
 * value, error, and touched state.
 */
function useFormField(fieldConfig) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
  } = (0, _FormContext.useFormContext)();
  const value = values[fieldConfig.id];
  const error = errors[fieldConfig.id];
  const isTouched = touched[fieldConfig.id] ?? false;
  const onChange = (0, _react.useCallback)(val => {
    setFieldValue(fieldConfig.id, val);
  }, [fieldConfig.id, setFieldValue]);
  const onBlur = (0, _react.useCallback)(() => {
    setFieldTouched(fieldConfig.id, true);
  }, [fieldConfig.id, setFieldTouched]);
  const isVisible = (0, _conditionalLogic.isFieldVisible)(fieldConfig.conditional, values);
  const isDisabledByLogic = (0, _conditionalLogic.isFieldDisabled)(fieldConfig.conditional, fieldConfig.disabled ?? false, values);
  const isRequiredByLogic = (0, _conditionalLogic.isFieldRequired)(fieldConfig.conditional, typeof fieldConfig.validation?.required === 'boolean' ? fieldConfig.validation.required : fieldConfig.validation?.required?.value ?? false, values);
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