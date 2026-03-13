# 📦 Publish Module lên Git và Install

## Bước 1: Setup Git Repository

### 1.1. Initialize Git
```bash
cd /Users/haitran/SpiralNew/ModuleApp/Form
git init
```

### 1.2. Add files
```bash
git add .
git commit -m "Initial commit: @spiral/rn-form v1.0.0"
```

### 1.3. Create Remote Repository

**Option A: GitHub**
1. Tạo repo mới tại https://github.com/new
2. Tên repo: `rn-form` (hoặc tên bạn muốn)
3. Visibility: Private hoặc Public
4. Không tạo README (đã có)

**Option B: GitLab**
1. Tạo project mới
2. Tên: `rn-form`

**Option C: Bitbucket**
1. Create repository
2. Name: `rn-form`

### 1.4. Push to Remote
```bash
# GitHub (thay <username> bằng username của bạn)
git remote add origin https://github.com/<username>/rn-form.git
git branch -M main
git push -u origin main

# Hoặc GitLab
git remote add origin https://gitlab.com/<username>/rn-form.git
git branch -M main
git push -u origin main

# Hoặc Bitbucket
git remote add origin https://bitbucket.org/<username>/rn-form.git
git branch -M main
git push -u origin main
```

## Bước 2: Install từ Git trong Project

### 2.1. Với HTTPS (Public Repo)

Trong project của bạn:

```bash
cd <your-project>
npm install git+https://github.com/<username>/rn-form.git

# Hoặc với branch cụ thể
npm install git+https://github.com/<username>/rn-form.git#main

# Hoặc với tag/version
npm install git+https://github.com/<username>/rn-form.git#v1.0.0
```

### 2.2. Với SSH (Private Repo)

```bash
npm install git+ssh://git@github.com/<username>/rn-form.git
```

### 2.3. Update package.json

```json
{
  "dependencies": {
    "@spiral/rn-form": "git+https://github.com/<username>/rn-form.git#main"
  }
}
```

## Bước 3: Sử dụng trong Project

### 3.1. Import như bình thường

```typescript
import { SFormList, SFormResult } from '@spiral/rn-form';
```

### 3.2. Metro Config (QUAN TRỌNG!)

Tạo/update file `metro.config.js` trong project:

```javascript
const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  
  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      // Giải quyết vấn đề với git dependencies
      sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    },
  };
})();
```

### 3.3. Clear cache và rebuild

```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear watchman
watchman watch-del-all

# Reinstall
rm -rf node_modules
npm install

# Rebuild
npx react-native run-android
# hoặc
npx react-native run-ios
```

## Bước 4: Update Module (Khi có thay đổi)

### 4.1. Commit và push thay đổi

```bash
cd /Users/haitran/SpiralNew/ModuleApp/Form

# Thay đổi version trong package.json
# "version": "1.0.1"

# Build lại
npm run prepare

# Commit
git add .
git commit -m "Update to v1.0.1"
git tag v1.0.1
git push origin main --tags
```

### 4.2. Update trong project

```bash
cd <your-project>

# Cache clean
npm cache clean --force

# Update module
npm install git+https://github.com/<username>/rn-form.git#v1.0.1

# Hoặc dùng npm update
npm update @spiral/rn-form

# Clear và rebuild
npx react-native start --reset-cache
```

## Bước 5: Troubleshooting

### 5.1. Error: Cannot find module

**Fix:**
```bash
cd <your-project>
rm -rf node_modules/@spiral
npm install
```

### 5.2. Metro bundler cache issues

**Fix:**
```bash
# Clear all caches
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
watchman watch-del-all

# Reinstall
npm install
npx react-native start --reset-cache
```

### 5.3. Build errors với TypeScript

**Fix:** Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

### 5.4. Git authentication errors

**Fix:**
```bash
# Setup SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy và add vào GitHub/GitLab SSH keys

# Hoặc dùng HTTPS với token
git remote set-url origin https://<token>@github.com/<username>/rn-form.git
```

## Best Practices

### 1. Versioning
Luôn dùng semantic versioning:
- **1.0.0** - Major.Minor.Patch
- **1.0.1** - Bug fixes
- **1.1.0** - New features
- **2.0.0** - Breaking changes

### 2. Tagging
Tag mỗi release:
```bash
git tag v1.0.0
git push origin --tags
```

### 3. Changelog
Maintain CHANGELOG.md:
```markdown
## [1.0.1] - 2026-03-12
### Fixed
- Fix circular dependency issue

### Added
- Add authorization header documentation
```

### 4. Lock version trong project
```json
{
  "dependencies": {
    "@spiral/rn-form": "git+https://github.com/<username>/rn-form.git#v1.0.0"
  }
}
```

## Quick Commands

```bash
# Setup git
cd /Users/haitran/SpiralNew/ModuleApp/Form
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-url>
git push -u origin main

# Install in project
cd <your-project>
npm install git+<your-git-url>

# Update module
cd /Users/haitran/SpiralNew/ModuleApp/Form
npm run prepare
git add .
git commit -m "Update"
git push

# Update in project
cd <your-project>
npm update @spiral/rn-form
npx react-native start --reset-cache
```

## Alternative: npm publish

Nếu muốn publish lên npm registry:

```bash
# Login
npm login

# Publish
npm publish --access public
```

Nhưng với org scope (@spiral), cần:
1. Tạo org trên npm
2. Hoặc đổi name thành `rn-form-spiral`

---

**Recommended:** Dùng Git URL cho internal projects, npm publish cho public packages.
