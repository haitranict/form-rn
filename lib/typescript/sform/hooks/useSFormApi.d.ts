import type { SFormData, InsertResultPayload, InsertResultResponse, Shop, UploadResult } from '../types/sform.types';
export interface SFormApiConfig {
    baseUrl: string;
    token?: string;
}
/**
 * GetById - Lấy form theo FormKey
 * GET /shop/formbyKey
 * Headers: FormKey (string), shopId (int)
 */
export declare function apiGetFormById(config: SFormApiConfig, formKey: string, shopId?: number): Promise<SFormData>;
/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /shop/storemanager
 */
export declare function apiGetShops(config: SFormApiConfig, data: {
    accountId: number;
    employeeId: number;
}): Promise<Shop[]>;
/**
 * InsertResult - Submit form
 * POST /uploaded/spiralform
 * Payload format: spiralFormModel (shopId, formDate, publicKey, spiralData, fromTime, toTime)
 */
export declare function apiInsertResult(config: SFormApiConfig, payload: InsertResultPayload): Promise<InsertResultResponse>;
/**
 * UploadImages - Upload ảnh từ gallery/camera
 * POST /uploaded/spiralphoto (multipart/form-data)
 */
export declare function apiUploadImages(config: SFormApiConfig, files: Array<{
    uri: string;
    name: string;
    type: string;
}>): Promise<UploadResult[]>;
/**
 * UploadAudio - Upload audio files
 * POST /uploaded/audio (multipart/form-data)
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