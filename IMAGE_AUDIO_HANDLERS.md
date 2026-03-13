# Image & Audio Handlers Guide

Hướng dẫn tích hợp các chức năng chụp ảnh, chọn ảnh, ghi âm và chọn file audio cho form.

## Tổng quan

Module form hỗ trợ 4 callbacks để parent app có thể inject các chức năng media:

1. **onPickImageFromGallery** - Chọn ảnh từ thư viện
2. **onCaptureImageFromCamera** - Chụp ảnh trực tiếp
3. **onRecordAudio** - Ghi âm trực tiếp
4. **onPickAudioFromFiles** - Chọn file audio từ document

## Cài đặt Dependencies

```bash
# Image Picker (cho gallery và camera)
npm install react-native-image-picker
npx pod-install

# Document Picker (cho audio files)
npm install react-native-document-picker
npx pod-install

# Audio Recorder (tùy chọn - cho ghi âm)
npm install react-native-audio-recorder-player
npx pod-install
```

## Permissions

### iOS (ios/YourApp/Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Cần quyền camera để chụp ảnh cho form</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Cần quyền truy cập thư viện để chọn ảnh</string>
<key>NSMicrophoneUsageDescription</key>
<string>Cần quyền microphone để ghi âm</string>
```

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Implementation Example

```tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { SFormResult } from '@spiral/rn-form';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export function FormWithMediaHandlers() {
  const [recording, setRecording] = useState(false);

  // ============================================
  // IMAGE HANDLERS
  // ============================================
  
  const handlePickImageFromGallery = (
    questionId: number,
    callback: (imageUri: string) => void
  ) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
        } else if (response.assets && response.assets[0]) {
          const uri = response.assets[0].uri;
          if (uri) {
            callback(uri);
            // TODO: Upload to server nếu cần
          }
        }
      }
    );
  };

  const handleCaptureImageFromCamera = (
    questionId: number,
    callback: (imageUri: string) => void
  ) => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          Alert.alert('Lỗi', response.errorMessage || 'Không thể chụp ảnh');
        } else if (response.assets && response.assets[0]) {
          const uri = response.assets[0].uri;
          if (uri) {
            callback(uri);
            // TODO: Upload to server nếu cần
          }
        }
      }
    );
  };

  // ============================================
  // AUDIO HANDLERS
  // ============================================

  const handleRecordAudio = async (
    questionId: number,
    callback: (audioUri: string) => void
  ) => {
    if (recording) {
      // Stop recording
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      
      if (result) {
        callback(result);
        Alert.alert('Thành công', 'Đã ghi âm xong');
        // TODO: Upload to server nếu cần
      }
    } else {
      // Start recording
      try {
        const path = `audio_${questionId}_${Date.now()}.m4a`;
        const uri = await audioRecorderPlayer.startRecorder(path);
        
        audioRecorderPlayer.addRecordBackListener((e) => {
          console.log('Recording...', e.currentPosition);
        });
        
        setRecording(true);
        Alert.alert('Đang ghi', 'Nhấn lại để dừng ghi âm');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể ghi âm: ' + error);
      }
    }
  };

  const handlePickAudioFromFiles = async (
    questionId: number,
    callback: (audioUri: string) => void
  ) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'documentDirectory',
      });

      if (result && result[0]) {
        const uri = result[0].fileCopyUri || result[0].uri;
        callback(uri);
        // TODO: Upload to server nếu cần
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Lỗi', 'Không thể chọn file audio');
      }
    }
  };

  // ============================================
  // FORM COMPONENT
  // ============================================

  return (
    <SFormResult
      formId="your-form-id"
      apiConfig={{
        baseUrl: 'https://api.example.com',
        token: 'your-token',
      }}
      // Image handlers
      onPickImageFromGallery={handlePickImageFromGallery}
      onCaptureImageFromCamera={handleCaptureImageFromCamera}
      // Audio handlers
      onRecordAudio={handleRecordAudio}
      onPickAudioFromFiles={handlePickAudioFromFiles}
      // Other handlers
      onSubmitSuccess={(resultId) => {
        console.log('Form submitted:', resultId);
      }}
      onSubmitError={(message) => {
        Alert.alert('Lỗi', message);
      }}
    />
  );
}
```

## Upload to Server

Callbacks hiện tại chỉ trả về local URI. Nếu cần upload lên server, bạn có thể:

```tsx
const uploadFile = async (uri: string, type: 'image' | 'audio') => {
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    type: type === 'image' ? 'image/jpeg' : 'audio/m4a',
    name: `${type}_${Date.now()}.${type === 'image' ? 'jpg' : 'm4a'}`,
  });

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const json = await response.json();
  return json.url; // Server trả về URL
};

// Trong handler:
const handlePickImageFromGallery = async (
  questionId: number,
  callback: (imageUri: string) => void
) => {
  launchImageLibrary({...}, async (response) => {
    if (response.assets && response.assets[0]) {
      const localUri = response.assets[0].uri;
      
      // Upload to server
      try {
        const serverUrl = await uploadFile(localUri, 'image');
        callback(serverUrl); // Trả về server URL thay vì local URI
      } catch (error) {
        Alert.alert('Lỗi upload', error.message);
      }
    }
  });
};
```

## Fallback Behavior

Nếu không truyền callbacks, component sẽ hiển thị Alert thông báo:

- **AnswerImage**: "Vui lòng truyền callback onPickFromGallery/onCaptureFromCamera..."
- **AnswerAudio**: "Vui lòng truyền callback onRecord/onPickFromFiles..."

## UI Buttons

### AnswerImage (Type 7)
- 🖼 **Thư viện** - Chọn từ gallery
- 📷 **Chụp ảnh** - Chụp trực tiếp
- **Xoá tất cả** - Xoá tất cả ảnh đã chọn

### AnswerAudio (Type 16)
- 🎤 **Ghi âm** - Ghi âm trực tiếp
- 📁 **Chọn file** - Chọn file audio từ document
- **Xoá** - Xoá file đã chọn

## Notes

1. Callbacks là **optional** - chỉ cần implement những tính năng bạn muốn
2. Mỗi callback nhận `questionId` và `callback(uri)` để trả kết quả
3. Answer components tự động hiển thị preview cho ảnh/audio đã chọn
4. Upload logic cần được implement trong parent app
5. Form sẽ validate required fields trước khi submit

## Example với Camera có sẵn

Nếu app đã có camera component, có thể reuse:

```tsx
<SFormResult
  {...props}
  onCaptureImageFromCamera={(questionId, callback) => {
    navigation.navigate('CustomCamera', {
      onCapture: (uri) => {
        callback(uri);
        navigation.goBack();
      }
    });
  }}
/>
```

## Troubleshooting

### Lỗi permission denied
- Kiểm tra Info.plist (iOS) và AndroidManifest.xml
- Request permissions runtime trước khi gọi camera/recorder

### File URI không đúng
- Sử dụng `file://` prefix cho local files
- Server URL không cần prefix

### Recording không hoạt động
- Kiểm tra microphone permission
- Test trên device thật (simulator có thể không có mic)
