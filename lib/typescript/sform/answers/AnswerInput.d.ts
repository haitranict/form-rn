import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: string) => void;
}
export declare function AnswerInput({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerInput.d.ts.map