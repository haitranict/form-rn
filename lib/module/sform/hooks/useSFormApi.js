// ============================================================
// SForm API Service
// Cấu hình BASE_URL tại entry point hoặc truyền vào hook
// ============================================================

// Standard API response wrapper

function buildHeaders(config) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ') ? config.token : `Bearer ${config.token}`;
  }
  return headers;
}

/**
 * Helper: Check cả HTTP status và business status trong response
 * @throws Error nếu có vấn đề ở bất kỳ layer nào
 */
async function handleApiResponse(res, apiName) {
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
    const wrapped = body;
    if (wrapped.statusId !== 200) {
      throw new Error(`${apiName} failed: statusId ${wrapped.statusId} - ${wrapped.messager || 'Unknown error'}`);
    }
    return wrapped.data;
  }

  // Direct response (no wrapper)
  return body;
}

/**
 * GetById - Lấy form theo FormKey
 * GET /shop/formbyKey
 * Headers: FormKey (string), shopId (int)
 */
export async function apiGetFormById(config, formKey, shopId = 0) {
  const headers = buildHeaders(config);
  // Pass FormKey và shopId qua headers theo yêu cầu API
  headers['FormKey'] = formKey;
  headers['shopId'] = shopId.toString();
  const url = `${config.baseUrl}shop/formbyKey`;
  console.log('=== apiGetFormById Request ===');
  console.log('URL:', url);
  console.log('FormKey:', formKey);
  console.log('shopId:', shopId);
  const res = await fetch(url, {
    method: 'GET',
    headers
  });

  // API trả về { statusId, messager, data: SFormData[], totalRow }
  // Cần extract phần tử đầu tiên từ array data
  const response = await handleApiResponse(res, 'GetFormById');
  if (!response || response.length === 0) {
    throw new Error('Form not found');
  }
  return response[0];
}

/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /shop/storemanager
 */
export async function apiGetShops(config, data) {
  const url = `${config.baseUrl}shop/storemanager`;
  console.log('storemanager - URL:', url, 'data:', data);
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'GetShops');
}

/**
 * InsertResult - Submit form
 * POST /uploaded/spiralform
 */
export async function apiInsertResult(config, payload) {
  const url = `${config.baseUrl}uploaded/spiralform`;
  console.log('apiInsertResult - URL:', url);
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(payload)
  });
  return handleApiResponse(res, 'InsertResult');
}

/**
 * UploadImages - Upload ảnh từ gallery/camera
 * POST /uploaded/spiralphoto (multipart/form-data)
 */
export async function apiUploadImages(config, files) {
  const formData = new FormData();
  files.forEach(file => {
    // React Native FormData accepts { uri, name, type }
    formData.append('files', file);
  });
  const headers = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ') ? config.token : `Bearer ${config.token}`;
  }
  const url = `${config.baseUrl}uploaded/spiralphoto`;
  console.log('apiUploadImages - URL:', url, 'files:', files.length);
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  });
  return handleApiResponse(res, 'UploadImages');
}

/**
 * UploadAudio - Upload audio files
 * POST /uploaded/audio (multipart/form-data)
 */
export async function apiUploadAudio(config, files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  const headers = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ') ? config.token : `Bearer ${config.token}`;
  }
  const url = `${config.baseUrl}uploaded/audio`;
  console.log('apiUploadAudio - URL:', url, 'files:', files.length);
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  });
  return handleApiResponse(res, 'UploadAudio');
}

/**
 * GetList - Lấy danh sách form khảo sát theo shopId
 * GET /shop/formlist
 * Returns: { statusId, messager, data: FormListItem[], totalRow }
 */
export async function apiGetFormList(config, shopId) {
  const headers = buildHeaders(config);
  // Gửi shopId qua header
  headers['shopId'] = shopId.toString();
  const url = `${config.baseUrl}shop/formlist`;

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
    headers
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
    throw new Error(`GetFormList failed: statusId ${body.statusId} - ${body.messager || 'Unknown error'}`);
  }
  return body;
}
//# sourceMappingURL=useSFormApi.js.map