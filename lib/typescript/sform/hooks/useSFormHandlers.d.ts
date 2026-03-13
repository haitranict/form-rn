import type { SFormData, Question, CheckListItem, AnswerItem, District } from '../types/sform.types';
interface HandlersOptions {
    formData: SFormData | null;
    checkList: CheckListItem[];
    onUpdate: (nextFormData: SFormData, nextCheckList: CheckListItem[]) => void;
    onSetDistrict: (districts: District[]) => void;
    onSetTown: (towns: import('../types/sform.types').Town[]) => void;
}
export declare function useSFormHandlers({ formData, checkList, onUpdate, onSetDistrict, onSetTown, }: HandlersOptions): {
    handleOnChange: (question: Question, value: unknown, answerItem?: AnswerItem) => void;
};
export {};
//# sourceMappingURL=useSFormHandlers.d.ts.map