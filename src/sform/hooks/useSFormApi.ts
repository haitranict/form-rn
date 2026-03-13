import type {
  SFormData,
  InsertResultPayload,
  InsertResultResponse,
  Shop,
  UploadResult,
} from '../types/sform.types';

// ============================================================
// SForm API Service
// Cấu hình BASE_URL tại entry point hoặc truyền vào hook
// ============================================================

export interface SFormApiConfig {
  baseUrl: string;       // e.g. "https://api.example.com"
  token?: string;        // Bearer token (nếu cần)
}

// Standard API response wrapper
interface ApiResponse<T> {
  statusId: number;
  messager: string;
  data: T;
  totalRow?: number;
}

function buildHeaders(config: SFormApiConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ')
      ? config.token
      : `Bearer ${config.token}`;
  }
  return headers;
}

/**
 * Helper: Check cả HTTP status và business status trong response
 * @throws Error nếu có vấn đề ở bất kỳ layer nào
 */
async function handleApiResponse<T>(
  res: Response,
  apiName: string
): Promise<T> {
  // Layer 1: Check HTTP status
  if (!res.ok) {
    let errorMessage = `${apiName} failed: HTTP ${res.status}`;
    try {
      const errorBody = await res.text();
      console.log(`${apiName} - Error body:`, errorBody);
      errorMessage += ` - ${errorBody}`;
    } catch (e) {
      // Ignore if can't read body
    }
    throw new Error(errorMessage);
  }

  // Layer 2: Parse response body
  const body = await res.json();
  console.log(`${apiName} - Response body:`, body);

  // Check if response has statusId field (wrapped response)
  if (typeof body.statusId !== 'undefined') {
    const wrapped = body as ApiResponse<T>;
    if (wrapped.statusId !== 200) {
      throw new Error(
        `${apiName} failed: statusId ${wrapped.statusId} - ${wrapped.messager || 'Unknown error'}`
      );
    }
    return wrapped.data;
  }

  // Direct response (no wrapper)
  return body as T;
}

/**
 * GetById - Lấy form theo FormKey
 * GET /shop/formbyKey
 * Headers: FormKey (string), shopId (int)
 */
export async function apiGetFormById(
  config: SFormApiConfig,
  formKey: string,
  shopId: number = 0
): Promise<SFormData> {
  const headers = buildHeaders(config);
  // Pass FormKey và shopId qua headers theo yêu cầu API
  headers['FormKey'] = formKey;
  headers['shopId'] = shopId.toString();
  
  const url = `${config.baseUrl}/shop/formbyKey`;
  
  console.log('=== apiGetFormById Request ===');
  console.log('URL:', url);
  console.log('FormKey:', formKey);
  console.log('shopId:', shopId);
  
  const res = await fetch(url, { 
    method: 'GET',
    headers 
  });
  return handleApiResponse<SFormData>(res, 'GetFormById');
}

/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /api/SForm/GetShops
 */
export async function apiGetShops(
  config: SFormApiConfig,
  data: { accountId: number; employeeId: number }
): Promise<Shop[]> {
  const url = `${config.baseUrl}/api/SForm/GetShops`;
  console.log('apiGetShops - URL:', url, 'data:', data);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(data),
  });
  return handleApiResponse<Shop[]>(res, 'GetShops');
}

/**
 * InsertResult - Submit form
 * POST /api/SForm/InsertResult
 */
export async function apiInsertResult(
  config: SFormApiConfig,
  payload: InsertResultPayload
): Promise<InsertResultResponse> {
  const url = `${config.baseUrl}/api/SForm/InsertResult`;
  console.log('apiInsertResult - URL:', url);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(payload),
  });
  return handleApiResponse<InsertResultResponse>(res, 'InsertResult');
}

/**
 * UploadImages - Upload ảnh từ gallery/camera
 * POST /api/SForm/UploadImages (multipart/form-data)
 */
export async function apiUploadImages(
  config: SFormApiConfig,
  files: Array<{ uri: string; name: string; type: string }>
): Promise<UploadResult[]> {
  const formData = new FormData();
  files.forEach((file) => {
    // React Native FormData accepts { uri, name, type }
    formData.append('files', file as unknown as Blob);
  });
  const headers: Record<string, string> = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ')
      ? config.token
      : `Bearer ${config.token}`;
  }
  
  const url = `${config.baseUrl}/api/SForm/UploadImages`;
  console.log('apiUploadImages - URL:', url, 'files:', files.length);
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleApiResponse<UploadResult[]>(res, 'UploadImages');
}

/**
 * UploadAudio - Upload audio files
 * POST /api/SForm/UploadAudio (multipart/form-data)
 */
export async function apiUploadAudio(
  config: SFormApiConfig,
  files: Array<{ uri: string; name: string; type: string }>
): Promise<UploadResult[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file as unknown as Blob);
  });
  const headers: Record<string, string> = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ')
      ? config.token
      : `Bearer ${config.token}`;
  }
  
  const url = `${config.baseUrl}/api/SForm/UploadAudio`;
  console.log('apiUploadAudio - URL:', url, 'files:', files.length);
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleApiResponse<UploadResult[]>(res, 'UploadAudio');
}

/**
 * GetList - Lấy danh sách form khảo sát theo shopId
 * GET /shop/formlist
 * Returns: { statusId, messager, data: FormListItem[], totalRow }
 */
export async function apiGetFormList(
  config: SFormApiConfig,
  shopId: number
): Promise<import('../types/sform.types').FormListResponse> {
  const headers = buildHeaders(config);
  // Gửi shopId qua header
  headers['shopId'] = shopId.toString();
  
  const url = `${config.baseUrl}/shop/formlist`;
  
  // Log request details
  console.log('=== apiGetFormList Request ===');
  console.log('URL:', url);
  console.log('shopId:', shopId, 'type:', typeof shopId);
  console.log('Headers:', {
    ...headers,
    Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'none'
  });
  
  const res = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  // Layer 1: Check HTTP status
  console.log('=== HTTP Response ===');
  console.log('Status:', res.status, res.statusText);
  
  if (!res.ok) {
    let errorMessage = `GetFormList failed: HTTP ${res.status}`;
    try {
      const errorBody = await res.text();
      console.log('Error body:', errorBody);
      errorMessage += ` - ${errorBody}`;
    } catch (e) {
      // Ignore if can't read body
    }
    throw new Error(errorMessage);
  }
  
  // Layer 2: Parse and validate business response
  const body = await res.json();
  console.log('=== Response Body ===');
  console.log('statusId:', body.statusId);
  console.log('messager:', body.messager);
  console.log('data count:', body.data?.length || 0);
  console.log('totalRow:', body.totalRow);
  
  // Validate business status
  if (body.statusId !== 200) {
    throw new Error(
      `GetFormList failed: statusId ${body.statusId} - ${body.messager || 'Unknown error'}`
    );
  }
  
  return body as import('../types/sform.types').FormListResponse;
}
