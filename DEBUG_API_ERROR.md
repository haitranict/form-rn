# 🐛 Debug: SFormList API Error

## Đã update module với error logging!

Module vừa được update với:
- ✅ Console.log chi tiết API request/response
- ✅ Alert hiển thị lỗi và thông tin debug
- ✅ Error message rõ ràng hơn

## 🔄 Update Module trong Project

```bash
cd <your-project>

# Clear cache
npm cache clean --force

# Update module từ git
npm install git+https://github.com/haitranict/form-rn.git#main --force

# Clear Metro
rm -rf $TMPDIR/metro-* $TMPDIR/react-*
npx react-native start --reset-cache
```

## 🧪 Test và xem lỗi chi tiết

Sau khi update, chạy lại app và check:

### 1. Console Log
Mở Metro bundler console, bạn sẽ thấy:
```
SFormList - Loading forms... { shopId: 123, baseUrl: 'https://...' }
SFormList - API Response: {...}
```

Hoặc nếu lỗi:
```
SFormList - Error: [Chi tiết lỗi]
```

### 2. Alert Dialog
App sẽ hiển thị alert với thông tin:
```
Lỗi: [Message]

Debug:
- shopId: 123
- baseUrl: https://...
- token: có/không
```

## 🔍 Common Errors & Solutions

### Error 1: "Failed to fetch" hoặc "Network request failed"

**Nguyên nhân:** API endpoint không đúng hoặc không truy cập được

**Check:**
```typescript
// FormList.js
const apiConfig = {
  baseUrl: DEFAULT_URL,  // ← Check URL này
  token: token,
};

console.log('API Config:', apiConfig);
```

**Fix:**
- URL phải có `https://` (không phải `http://`)
- URL không có trailing slash: `https://api.com` (không phải `https://api.com/`)
- Check network connection

### Error 2: "401 Unauthorized" hoặc "403 Forbidden"

**Nguyên nhân:** Token không hợp lệ hoặc thiếu

**Check:**
```typescript
console.log('Token:', token);
// Phải là: "Bearer xxx..."
```

**Fix:**
```typescript
useEffect(() => {
  Token().then(res => {
    console.log('Raw token:', res);
    const tokenValue = res?.startsWith('Bearer ') 
      ? res 
      : `Bearer ${res}`;
    console.log('Final token:', tokenValue);
    setToken(tokenValue);
  });
}, []);
```

### Error 3: "404 Not Found"

**Nguyên nhân:** API endpoint path sai

**Check:**
- API path: `/shop/formlist`
- Full URL: `${baseUrl}/shop/formlist`

**Fix:**
```typescript
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',  // ← Không có /api
  // API sẽ gọi: https://vnmmt.spiral.com.vn/shop/formlist
};
```

### Error 4: "shopId is required"

**Nguyên nhân:** shopId = 0 hoặc undefined

**Check:**
```typescript
const { shopinfo } = useSelector(state => state.theme);
console.log('Shop info:', shopinfo);
console.log('Shop ID:', shopinfo?.shopId);
```

**Fix:**
```typescript
return (
  <SFormList
    shopId={shopinfo?.shopId || 0}  // ← shopId phải > 0
    apiConfig={apiConfig}
    onSelectForm={...}
  />
);
```

### Error 5: CORS Error (Trong development)

**Nguyên nhân:** API không cho phép request từ app

**Fix:** Contact backend để enable CORS hoặc thêm headers

### Error 6: "Unexpected token < in JSON"

**Nguyên nhân:** API trả về HTML thay vì JSON (thường là 404 page)

**Check:**
```typescript
// useSFormApi.ts
const res = await fetch(`${config.baseUrl}/shop/formlist`, ...);
const text = await res.text();
console.log('Response text:', text);
```

## 📋 Debug Checklist

Hãy check từng bước:

- [ ] Module đã update (version mới nhất)
- [ ] apiConfig.baseUrl đúng
- [ ] apiConfig.token có giá trị (bắt đầu với "Bearer")
- [ ] shopId > 0
- [ ] Network connection OK
- [ ] API endpoint `/shop/formlist` tồn tại
- [ ] Backend server đang chạy

## 🧰 Test API trực tiếp

Test API bằng curl:

```bash
# Test without token
curl -X GET "https://vnmmt.spiral.com.vn/shop/formlist" \
  -H "shopId: 123"

# Test with token
curl -X GET "https://vnmmt.spiral.com.vn/shop/formlist" \
  -H "shopId: 123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response phải là:
```json
{
  "code": 200,
  "message": "Get Form List",
  "data": [...]
}
```

## 📞 Share Debug Info

Nếu vẫn lỗi, share info này:

```
1. Console log output:
   SFormList - Loading forms... {...}
   SFormList - Error: ...

2. Alert message:
   [Screenshot của alert]

3. API Config:
   - baseUrl: ...
   - token: có/không
   - shopId: ...

4. Network tab:
   [Screenshot network request failed]
```

## ⚡ Quick Fix Commands

```bash
# Full reset
cd <your-project>
rm -rf node_modules/@spiral
npm cache clean --force
npm install git+https://github.com/haitranict/form-rn.git#main
watchman watch-del-all
rm -rf $TMPDIR/metro-* $TMPDIR/react-*
npx react-native start --reset-cache

# Trong terminal khác
npx react-native run-android  # hoặc run-ios
```

---

**Next:** Sau khi update và test lại, share console log để mình xem lỗi cụ thể!
