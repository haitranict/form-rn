# 🔐 Authorization Header

## Overview

Module `@spiral/rn-form` **luôn luôn** gửi Authorization header với mọi API request.

## Header Format

```typescript
{
  "Authorization": "Bearer {your-token-here}"
}
```

## Configuration

### Basic Setup

```typescript
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer abc123xyz',  // ← Authorization: Bearer abc123xyz
};
```

### Token Format

Token có thể được cấu hình theo 2 cách:

#### 1. Với prefix "Bearer" (Recommended)
```typescript
const apiConfig = {
  token: 'Bearer abc123xyz',
};
```
→ Header: `Authorization: Bearer abc123xyz`

#### 2. Không có prefix
```typescript
const apiConfig = {
  token: 'abc123xyz',
};
```
→ Header: `Authorization: Bearer abc123xyz` (tự động thêm)

**Module tự động thêm "Bearer" nếu chưa có!**

## Implementation Details

### Code trong useSFormApi.ts

```typescript
function buildHeaders(config: SFormApiConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (config.token) {
    // Auto-add "Bearer" prefix nếu chưa có
    headers['Authorization'] = config.token.startsWith('Bearer ')
      ? config.token
      : `Bearer ${config.token}`;
  }
  
  return headers;
}
```

### API Calls

Tất cả các API calls đều có Authorization header:

#### 1. GET /shop/formlist
```typescript
headers: {
  'Authorization': 'Bearer xxx',
  'shopId': '123',
}
```

#### 2. GET /api/SForm/GetById
```typescript
headers: {
  'Authorization': 'Bearer xxx',
  'Content-Type': 'application/json',
}
```

#### 3. POST /api/SForm/InsertResult
```typescript
headers: {
  'Authorization': 'Bearer xxx',
  'Content-Type': 'application/json',
}
```

#### 4. POST /api/SForm/UploadImages
```typescript
headers: {
  'Authorization': 'Bearer xxx',
  // No Content-Type (multipart/form-data tự động)
}
```

## Usage Examples

### Example 1: Static Token

```tsx
import { SFormList, SFormResult } from '@spiral/rn-form';

const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer static-token-here',
};

function MyApp() {
  return (
    <SFormList
      shopId={123}
      apiConfig={apiConfig}
      onSelectForm={(formKey, shopId) => {
        // ...
      }}
    />
  );
}
```

### Example 2: Dynamic Token (từ Auth Context)

```tsx
import { useAuth } from './AuthContext';
import { SFormList } from '@spiral/rn-form';

function MyApp() {
  const { token } = useAuth();  // Get từ context
  
  const apiConfig = {
    baseUrl: 'https://vnmmt.spiral.com.vn',
    token: `Bearer ${token}`,
  };

  return (
    <SFormList
      shopId={123}
      apiConfig={apiConfig}
      onSelectForm={() => {}}
    />
  );
}
```

### Example 3: Token Refresh

```tsx
import { useState, useEffect } from 'react';
import { SFormList } from '@spiral/rn-form';

function MyApp() {
  const [token, setToken] = useState('');
  
  useEffect(() => {
    // Refresh token periodically
    const interval = setInterval(async () => {
      const newToken = await refreshToken();
      setToken(newToken);
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(interval);
  }, []);

  const apiConfig = {
    baseUrl: 'https://vnmmt.spiral.com.vn',
    token: `Bearer ${token}`,
  };

  return token ? (
    <SFormList
      shopId={123}
      apiConfig={apiConfig}
      onSelectForm={() => {}}
    />
  ) : null;
}
```

## Authentication Flow

```
┌──────────────┐
│  App Start   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Login     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Get Token from API  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Save Token to Context/State │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Create apiConfig with Token │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Use SFormList/SFormResult│
│  với apiConfig            │
└───────────────────────────┘
```

## Error Handling

### 401 Unauthorized

Nếu token không hợp lệ hoặc hết hạn:

```typescript
try {
  const result = await apiGetFormList(apiConfig, shopId);
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired or invalid
    // → Redirect to login
    // → Show error message
  }
}
```

### Missing Token

Nếu không có token:

```typescript
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  // token: undefined  ← Authorization header sẽ KHÔNG được gửi
};
```

**Warning:** API sẽ trả về 401 nếu backend yêu cầu authentication!

## Best Practices

### ✅ DO

1. **Luôn có token khi khởi tạo apiConfig**
   ```typescript
   const apiConfig = { baseUrl, token: 'Bearer xxx' };
   ```

2. **Get token từ secure storage**
   ```typescript
   const token = await SecureStore.getItemAsync('auth_token');
   ```

3. **Refresh token trước khi hết hạn**
   ```typescript
   if (isTokenExpiringSoon(token)) {
     token = await refreshToken();
   }
   ```

4. **Handle 401 errors gracefully**
   ```typescript
   catch (error) {
     if (error.status === 401) {
       logout();
     }
   }
   ```

### ❌ DON'T

1. **Không hardcode token vào source code**
   ```typescript
   // ❌ Bad
   const token = 'Bearer abc123xyz';
   ```

2. **Không share token giữa users**
   ```typescript
   // ❌ Bad - mỗi user phải có token riêng
   ```

3. **Không log token ra console**
   ```typescript
   // ❌ Bad
   console.log('Token:', token);
   ```

4. **Không store token trong AsyncStorage plain text**
   ```typescript
   // ❌ Bad - use SecureStore instead
   await AsyncStorage.setItem('token', token);
   ```

## Testing

### Test với Mock Token

```typescript
const mockConfig = {
  baseUrl: 'http://localhost:3000',
  token: 'Bearer mock-token-for-testing',
};
```

### Test Authorization Header

```typescript
import { apiGetFormList } from '@spiral/rn-form';

test('should send Authorization header', async () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;
  
  await apiGetFormList(apiConfig, 123);
  
  expect(mockFetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer mock-token',
      }),
    })
  );
});
```

## Security Notes

1. **Token storage**: Sử dụng `expo-secure-store` hoặc `react-native-keychain`
2. **Token transmission**: Luôn dùng HTTPS (không HTTP)
3. **Token expiration**: Implement refresh token mechanism
4. **Token scope**: Mỗi user riêng token, không share

## Summary

- ✅ Authorization header luôn được gửi với mọi API request
- ✅ Format: `Authorization: Bearer {token}`
- ✅ Module tự động thêm "Bearer" prefix nếu chưa có
- ✅ Token là **required** cho production API
- ✅ Cần handle token refresh và 401 errors

## See Also

- [API_READY.md](API_READY.md) - API integration guide
- [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx) - Complete navigation example
- [API_INTEGRATION_EXAMPLE.tsx](API_INTEGRATION_EXAMPLE.tsx) - API usage examples
