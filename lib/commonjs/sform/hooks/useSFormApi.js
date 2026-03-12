"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiGetFormById = apiGetFormById;
exports.apiGetFormList = apiGetFormList;
exports.apiGetShops = apiGetShops;
exports.apiInsertResult = apiInsertResult;
exports.apiUploadAudio = apiUploadAudio;
exports.apiUploadImages = apiUploadImages;
// ============================================================
// SForm API Service
// Cấu hình BASE_URL tại entry point hoặc truyền vào hook
// ============================================================

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
 * GetById - Lấy form theo domain/id
 * GET /api/SForm/GetById?id={formId}
 */
async function apiGetFormById(config, formId) {
  const res = await fetch(`${config.baseUrl}/api/SForm/GetById?${formId}`, {
    headers: buildHeaders(config)
  });
  if (!res.ok) throw new Error(`GetById failed: ${res.status}`);
  return res.json();
}

/**
 * GetShops - Lấy danh sách cửa hàng theo accountId + employeeId
 * POST /api/SForm/GetShops
 */
async function apiGetShops(config, data) {
  const res = await fetch(`${config.baseUrl}/api/SForm/GetShops`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`GetShops failed: ${res.status}`);
  return res.json();
}

/**
 * InsertResult - Submit form
 * POST /api/SForm/InsertResult
 */
async function apiInsertResult(config, payload) {
  const res = await fetch(`${config.baseUrl}/api/SForm/InsertResult`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`InsertResult failed: ${res.status}`);
  return res.json();
}

/**
 * UploadImages - Upload ảnh từ gallery/camera
 * POST /api/SForm/UploadImages (multipart/form-data)
 */
async function apiUploadImages(config, files) {
  const formData = new FormData();
  files.forEach(file => {
    // React Native FormData accepts { uri, name, type }
    formData.append('files', file);
  });
  const headers = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ') ? config.token : `Bearer ${config.token}`;
  }
  const res = await fetch(`${config.baseUrl}/api/SForm/UploadImages`, {
    method: 'POST',
    headers,
    body: formData
  });
  if (!res.ok) throw new Error(`UploadImages failed: ${res.status}`);
  return res.json();
}

/**
 * UploadAudio - Upload audio files
 * POST /api/SForm/UploadAudio (multipart/form-data)
 */
async function apiUploadAudio(config, files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  const headers = {};
  if (config.token) {
    headers['Authorization'] = config.token.startsWith('Bearer ') ? config.token : `Bearer ${config.token}`;
  }
  const res = await fetch(`${config.baseUrl}/api/SForm/UploadAudio`, {
    method: 'POST',
    headers,
    body: formData
  });
  if (!res.ok) throw new Error(`UploadAudio failed: ${res.status}`);
  return res.json();
}

/**
 * GetList - Lấy danh sách form khảo sát theo shopId
 * GET /shop/formlist
 */
async function apiGetFormList(config, shopId) {
  const headers = buildHeaders(config);
  // Gửi shopId qua header
  headers['shopId'] = shopId.toString();
  const res = await fetch(`${config.baseUrl}/shop/formlist`, {
    method: 'GET',
    headers
  });
  if (!res.ok) throw new Error(`GetList failed: ${res.status}`);
  return res.json();
}
//# sourceMappingURL=useSFormApi.js.map