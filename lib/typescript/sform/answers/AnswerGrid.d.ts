import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: {
        cellId: string;
        cellValue: unknown;
    }) => void;
}
export declare function AnswerGrid({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerGrid.d.ts.map