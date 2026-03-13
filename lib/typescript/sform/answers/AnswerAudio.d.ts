import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: string) => void;
    onUpload: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, question: Question) => void;
    onRecord?: (question: Question) => void;
    onPickFromFiles?: (question: Question) => void;
}
export declare function AnswerAudio({ question, onChange, onUpload, onRecord, onPickFromFiles }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerAudio.d.ts.map