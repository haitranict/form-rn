import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: string) => void;
}
export declare function AnswerTextArea({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerTextArea.d.ts.map