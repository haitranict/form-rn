import React from 'react';
import type { Question } from '../types/sform.types';
interface CameraImage {
    index: number;
    questionId: number;
    imageData: string;
}
interface Props {
    question: Question;
    cameraImages: CameraImage[];
    onCapture: () => void;
    onDelete: (index: number) => void;
    onCameraCapture?: (question: Question) => void;
    /** Base path for files directory in app (e.g., file:///data/user/0/com.app/files) */
    filesBasePath?: string;
}
export declare function AnswerCamera({ question, cameraImages, onCapture, onDelete, onCameraCapture, filesBasePath }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerCamera.d.ts.map