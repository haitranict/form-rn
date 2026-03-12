/**
 * Example: Sử dụng @spiral/rn-form trong dự án React Native
 * Copy file này vào dự án của bạn và customize
 */

import React, { useState } from 'react';
import {
    View, StyleSheet, SafeAreaView, Alert, Platform,
} from 'react-native';
import { SFormResult } from '@spiral/rn-form';

// ===== OPTION 1: Nếu dùng react-native-image-picker =====
// import { launchCamera } from 'react-native-image-picker';

// ===== OPTION 2: Nếu dùng expo-image-picker =====
// import * as ImagePicker from 'expo-image-picker';

export default function FormExample() {
    // ============================================================
    // 1. Cấu hình API
    // ============================================================
    const apiConfig = {
        baseURL: 'https://your-api-domain.com',
        token: 'Bearer YOUR_AUTH_TOKEN_HERE',
        // Optional: Custom endpoints
        // getFormEndpoint: '/api/v1/sform/getbyid',
        // submitEndpoint: '/api/v1/sform/submit',
        // uploadImageEndpoint: '/api/v1/upload/images',
        // uploadAudioEndpoint: '/api/v1/upload/audio',
    };

    // ============================================================
    // 2. Handle Camera (chọn 1 trong các options dưới)
    // ============================================================

    // ----- OPTION 1: react-native-image-picker -----
    const handleCameraCapture = (
        questionId: number,
        callback: (uri: string) => void
    ) => {
        // Uncommnet nếu dùng react-native-image-picker:
        /*
        launchCamera(
          {
            mediaType: 'photo',
            quality: 0.8,
            cameraType: 'back',
            saveToPhotos: false,
          },
          (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera');
            } else if (response.errorCode) {
              Alert.alert('Lỗi Camera', response.errorMessage || 'Không thể mở camera');
            } else if (response.assets?.[0]?.uri) {
              callback(response.assets[0].uri);
            }
          }
        );
        */

        // Tạm thời hiển thị alert (xóa dòng này khi đã setup camera)
        Alert.alert(
            'Camera chưa setup',
            'Uncomment code trong handleCameraCapture để sử dụng camera'
        );
    };

    // ----- OPTION 2: expo-image-picker -----
    /*
    const handleCameraCapture = async (
      questionId: number,
      callback: (uri: string) => void
    ) => {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cảnh báo', 'Cần cấp quyền camera để tiếp tục');
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
    */

    // ============================================================
    // 3. Callbacks
    // ============================================================
    const handleSubmitSuccess = (resultId: number) => {
        console.log('✅ Form submitted successfully! Result ID:', resultId);
        Alert.alert('Thành công', `Form đã được gửi! (ID: ${resultId})`);
        // TODO: Navigate to success screen hoặc close modal
        // navigation.navigate('FormSuccess', { resultId });
    };

    const handleSubmitError = (message: string) => {
        console.error('❌ Form submission failed:', message);
        Alert.alert('Lỗi', message);
    };

    // ============================================================
    // 4. Render
    // ============================================================
    return (
        <SafeAreaView style={styles.container}>
            <SFormResult
                formId="your-form-id-here" // ⚠️ Thay bằng form ID thực tế
                apiConfig={apiConfig}
                mode="fill" // hoặc 'view' để chỉ xem
                
                // ⭐ DISPLAY MODE - Chọn 1 trong 2:
                // displayMode="all"   // Hiển thị tất cả câu hỏi (như web)
                displayMode="step"  // Hiển thị từng câu một (MOBILE RECOMMENDED)
                
                onCameraCapture={handleCameraCapture}
                onSubmitSuccess={handleSubmitSuccess}
                onSubmitError={handleSubmitError}
                style={styles.formContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    formContainer: {
        flex: 1,
    },
});

// ============================================================
// 5. Sử dụng trong Navigation
// ============================================================
/*
// Trong App.tsx hoặc navigation file:

import FormExample from './screens/FormExample';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FormScreen" 
        component={FormExample}
        options={{ title: 'Khảo sát' }}
      />
    </Stack.Navigator>
  );
}

// Hoặc dùng với params:
navigation.navigate('FormScreen', { formId: 'abc123' });

// Và trong component:
const { formId } = route.params;
<SFormResult formId={formId} ... />
*/
