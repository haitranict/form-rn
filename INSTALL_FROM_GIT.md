# 📦 Install @spiral/rn-form từ Git

## Quick Install

```bash
cd <your-project>

# Replace <git-url> với URL repo của bạn
npm install git+https://github.com/yourusername/rn-form.git

# Hoặc với specific version
npm install git+https://github.com/yourusername/rn-form.git#v1.0.0
```

## Step-by-Step

### 1. Update package.json

```json
{
  "name": "your-app",
  "dependencies": {
    "@spiral/rn-form": "git+https://github.com/yourusername/rn-form.git#v1.0.0",
    "react": "^18.0.0",
    "react-native": "^0.72.0"
  }
}
```

### 2. Install dependencies

```bash
npm install
```

### 3. Clear Metro cache

```bash
npx react-native start --reset-cache
```

### 4. Rebuild app

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Usage Example

### FormList.js (Your Project)

```typescript
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { SFormList } from '@spiral/rn-form';  // ← Import từ git
import { Token } from '../../../Extends/Helper';
import { DEFAULT_URL } from '../../../Extends/URLs';

export default function FormList({ navigation }) {
    const { shopinfo } = useSelector(state => state.theme);
    const [token, setToken] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Token()
            .then(res => {
                const tokenValue = res?.startsWith('Bearer ') 
                    ? res 
                    : `Bearer ${res}`;
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

### FormDetails.js (Your Project)

```typescript
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SFormResult } from '@spiral/rn-form';  // ← Import từ git
import { Token } from '../../../Extends/Helper';
import { DEFAULT_URL } from '../../../Extends/URLs';

export default function FormDetails({ route, navigation }) {
    const { formKey, shopId, formName, formId } = route.params;
    const [token, setToken] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Token()
            .then(res => {
                const tokenValue = res?.startsWith('Bearer ') 
                    ? res 
                    : `Bearer ${res}`;
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
        <SFormResult
            formId={formId.toString()}
            formKey={formKey}
            shopId={shopId}
            apiConfig={{
                baseUrl: DEFAULT_URL,
                token: token,
            }}
            displayMode="step"
            onSubmitSuccess={(resultId) => {
                console.log('Form submitted:', resultId);
                navigation.goBack();
            }}
        />
    );
}
```

## Troubleshooting

### Error: Cannot find module '@spiral/rn-form'

**Solution 1: Clear cache**
```bash
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

**Solution 2: Check node_modules**
```bash
ls -la node_modules/@spiral/rn-form
```

Nếu folder không tồn tại:
```bash
npm cache clean --force
npm install git+<your-git-url>
```

### Error: Metro bundler circular dependency

**Solution:**
1. Check file `FormList.js` trong project
2. Xóa dòng import sai (nếu có):
   ```javascript
   // ❌ XÓA dòng này nếu có
   // import { FormList } from '../Component/Reports/Adhoc/FormList.js';
   ```
3. Clear cache:
   ```bash
   watchman watch-del-all
   rm -rf $TMPDIR/metro-*
   rm -rf $TMPDIR/react-*
   npx react-native start --reset-cache
   ```

### Error: Build failed with TypeScript

**Solution:** Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Error: Git authentication

**Solution 1: Use HTTPS with token**
```bash
npm install git+https://<token>@github.com/yourusername/rn-form.git
```

**Solution 2: Use SSH**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub/GitLab
cat ~/.ssh/id_ed25519.pub

# Install with SSH
npm install git+ssh://git@github.com/yourusername/rn-form.git
```

## Update Module

Khi có update mới từ module:

```bash
cd <your-project>

# Clear cache
npm cache clean --force

# Update
npm install git+<your-git-url>#v1.0.1

# Clear Metro
npx react-native start --reset-cache

# Rebuild
npx react-native run-android  # or run-ios
```

## Common Git URLs

### GitHub
```
HTTPS: git+https://github.com/username/rn-form.git
SSH:   git+ssh://git@github.com/username/rn-form.git
```

### GitLab
```
HTTPS: git+https://gitlab.com/username/rn-form.git
SSH:   git+ssh://git@gitlab.com/username/rn-form.git
```

### Bitbucket
```
HTTPS: git+https://bitbucket.org/username/rn-form.git
SSH:   git+ssh://git@bitbucket.org/username/rn-form.git
```

### Private Git Server
```
SSH: git+ssh://git@your-server.com/path/to/rn-form.git
```

## Best Practices

1. **Lock version** trong package.json:
   ```json
   "@spiral/rn-form": "git+<url>#v1.0.0"
   ```

2. **Clear cache sau mỗi update**:
   ```bash
   npx react-native start --reset-cache
   ```

3. **Check module version**:
   ```bash
   npm list @spiral/rn-form
   ```

4. **Backup package-lock.json**:
   ```bash
   git add package-lock.json
   ```

## Need Help?

Check documentation trong module:
- 📖 [GIT_SETUP.md](GIT_SETUP.md) - Git setup guide
- 📖 [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx) - Navigation integration
- 📖 [AUTHORIZATION.md](AUTHORIZATION.md) - Authorization setup
- 📖 [API_READY.md](API_READY.md) - API integration
- 📖 [FIX_CIRCULAR_DEPENDENCY.md](FIX_CIRCULAR_DEPENDENCY.md) - Fix common errors
