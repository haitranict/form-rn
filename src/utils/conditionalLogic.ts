import type { ConditionalLogic, ConditionalRule } from '../types/field.types';

function evaluateRule(rule: ConditionalRule, allValues: Record<string, unknown>): boolean {
  const fieldValue = allValues[rule.fieldId];

  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value;
    case 'not_equals':
      return fieldValue !== rule.value;
    case 'contains':
      if (typeof fieldValue === 'string') return fieldValue.includes(String(rule.value));
      if (Array.isArray(fieldValue)) return fieldValue.includes(rule.value);
      return false;
    case 'not_contains':
      if (typeof fieldValue === 'string') return !fieldValue.includes(String(rule.value));
      if (Array.isArray(fieldValue)) return !fieldValue.includes(rule.value);
      return true;
    case 'greater_than':
      return typeof fieldValue === 'number' && fieldValue > Number(rule.value);
    case 'less_than':
      return typeof fieldValue === 'number' && fieldValue < Number(rule.value);
    case 'is_empty':
      return fieldValue === null || fieldValue === undefined || fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0);
    case 'is_not_empty':
      return !(fieldValue === null || fieldValue === undefined || fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0));
    default:
      return false;
  }
}

/**
 * Evaluate conditional logic and return whether the action should be applied.
 */
export function evaluateConditional(
  conditional: ConditionalLogic,
  allValues: Record<string, unknown>
): boolean {
  const results = conditional.rules.map((rule) => evaluateRule(rule, allValues));
  return conditional.match === 'all'
    ? results.every(Boolean)
    : results.some(Boolean);
}

/**
 * Returns whether a field should be visible given form values.
 */
export function isFieldVisible(
  conditional: ConditionalLogic | undefined,
  allValues: Record<string, unknown>
): boolean {
  if (!conditional) return true;

  const conditionMet = evaluateConditional(conditional, allValues);

  if (conditional.action === 'show') return conditionMet;
  if (conditional.action === 'hide') return !conditionMet;

  return true; // 'require' and 'disable' don't affect visibility
}

/**
 * Returns whether a field is required based on conditional logic.
 */
export function isFieldRequired(
  conditional: ConditionalLogic | undefined,
  baseRequired: boolean,
  allValues: Record<string, unknown>
): boolean {
  if (!conditional || conditional.action !== 'require') return baseRequired;
  return evaluateConditional(conditional, allValues);
}

/**
 * Returns whether a field is disabled based on conditional logic.
 */
export function isFieldDisabled(
  conditional: ConditionalLogic | undefined,
  baseDisabled: boolean,
  allValues: Record<string, unknown>
): boolean {
  if (!conditional || conditional.action !== 'disable') return baseDisabled;
  return evaluateConditional(conditional, allValues);
}
