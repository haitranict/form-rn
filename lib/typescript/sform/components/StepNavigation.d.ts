import React from 'react';
interface Props {
    currentStep: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canGoNext: boolean;
    isSubmitting: boolean;
    /** Chế độ chỉ xem (form bị khoá) → ẩn nút Gửi */
    readOnly?: boolean;
}
export declare function StepNavigation({ currentStep, totalSteps, onPrevious, onNext, onSubmit, isFirstStep, isLastStep, canGoNext, isSubmitting, readOnly, }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=StepNavigation.d.ts.map