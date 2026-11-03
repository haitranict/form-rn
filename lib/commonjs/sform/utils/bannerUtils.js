"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBannerImageUrl = getBannerImageUrl;
exports.parseBanner = parseBanner;
// ============================================================
// Banner helpers - parse banner từ API thành URL hiển thị được
// ============================================================
// Banner có thể về dưới nhiều dạng khác nhau tuỳ API:
//  - JSON object string: {"imageURL":"https://...","imageHeight":331}
//  - JSON bị encode 2 lần: "{\"imageURL\":\"...\"}"
//  - URL trực tiếp: https://.../banner.jpg
//  - Đường dẫn tương đối: uploaded/20260417/banner.jpg (cần ghép webUrl)
//  - Chỉ có imageData base64
//  - Key khác hoa/thường: ImageURL, imageUrl, url
// ============================================================

const DEFAULT_BASE_URL = 'https://vnmpg.spiral.com.vn';
/** Fix URL thiếu dấu / giữa uploaded và thư mục ngày: /uploaded20260417/ → /uploaded/20260417/ */
function normalizeUploadUrl(url) {
  return url.replace(/\/uploaded(\d{8})\//, '/uploaded/$1/');
}
function resolveUrl(raw, baseUrl) {
  const url = raw.trim();
  if (!url) return null;
  if (url.startsWith('data:image')) return url;
  if (/^https?:\/\//i.test(url)) return normalizeUploadUrl(url);
  if (url.startsWith('//')) return normalizeUploadUrl(`https:${url}`);
  if (url.startsWith('file://')) return url;
  // Relative path → ghép với baseUrl
  const base = (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
  return normalizeUploadUrl(`${base}/${url.replace(/^\/+/, '')}`);
}
function pickFromObject(obj, baseUrl) {
  const rawUrl = obj.imageURL ?? obj.ImageURL ?? obj.imageUrl ?? obj.url ?? obj.Url ?? null;
  const rawHeight = obj.imageHeight ?? obj.ImageHeight ?? null;
  const height = rawHeight && Number(rawHeight) > 0 ? Number(rawHeight) : null;
  if (typeof rawUrl === 'string' && rawUrl.trim()) {
    return {
      url: resolveUrl(rawUrl, baseUrl),
      height
    };
  }
  const imageData = obj.imageData ?? obj.ImageData ?? null;
  if (typeof imageData === 'string' && imageData.trim()) {
    const data = imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    return {
      url: data,
      height
    };
  }
  return {
    url: null,
    height
  };
}

/**
 * Parse banner từ API → { url, height }
 */
function parseBanner(banner, baseUrl) {
  if (!banner) return {
    url: null,
    height: null
  };
  if (typeof banner === 'object') {
    return pickFromObject(banner, baseUrl);
  }
  if (typeof banner !== 'string') return {
    url: null,
    height: null
  };
  const str = banner.trim();
  if (!str || str === 'null' || str === 'undefined') return {
    url: null,
    height: null
  };

  // Thử parse JSON (có thể bị encode nhiều lần)
  let value = str;
  for (let i = 0; i < 3 && typeof value === 'string'; i++) {
    const s = value.trim();
    if (!(s.startsWith('{') || s.startsWith('"') || s.startsWith('['))) break;
    try {
      value = JSON.parse(s);
    } catch {
      break;
    }
  }
  if (Array.isArray(value)) value = value[0];
  if (value && typeof value === 'object') {
    return pickFromObject(value, baseUrl);
  }
  if (typeof value === 'string') {
    return {
      url: resolveUrl(value, baseUrl),
      height: null
    };
  }
  return {
    url: null,
    height: null
  };
}

/** Shortcut chỉ lấy URL */
function getBannerImageUrl(banner, baseUrl) {
  return parseBanner(banner, baseUrl).url;
}
//# sourceMappingURL=bannerUtils.js.map