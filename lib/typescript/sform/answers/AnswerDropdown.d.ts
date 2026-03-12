import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: unknown) => void;
}
export declare function AnswerDropdown({ question, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerDropdown.d.ts.map