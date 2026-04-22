import React from 'react';
import { type ViewStyle } from 'react-native';
import type { Province2025 } from './types/sform.types';
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
    /** Callback sau khi submit thành công - trả về resultId và formKey để update list */
    onSubmitSuccess?: (resultId: number, formKey: string) => void;
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
    /** DVHC 2025 data (Province → Ward directly, no District) */
    dvhc2025?: Province2025[];
    /** Display mode: 'all' (hiện tất cả) hoặc 'step' (từng câu một) */
    displayMode?: 'all' | 'step';
    /** Callback để lấy token mới nhất trước khi submit (tránh token hết hạn) */
    onGetLatestToken?: () => string | Promise<string>;
    style?: ViewStyle;
}
export declare function SFormResult({ formId, apiConfig, formKey, shopId, onSubmitSuccess, onSubmitError, mode, dataInput, onCameraCapture, onPickImageFromGallery, onCaptureImageFromCamera, onRecordAudio, onPickAudioFromFiles, filesBasePath, dvhc2025, displayMode, onGetLatestToken, style, }: SFormResultProps): React.JSX.Element;
//# sourceMappingURL=SFormResult.d.ts.map