import type { ConditionalLogic } from '../types/field.types';
/**
 * Evaluate conditional logic and return whether the action should be applied.
 */
export declare function evaluateConditional(conditional: ConditionalLogic, allValues: Record<string, unknown>): boolean;
/**
 * Returns whether a field should be visible given form values.
 */
export declare function isFieldVisible(conditional: ConditionalLogic | undefined, allValues: Record<string, unknown>): boolean;
/**
 * Returns whether a field is required based on conditional logic.
 */
export declare function isFieldRequired(conditional: ConditionalLogic | undefined, baseRequired: boolean, allValues: Record<string, unknown>): boolean;
/**
 * Returns whether a field is disabled based on conditional logic.
 */
export declare function isFieldDisabled(conditional: ConditionalLogic | undefined, baseDisabled: boolean, allValues: Record<string, unknown>): boolean;
//# sourceMappingURL=conditionalLogic.d.ts.map