# API Response Structure - 2-Layer Status Checking

## 📊 Cấu trúc API Response

API Spiral sử dụng **2 layers của status code** để báo lỗi chi tiết:

### Layer 1: HTTP Status Code
```
200 OK          - Request thành công
404 Not Found   - Endpoint không tồn tại
500 Server Error - Lỗi server
401 Unauthorized - Token invalid/expired
```

### Layer 2: Business Status Code (trong response body)
```json
{
  "statusId": 200,         // Business status
  "messager": "Success",   // Business message (typo: 'messager' not 'message')
  "data": [...],           // Actual data
  "totalRow": 72           // (optional) Total count
}
```

---

## ✅ Flow kiểm tra đúng

```typescript
// ❌ SAI - Chỉ check HTTP status
const res = await fetch(url);
if (!res.ok) throw new Error('Failed');
return res.json(); // Không check statusId!

// ✅ ĐÚNG - Check cả 2 layers
const res = await fetch(url);

// Layer 1: HTTP status
if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}

// Layer 2: Business status
const body = await res.json();
if (body.statusId !== 200) {
  throw new Error(`Business error: ${body.messager}`);
}

return body.data; // hoặc return body
```

---

## 🔧 Implementation trong module

### Helper Function: `handleApiResponse<T>`

```typescript
async function handleApiResponse<T>(
  res: Response,
  apiName: string
): Promise<T> {
  // Layer 1: HTTP status
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`${apiName} failed: HTTP ${res.status} - ${errorBody}`);
  }

  // Layer 2: Business status
  const body = await res.json();
  
  if (typeof body.statusId !== 'undefined') {
    // Response has wrapper
    if (body.statusId !== 200) {
      throw new Error(
        `${apiName} failed: statusId ${body.statusId} - ${body.messager}`
      );
    }
    return body.data; // Unwrap data
  }

  // Direct response (no wrapper)
  return body;
}
```

### Usage trong API functions

```typescript
// ✅ GetFormList - Trả về full wrapper
export async function apiGetFormList(config, shopId) {
  const res = await fetch(url, { headers });
  
  // Check HTTP
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
  // Check business status
  const body = await res.json();
  if (body.statusId !== 200) {
    throw new Error(`statusId ${body.statusId} - ${body.messager}`);
  }
  
  return body; // { statusId, messager, data, totalRow }
}

// ✅ GetById - Unwrap data
export async function apiGetFormById(config, formId) {
  const res = await fetch(url, { headers });
  return handleApiResponse<SFormData>(res, 'GetById');
  // Returns: SFormData (unwrapped)
}
```

---

## 📝 Các trường hợp lỗi

### Case 1: HTTP Error (Network/Auth)
```json
HTTP 401 Unauthorized
Body: "The token expired at '03/13/2026 06:11:59'"

→ Lỗi ở Layer 1
→ Error: "GetFormList failed: HTTP 401 - The token expired..."
```

### Case 2: Business Error (Logic)
```json
HTTP 200 OK
Body: {
  "statusId": 400,
  "messager": "Shop không tồn tại",
  "data": null
}

→ HTTP OK nhưng business error
→ Error: "GetFormList failed: statusId 400 - Shop không tồn tại"
```

### Case 3: Success
```json
HTTP 200 OK
Body: {
  "statusId": 200,
  "messager": "Get Form List",
  "data": [72 forms...],
  "totalRow": 72
}

→ Cả 2 layers OK
→ Return: body hoặc body.data (tùy API)
```

---

## 🎯 Best Practices

### ✅ DO:
- Check cả HTTP status và statusId
- Log cả 2 layers khi debug
- Throw error với context rõ ràng
- Handle error trong .catch() của promise

### ❌ DON'T:
- Chỉ check HTTP status và return luôn
- Assume statusId luôn là 200
- Ignore error messages từ API
- Log sensitive data (token, password)

---

## 🐛 Debug Checklist

Khi gặp lỗi API, check theo thứ tự:

1. **HTTP Status** - Console sẽ log: `Status: 200 OK`
   - Nếu không phải 200: Lỗi network/auth/server
   
2. **Response Body** - Console sẽ log: `statusId: 200`
   - Nếu không phải 200: Lỗi business logic
   
3. **Data** - Console sẽ log: `data count: 72`
   - Nếu null/empty: Không có dữ liệu

4. **Error Message** - Check `messager` field
   - Thường chứa lý do lỗi từ backend

---

## 📚 Related Files

- `src/sform/hooks/useSFormApi.ts` - All API functions với 2-layer checking
- `src/sform/SFormList.tsx` - Usage example cho GetFormList
- `src/sform/SFormResult.tsx` - Usage example cho GetById
- `src/sform/types/sform.types.ts` - Type definitions

---

## 💡 Tips

1. **Token expiry**: Thường trả HTTP 401 hoặc statusId 401
2. **Shop invalid**: Thường trả statusId 400 với messager cụ thể
3. **Form not found**: GetById trả data.id = 0 (special case)
4. **Network timeout**: Throw ở fetch level, không có response

---

Built with ❤️ for robust error handling
