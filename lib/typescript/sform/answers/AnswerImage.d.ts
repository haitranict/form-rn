import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: string) => void;
    onDelete: (questionId: number, url: string) => void;
    onUpload: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, question: Question) => void;
}
export declare function AnswerImage({ question, onChange, onDelete, onUpload }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerImage.d.ts.map