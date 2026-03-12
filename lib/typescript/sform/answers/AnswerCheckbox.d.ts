import React from 'react';
import type { Question, AnswerItem } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: {
        id: number;
        checked: boolean;
    }, answerItem?: AnswerItem) => void;
}
export declare function AnswerCheckbox({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerCheckbox.d.ts.map