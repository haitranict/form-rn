# 📘 Hướng dẫn sử dụng @spiral/rn-form

## 1. Cài đặt module vào dự án React Native

### Cách 1: Từ local (development)
```bash
cd YourReactNativeProject
npm install ../path/to/ModuleApp/Form
# hoặc
yarn add file:../path/to/ModuleApp/Form
```

### Cách 2: Từ npm (sau khi publish)
```bash
npm install @spiral/rn-form
# hoặc
yarn add @spiral/rn-form
```

---

## 2. Sử dụng trong dự án

### 📄 Example 1: Form với Step-by-Step Mode (MOBILE RECOMMENDED)

```tsx
import React from 'react';
import { View } from 'react-native';
import { SFormResult } from '@spiral/rn-form';

export default function MyFormScreen() {
  const apiConfig = {
    baseURL: 'https://your-api.com',
    token: 'Bearer your-token',
  };

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId="abc123"
        apiConfig={apiConfig}
        displayMode="step"  // ⭐ Hiển thị từng câu một
        onSubmitSuccess={(resultId) => {
          console.log('Form submitted successfully:', resultId);
          // Navigate to success screen
        }}
        onSubmitError={(message) => {
          console.error('Form submission failed:', message);
        }}
      />
    </View>
  );
}
```

---

### 📄 Example 2: Form với All Questions Mode (như web)

```tsx
import React from 'react';
import { View } from 'react-native';
import { SFormResult } from '@spiral/rn-form';

export default function MyFormScreen() {
  const apiConfig = {
    baseURL: 'https://your-api.com',
    token: 'Bearer your-token',
  };

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId="abc123"
        apiConfig={apiConfig}
        displayMode="all"  // Hiển thị tất cả câu hỏi cùng lúc
        onSubmitSuccess={(resultId) => {
          console.log('Form submitted successfully:', resultId);
        }}
      />
    </View>
  );
}
```

---

### 📷 Example 3: Form với Camera (Dùng react-native-image-picker)

```tsx
import React from 'react';
import { View } from 'react-native';
import { SFormResult } from '@spiral/rn-form';
import { launchCamera } from 'react-native-image-picker';

export default function MyFormWithCamera() {
  const apiConfig = {
    baseURL: 'https://your-api.com',
    token: 'Bearer your-token',
  };

  const handleCameraCapture = (questionId: number, callback: (uri: string) => void) => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error:', response.errorMessage);
        } else if (response.assets?.[0]?.uri) {
          // Trả URI ảnh về Form
          callback(response.assets[0].uri);
        }
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId="abc123"
        apiConfig={apiConfig}
        onCameraCapture={handleCameraCapture}
        onSubmitSuccess={(resultId) => {
          console.log('Submitted:', resultId);
        }}
      />
    </View>
  );
}
```

---

### 📷 Example 4: Form với Camera (Dùng expo-image-picker)

```tsx
import React from 'react';
import { View } from 'react-native';
import { SFormResult } from '@spiral/rn-form';
import * as ImagePicker from 'expo-image-picker';

export default function MyFormWithExpoCamera() {
  const apiConfig = {
    baseURL: 'https://your-api.com',
    token: 'Bearer your-token',
  };

  const handleCameraCapture = async (
    questionId: number,
    callback: (uri: string) => void
  ) => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần cấp quyền camera để tiếp tục');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      callback(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId="abc123"
        apiConfig={apiConfig}
        onCameraCapture={handleCameraCapture}
      />
    </View>
  );
}
```

---

### 📷 Example 5: Form với Camera Custom (Vision Camera)

```tsx
import React, { useRef } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { SFormResult } from '@spiral/rn-form';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

export default function MyFormWithVisionCamera() {
  const [showCamera, setShowCamera] = React.useState(false);
  const [currentCallback, setCurrentCallback] = React.useState<((uri: string) => void) | null>(null);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const apiConfig = {
    baseURL: 'https://your-api.com',
    token: 'Bearer your-token',
  };

  const handleCameraCapture = (questionId: number, callback: (uri: string) => void) => {
    setCurrentCallback(() => callback);
    setShowCamera(true);
  };

  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
      });
      setShowCamera(false);
      if (currentCallback) {
        currentCallback(`file://${photo.path}`);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId="abc123"
        apiConfig={apiConfig}
        onCameraCapture={handleCameraCapture}
      />

      {/* Custom Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        {device && (
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            isActive={showCamera}
            photo={true}
          />
        )}
        <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={takePhoto}
            style={{ backgroundColor: '#fff', padding: 20, borderRadius: 50 }}
          >
            <Text>📷 Chụp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCamera(false)}
            style={{ marginTop: 10, padding: 10 }}
          >
            <Text style={{ color: '#fff' }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
```

---

## 3. Props API Reference

### SFormResult Props

| Prop | Type | Required | Mô tả |
|------|------|----------|-------|
| `formId` | `string` | ✅ | ID của form (từ URL query string) |
| `apiConfig` | `SFormApiConfig` | ✅ | Cấu hình API (baseURL, token) |
| `onSubmitSuccess` | `(resultId: number) => void` | ❌ | Callback khi submit thành công |
| `onSubmitError` | `(message: string) => void` | ❌ | Callback khi submit lỗi |
| `mode` | `'fill' \| 'view'` | ❌ | Chế độ: fill (mặc định) hoặc view-only |
| `dataInput` | `SFormData` | ❌ | Data trực tiếp (dùng khi mode='view') |
| `onCameraCapture` | `(questionId: number, callback: (uri: string) => void) => void` | ❌ | Handler để sử dụng camera của bạn |
| `displayMode` | `'all' \| 'step'` | ❌ | 'all': hiện tất cả câu (web), 'step': từng câu (mobile - mặc định) |
| `style` | `ViewStyle` | ❌ | Custom style cho container |

### SFormApiConfig

```typescript
interface SFormApiConfig {
  baseURL: string;          // API base URL
  token: string;            // Authentication token (Bearer xxx)
  getFormEndpoint?: string; // Custom endpoint (default: '/api/form/getbyid')
  submitEndpoint?: string;  // Custom endpoint (default: '/api/form/submit')
  uploadImageEndpoint?: string;
  uploadAudioEndpoint?: string;
}
```

---

## 4. Setup Dependencies (nếu cần Camera)

### Option A: react-native-image-picker
```bash
npm install react-native-image-picker
cd ios && pod install
```

### Option B: expo-image-picker (Expo)
```bash
npx expo install expo-image-picker
```

### Option C: react-native-vision-camera
```bash
npm install react-native-vision-camera
cd ios && pod install
```

Thêm permissions vào:
- **iOS**: `Info.plist`
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>Cần quyền camera để chụp ảnh</string>
  ```
- **Android**: `AndroidManifest.xml`
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  ```

---

## 5. Chạy ví dụ

```bash
cd YourReactNativeProject
npm install
npx react-native run-android
# hoặc
npx react-native run-ios
```

---

## 6. Troubleshooting

### Lỗi: "Module not found"
```bash
# Clear cache
npm start -- --reset-cache
```

### Lỗi: Camera không hoạt động
- Kiểm tra permissions trong Info.plist / AndroidManifest.xml
- Kiểm tra đã request permission runtime chưa
- Kiểm tra prop `onCameraCapture` đã truyền đúng chưa

---

## 📞 Support

Nếu cần hỗ trợ, vui lòng liên hệ team Spiral.
