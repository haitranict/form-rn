# 🔧 FIX: Circular Dependency Error

## Vấn đề

Lỗi bạn gặp là **CIRCULAR DEPENDENCY** (import vòng tròn)

```
ERROR Line 212 in src/Component/Reports/Adhoc/FormList.js:
import { FormList } from '../Component/Reports/Adhoc/FormList.js'
```

File `FormList.js` đang import chính nó → Infinite loop!

## Module @spiral/rn-form KHÔNG CÓ LỖI ✅

Test vừa chạy xác nhận:
- ✅ Module build thành công
- ✅ SFormList exported đúng
- ✅ Import path `@spiral/rn-form` hoạt động bình thường

## Root Cause

File của bạn `src/Component/Reports/Adhoc/FormList.js` có **line 212** sai:

```javascript
// ❌ Line 212 - LỖI!
import { FormList } from '../Component/Reports/Adhoc/FormList.js';
```

Đây là **self-import** → Metro bundler không thể resolve → ERROR

## Giải pháp

### Bước 1: Tìm và xóa dòng import sai

Mở file trong project (KHÔNG PHẢI MODULE):
```
<your-project>/src/Component/Reports/Adhoc/FormList.js
```

Tìm **line 212**, xóa hoặc comment:
```javascript
// ❌ XÓA DÒNG NÀY
// import { FormList } from '../Component/Reports/Adhoc/FormList.js';
```

### Bước 2: Clear Metro cache

```bash
# Clear cache
npx react-native start --reset-cache

# Hoặc
rm -rf node_modules/.cache
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
```

### Bước 3: Rebuild app

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Code đúng của FormList.js

```typescript
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Token } from "../../../Extends/Helper";
import { SFormList } from '@spiral/rn-form';  // ← Import module
import { DEFAULT_URL } from "../../../Extends/URLs";

export default function FormList({ navigation }: any) {
    const { shopinfo } = useSelector<any, any>(state => state.theme);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Token()
            .then(res => {
                const tokenValue = res?.startsWith('Bearer ') ? res : `Bearer ${res}`;
                setToken(tokenValue);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching token:', err);
                setLoading(false);
            });
    }, []);

    if (loading || !token) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SFormList
            shopId={shopinfo?.shopId || 0}
            apiConfig={{
                baseUrl: DEFAULT_URL,
                token: token,
            }}
            onSelectForm={(formKey, shopId, item) => {
                navigation.navigate('formdetails', {
                    formKey,
                    shopId,
                    formName: item.Title,
                    formId: item.Id,
                });
            }}
        />
    );
}
```

## Verify module hoạt động

Chạy test trong module folder:

```bash
cd /Users/haitran/SpiralNew/ModuleApp/Form
npm run prepare
```

Kết quả phải là:
```
✔ Wrote files to lib/commonjs
✔ Wrote files to lib/module
✔ Wrote definition files to lib/typescript
```

## Common Mistakes

### ❌ Import sai path
```javascript
// Sai
import { SFormList } from '@spiral/rn-form/lib/typescript/sform/SFormList';
```

### ✅ Import đúng
```javascript
// Đúng
import { SFormList } from '@spiral/rn-form';
```

### ❌ Self-import
```javascript
// FormList.js
import { FormList } from './FormList';  // ← Lỗi!
```

### ❌ Circular import
```javascript
// A.js
import { B } from './B';

// B.js
import { A } from './A';  // ← Lỗi!
```

## Debug Steps

1. **Tìm file có lỗi:**
   ```bash
   cd <your-project>
   grep -rn "import.*FormList.*FormList.js" src/
   ```

2. **Check import paths:**
   ```bash
   grep -rn "from '@spiral/rn-form" src/
   ```

3. **View line 212:**
   ```bash
   sed -n '210,215p' src/Component/Reports/Adhoc/FormList.js
   ```

## Troubleshooting

### Nếu vẫn lỗi sau khi xóa line 212:

1. **Clear watchman:**
   ```bash
   watchman watch-del-all
   ```

2. **Clear all caches:**
   ```bash
   rm -rf node_modules
   rm -rf $TMPDIR/metro-*
   rm -rf $TMPDIR/react-*
   npm install
   ```

3. **Restart Metro:**
   ```bash
   npx react-native start --reset-cache
   ```

4. **Check for other circular imports:**
   ```bash
   npx madge --circular src/
   ```

## Module Status

✅ **Module @spiral/rn-form:**
- Build: OK
- Exports: OK
- SFormList: ✓ Available
- SFormResult: ✓ Available
- Types: ✓ Available

❌ **Your project:**
- Line 212: Circular import
- Metro bundler: Cannot resolve

## Next Steps

1. Xóa line 212 trong FormList.js
2. Clear cache: `npx react-native start --reset-cache`
3. Rebuild app
4. Test lại

## Support

Nếu sau khi fix vẫn lỗi, hãy:
1. Share full FormList.js file (không có line 212)
2. Share Metro bundler error log
3. Check `node_modules/@spiral/rn-form/lib/` có tồn tại không

---

**TL;DR:** Xóa line 212 trong FormList.js, clear cache, rebuild. Module không có bug!
