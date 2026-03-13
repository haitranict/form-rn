import React from 'react';
import type { Question, AnswerItem, Province, District, Town } from '../types/sform.types';
interface CameraImage {
    index: number;
    questionId: number;
    imageData: string;
}
interface Props {
    question: Question;
    provinces: Province[];
    districts: District[];
    towns: Town[];
    cameraImages: CameraImage[];
    onCapture: (question: Question) => void;
    onDeleteCameraImage: (index: number) => void;
    onDeleteUploadedImage: (questionId: number, url: string) => void;
    onUploadImages: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, question: Question) => void;
    onUploadAudio: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, question: Question) => void;
    onPickImageFromGallery?: (question: Question) => void;
    onCaptureImageFromCamera?: (question: Question) => void;
    onRecordAudio?: (question: Question) => void;
    onPickAudioFromFiles?: (question: Question) => void;
    onChange: (question: Question, value: unknown, answerItem?: AnswerItem) => void;
}
export declare function AnswerRenderer({ question, provinces, districts, towns, cameraImages, onCapture, onDeleteCameraImage, onDeleteUploadedImage, onUploadImages, onUploadAudio, onPickImageFromGallery, onCaptureImageFromCamera, onRecordAudio, onPickAudioFromFiles, onChange, }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerRenderer.d.ts.map