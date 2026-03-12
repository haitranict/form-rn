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
}
export declare function AnswerCamera({ question, cameraImages, onCapture, onDelete }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerCamera.d.ts.map