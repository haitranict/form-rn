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
    onPickFromGallery?: (question: Question) => void;
    onCaptureFromCamera?: (question: Question) => void;
    /** Base path for files directory in app (e.g., ReactNativeFS.DocumentDirectoryPath) */
    filesBasePath?: string;
}
export declare function AnswerImage({ question, onChange, onDelete, onUpload, onPickFromGallery, onCaptureFromCamera, filesBasePath }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerImage.d.ts.map