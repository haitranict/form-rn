import type { FieldConfig, FieldValidation } from '../types/field.types';
import type { FieldError, FormErrors } from '../types/validation.types';

// ============================================================
// Validation helpers
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

function extractRuleValue<T>(rule: T | { value: T; message: string }): T {
  if (rule !== null && typeof rule === 'object' && 'value' in (rule as object)) {
    return (rule as { value: T; message: string }).value;
  }
  return rule as T;
}

function extractRuleMessage<T>(rule: T | { value: T; message: string }, fallback: string): string {
  if (rule !== null && typeof rule === 'object' && 'message' in (rule as object)) {
    return (rule as { value: T; message: string }).message;
  }
  return fallback;
}

export function validateField(
  fieldConfig: FieldConfig,
  value: unknown,
  allValues: Record<string, unknown>
): FieldError | null {
  const validation = (fieldConfig as { validation?: FieldValidation }).validation;
  if (!validation) return null;

  const isEmpty = (v: unknown): boolean => {
    if (v === null || v === undefined || v === '') return true;
    if (Array.isArray(v) && v.length === 0) return true;
    return false;
  };

  // Required
  if (validation.required) {
    const reqValue = extractRuleValue(validation.required);
    const reqMessage = extractRuleMessage(validation.required, `${fieldConfig.label ?? 'This field'} is required`);
    if (reqValue && isEmpty(value)) {
      return { type: 'required', message: reqMessage };
    }
  }

  // Skip other validations if empty (and not required)
  if (isEmpty(value)) return null;

  // Min/Max Length
  if (validation.minLength && typeof value === 'string') {
    const minVal = extractRuleValue(validation.minLength);
    const minMsg = extractRuleMessage(validation.minLength, `Minimum ${minVal} characters`);
    if (value.length < minVal) return { type: 'minLength', message: minMsg };
  }

  if (validation.maxLength && typeof value === 'string') {
    const maxVal = extractRuleValue(validation.maxLength);
    const maxMsg = extractRuleMessage(validation.maxLength, `Maximum ${maxVal} characters`);
    if (value.length > maxVal) return { type: 'maxLength', message: maxMsg };
  }

  // Min/Max number
  if (validation.min !== undefined) {
    const minVal = extractRuleValue(validation.min);
    const minMsg = extractRuleMessage(validation.min, `Minimum value is ${minVal}`);
    if (typeof value === 'number' && value < minVal) return { type: 'min', message: minMsg };
  }

  if (validation.max !== undefined) {
    const maxVal = extractRuleValue(validation.max);
    const maxMsg = extractRuleMessage(validation.max, `Maximum value is ${maxVal}`);
    if (typeof value === 'number' && value > maxVal) return { type: 'max', message: maxMsg };
  }

  // Pattern
  if (validation.pattern) {
    const patternVal = extractRuleValue(validation.pattern);
    const patternMsg = extractRuleMessage(validation.pattern, 'Invalid format');
    if (typeof value === 'string' && !patternVal.test(value)) {
      return { type: 'pattern', message: patternMsg };
    }
  }

  // Email
  if (validation.email) {
    const emailMsg = extractRuleMessage(validation.email, 'Invalid email address');
    if (typeof value === 'string' && !EMAIL_REGEX.test(value)) {
      return { type: 'email', message: emailMsg };
    }
  }

  // URL
  if (validation.url) {
    const urlMsg = extractRuleMessage(validation.url, 'Invalid URL');
    if (typeof value === 'string' && !URL_REGEX.test(value)) {
      return { type: 'url', message: urlMsg };
    }
  }

  // Phone
  if (validation.phone) {
    const phoneMsg = extractRuleMessage(validation.phone, 'Invalid phone number');
    if (typeof value === 'string' && !PHONE_REGEX.test(value)) {
      return { type: 'phone', message: phoneMsg };
    }
  }

  // Custom
  if (validation.custom) {
    const customMsg = validation.custom(value, allValues);
    if (customMsg) return { type: 'custom', message: customMsg };
  }

  return null;
}

export function validateAllFields(
  fields: FieldConfig[],
  values: Record<string, unknown>
): FormErrors {
  const errors: FormErrors = {};
  fields.forEach((field) => {
    const error = validateField(field, values[field.id], values);
    if (error) errors[field.id] = error;
  });
  return errors;
}
