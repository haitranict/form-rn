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
 * GetById - Lấy form theo domain/id
 * GET /api/SForm/GetById?id={formId}
 */
export async function apiGetFormById(
  config: SFormApiConfig,
  formId: string
): Promise<SFormData> {
  const res = await fetch(
    `${config.baseUrl}/api/SForm/GetById?${formId}`,
    { headers: buildHeaders(config) }
  );
  if (!res.ok) throw new Error(`GetById failed: ${res.status}`);
  return res.json() as Promise<SFormData>;
}

/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /api/SForm/GetShops
 */
export async function apiGetShops(
  config: SFormApiConfig,
  data: { accountId: number; employeeId: number }
): Promise<Shop[]> {
  const res = await fetch(`${config.baseUrl}/api/SForm/GetShops`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`GetShops failed: ${res.status}`);
  return res.json() as Promise<Shop[]>;
}

/**
 * InsertResult - Submit form
 * POST /api/SForm/InsertResult
 */
export async function apiInsertResult(
  config: SFormApiConfig,
  payload: InsertResultPayload
): Promise<InsertResultResponse> {
  const res = await fetch(`${config.baseUrl}/api/SForm/InsertResult`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`InsertResult failed: ${res.status}`);
  return res.json() as Promise<InsertResultResponse>;
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
  const res = await fetch(`${config.baseUrl}/api/SForm/UploadImages`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error(`UploadImages failed: ${res.status}`);
  return res.json() as Promise<UploadResult[]>;
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
  const res = await fetch(`${config.baseUrl}/api/SForm/UploadAudio`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error(`UploadAudio failed: ${res.status}`);
  return res.json() as Promise<UploadResult[]>;
}

/**
 * GetList - Lấy danh sách form khảo sát theo shopId
 * GET /shop/formlist
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
  console.log('=== API Request ===');
  console.log('URL:', url);
  console.log('Method: GET');
  console.log('Headers:', {
    ...headers,
    Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'none'
  });
  console.log('shopId:', shopId, 'type:', typeof shopId);
  
  const res = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  console.log('=== API Response ===');
  console.log('Status:', res.status, res.statusText);
  
  if (!res.ok) {
    // Try to get error details from response body
    let errorMessage = `GetList failed: ${res.status}`;
    try {
      const errorBody = await res.text();
      console.log('Error body:', errorBody);
      errorMessage += ` - ${errorBody}`;
    } catch (e) {
      // Ignore if can't read body
    }
    throw new Error(errorMessage);
  }
  
  const data = await res.json();
  console.log('Response data:', data);
  return data as Promise<import('../types/sform.types').FormListResponse>;
}
