import React from 'react';
import type { Question, CheckListItem } from '../types/sform.types';
import type { AnswerItem } from '../types/sform.types';
import type { Province, District, Town, Province2025 } from '../types/sform.types';
interface CameraImage {
    index: number;
    questionId: number;
    imageData: string;
}
interface Props {
    question: Question;
    checkItem: CheckListItem | undefined;
    provinces: Province[];
    districts: District[];
    towns: Town[];
    cameraImages: CameraImage[];
    onCapture: (q: Question) => void;
    onDeleteCameraImage: (index: number) => void;
    onDeleteUploadedImage: (questionId: number, url: string) => void;
    onUploadImages: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, q: Question) => void;
    onUploadAudio: (files: Array<{
        uri: string;
        name: string;
        type: string;
    }>, q: Question) => void;
    onPickImageFromGallery?: (question: Question) => void;
    onCaptureImageFromCamera?: (question: Question) => void;
    onRecordAudio?: (question: Question) => void;
    onPickAudioFromFiles?: (question: Question) => void;
    filesBasePath?: string;
    dvhc2025?: Province2025[];
    onChange: (question: Question, value: unknown, answerItem?: AnswerItem) => void;
}
export declare function QuestionItem({ question, checkItem, provinces, districts, towns, cameraImages, onCapture, onDeleteCameraImage, onDeleteUploadedImage, onUploadImages, onUploadAudio, onPickImageFromGallery, onCaptureImageFromCamera, onRecordAudio, onPickAudioFromFiles, filesBasePath, dvhc2025, onChange, }: Props): React.JSX.Element | null;
export {};
//# sourceMappingURL=QuestionItem.d.ts.map