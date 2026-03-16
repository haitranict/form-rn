import type { SFormData, CheckListItem, Employee, Shop } from '../types/sform.types';
interface ValidationOptions {
    formData: SFormData | null;
    checkList: CheckListItem[];
    selectedEmployee: Employee | null;
    selectedShop: Shop | null;
    imageQuestion: {
        index: number;
        questionId: number;
        imageData: string;
    }[];
    onError: (msg: string) => void;
}
interface ValidationResult {
    isValid: boolean;
    /** Payload khớp với backend spiralFormModel */
    payload: import('../types/sform.types').InsertResultPayload | null;
}
export declare function useSFormValidation({ formData, checkList, selectedEmployee, selectedShop, imageQuestion, onError, }: ValidationOptions): {
    validate: () => ValidationResult;
};
export {};
//# sourceMappingURL=useSFormValidation.d.ts.map