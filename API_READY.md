# ✅ API đã được tích hợp thành công!

## 📋 API Structure

### Endpoint
```
GET /shop/formlist
```

### Headers
```json
{
  "shopId": "123",
  "Authorization": "Bearer your-token-here"
}
```

**Note:** Token luôn phải có `Authorization` header với format `Bearer {token}`

### Response
```json
{
  "code": 200,
  "message": "Get Form List",
  "data": [
    {
      "Id": 374,
      "Title": "Test Form",
      "SubTitle": "Description",
      "AccessKey": "2d2775de-0c81-43eb-96d4-4f04a241821b",
      "FromDate": 20260312,
      "ToDate": 20260331,
      "MMobile": 0,
      "InApp": 0,
      "WebUrl": "https://...",
      "publicUrl": "https://...",
      "formData": "[...]",
      "Banner": "{...}"
    }
  ]
}
```

## 🔑 Field Mapping

| API Field    | Component Usage          | Description                |
|-------------|--------------------------|----------------------------|
| `Id`        | `formId` (display)       | Form ID                    |
| `AccessKey` | `formKey` (fetch detail) | **KEY để lấy form chi tiết** |
| `Title`     | Form name                | Tên form hiển thị          |
| `SubTitle`  | Description              | Mô tả ngắn                 |
| `FromDate`  | Start date               | YYYYMMDD                   |
| `ToDate`    | End date                 | YYYYMMDD                   |

## 🚀 Quick Start

```tsx
import { SFormList, SFormResult } from '@spiral/rn-form';

const shopId = 123;
const [selected, setSelected] = useState(null);

// API Config với Authorization header
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer xxx', // Luôn có Authorization: Bearer {token}
};

// 1. Show List
if (!selected) {
  return (
    <SFormList
      shopId={shopId}
      apiConfig={apiConfig}
      onSelectForm={(formKey, shopId, item) => {
        setSelected({ formKey, shopId, item });
      }}
    />
  );
}

// 2. Show Detail
return (
  <SFormResult
    formId={selected.item.Id.toString()}
    formKey={selected.formKey}  // AccessKey
    shopId={shopId}
    apiConfig={...}
    displayMode="step"
    onSubmitSuccess={() => setSelected(null)}
  />
);
```

## ✨ Features

- ✅ GET request với shopId trong header
- ✅ Response parsing: `code` + `message` + `data[]`
- ✅ Field mapping: `AccessKey` → `formKey`
- ✅ Badge hiển thị: "Chưa làm" / "Hết hạn"
- ✅ Date formatting: YYYYMMDD → DD/MM/YYYY
- ✅ Auto-scroll list
- ✅ Error handling + retry
- ✅ Loading states

## 📦 Build Status

```
✔ Wrote files to lib/commonjs
✔ Wrote files to lib/module
✔ Wrote definition files to lib/typescript
```

## 📘 Documentation

- [AUTHORIZATION.md](AUTHORIZATION.md) - Chi tiết về Authorization header và token management
- [API_INTEGRATION_EXAMPLE.tsx](API_INTEGRATION_EXAMPLE.tsx) - Complete examples với API thực tế
- [FORMLIST_EXAMPLE.md](FORMLIST_EXAMPLE.md) - Usage examples
- [FORM_DETAIL_LOGIC.md](FORM_DETAIL_LOGIC.md) - Form detail logic

## 🧪 Ready to Test!

Module đã sẵn sàng để:
1. Test với API thực tế
2. Tích hợp vào app
3. Customization nếu cần

**Config Required:**
```typescript
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer your-token-here',  // Authorization header
};
```

**Headers gửi lên:**
- `Authorization`: `Bearer {token}` ← Luôn có
- `shopId`: `{shopId}` ← Specific cho FormList API
- `Content-Type`: `application/json`
