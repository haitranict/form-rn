import type { SFormData, InsertResultPayload, InsertResultResponse, Shop, UploadResult } from '../types/sform.types';
export interface SFormApiConfig {
    baseUrl: string;
    token?: string;
}
/**
 * GetById - Lấy form theo domain/id
 * GET /api/SForm/GetById?id={formId}
 */
export declare function apiGetFormById(config: SFormApiConfig, formId: string): Promise<SFormData>;
/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /api/SForm/GetShops
 */
export declare function apiGetShops(config: SFormApiConfig, data: {
    accountId: number;
    employeeId: number;
}): Promise<Shop[]>;
/**
 * InsertResult - Submit form
 * POST /api/SForm/InsertResult
 */
export declare function apiInsertResult(config: SFormApiConfig, payload: InsertResultPayload): Promise<InsertResultResponse>;
/**
 * UploadImages - Upload ảnh từ gallery/camera
 * POST /api/SForm/UploadImages (multipart/form-data)
 */
export declare function apiUploadImages(config: SFormApiConfig, files: Array<{
    uri: string;
    name: string;
    type: string;
}>): Promise<UploadResult[]>;
/**
 * UploadAudio - Upload audio files
 * POST /api/SForm/UploadAudio (multipart/form-data)
 */
export declare function apiUploadAudio(config: SFormApiConfig, files: Array<{
    uri: string;
    name: string;
    type: string;
}>): Promise<UploadResult[]>;
/**
 * GetList - Lấy danh sách form khảo sát theo shopId
 * GET /shop/formlist
 * Returns: { statusId, messager, data: FormListItem[], totalRow }
 */
export declare function apiGetFormList(config: SFormApiConfig, shopId: number): Promise<import('../types/sform.types').FormListResponse>;
//# sourceMappingURL=useSFormApi.d.ts.map