import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: Date | null) => void;
}
export declare function AnswerDate({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerDate.d.ts.map