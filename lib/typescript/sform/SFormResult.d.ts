import React from 'react';
import { type ViewStyle } from 'react-native';
import { type SFormApiConfig } from './hooks/useSFormApi';
export interface SFormResultProps {
    /** String sau dấu ? trên URL, ví dụ "abc123" hoặc "formId=123&..." */
    formId: string;
    /** Cấu hình API */
    apiConfig: SFormApiConfig;
    /** FormKey từ list (ưu tiên dùng thay vì formId) */
    formKey?: string;
    /** ShopId từ list */
    shopId?: number;
    /** Callback sau khi submit thành công */
    onSubmitSuccess?: (resultId: number) => void;
    /** Callback khi submit thất bại */
    onSubmitError?: (message: string) => void;
    /** View mode - chỉ xem, không submit */
    mode?: 'fill' | 'view';
    /** Dữ liệu trực tiếp (khi mode='view') */
    dataInput?: import('./types/sform.types').SFormData;
    /** Custom camera handler - inject từ parent app nếu đã có camera */
    onCameraCapture?: (questionId: number, callback: (imageUri: string) => void) => void;
    /** Image: Pick from gallery handler */
    onPickImageFromGallery?: (questionId: number, callback: (imageUri: string) => void) => void;
    /** Image: Capture from camera handler */
    onCaptureImageFromCamera?: (questionId: number, callback: (imageUri: string) => void) => void;
    /** Audio: Record audio handler */
    onRecordAudio?: (questionId: number, callback: (audioUri: string) => void) => void;
    /** Audio: Pick audio file from document handler */
    onPickAudioFromFiles?: (questionId: number, callback: (audioUri: string) => void) => void;
    /** Base path for files directory (e.g., from ReactNativeFS.DocumentDirectoryPath) */
    filesBasePath?: string;
    /** Display mode: 'all' (hiện tất cả) hoặc 'step' (từng câu một) */
    displayMode?: 'all' | 'step';
    style?: ViewStyle;
}
export declare function SFormResult({ formId, apiConfig, formKey, shopId, onSubmitSuccess, onSubmitError, mode, dataInput, onCameraCapture, onPickImageFromGallery, onCaptureImageFromCamera, onRecordAudio, onPickAudioFromFiles, filesBasePath, displayMode, style, }: SFormResultProps): React.JSX.Element;
//# sourceMappingURL=SFormResult.d.ts.map