import React from 'react';
import type { Question, AnswerItem } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: {
        id: number;
    }, answerItem?: AnswerItem) => void;
}
export declare function AnswerRadio({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerRadio.d.ts.map