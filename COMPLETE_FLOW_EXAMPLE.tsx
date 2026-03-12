/**
 * Complete Flow Example: List → Detail
 * Demo đầy đủ luồng từ danh sách form đến chi tiết form với formKey + shopId
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SFormList, SFormResult, type FormListItem } from '@spiral/rn-form';

// ============================================================
// API Config
// ============================================================
const apiConfig = {
  baseUrl: 'https://api.example.com',
  token: 'Bearer your-token-here',
};

// ============================================================
// Main App Component
// ============================================================
export default function SurveyApp() {
  const shopId = 123; // Từ auth/context của bạn
  const [selectedForm, setSelectedForm] = useState<{
    formKey: string;
    shopId: number;
    item: FormListItem;
  } | null>(null);

  const handleBack = () => {
    setSelectedForm(null);
  };

  // ============================================================
  // Screen: Form List
  // ============================================================
  if (!selectedForm) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh sách khảo sát</Text>
        </View>

        {/* List */}
        <SFormList
          shopId={shopId}
          apiConfig={apiConfig}
          onSelectForm={(formKey, shopId, item) => {
            console.log('📋 Selected form:', {
              formKey,
              shopId,
              formName: item.formName,
            });
            setSelectedForm({ formKey, shopId, item });
          }}
        />
      </View>
    );
  }

  // ============================================================
  // Screen: Form Detail
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Header với Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedForm.item.formName}
        </Text>
      </View>

      {/* Form Detail */}
      <SFormResult
        formId={selectedForm.item.formId.toString()}
        formKey={selectedForm.formKey}        // ← Key từ list
        shopId={selectedForm.shopId}          // ← ShopId từ list (auto-select)
        apiConfig={apiConfig}
        displayMode="step"                     // Step-by-step cho mobile
        onSubmitSuccess={(resultId) => {
          console.log('✅ Submit thành công:', resultId);
          // Có thể show success modal trước khi quay lại
          setTimeout(() => {
            handleBack();
          }, 1500);
        }}
        onSubmitError={(message) => {
          console.error('❌ Submit thất bại:', message);
        }}
        onCameraCapture={(questionId, callback) => {
          // Camera logic của bạn
          console.log('📷 Open camera for question:', questionId);
          // Ví dụ với react-native-image-picker:
          // launchCamera({ mediaType: 'photo' }, (response) => {
          //   if (response.assets?.[0]?.uri) {
          //     callback(response.assets[0].uri);
          //   }
          // });
        }}
      />
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4285F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

// ============================================================
// Logic Chi Tiết của Form Detail
// ============================================================

/**
 * Khi SFormResult mount với formKey + shopId:
 * 
 * 1. Load form data:
 *    - Ưu tiên dùng formKey nếu có (queryKey = formKey || formId)
 *    - API: GET /api/SForm/GetById?{formKey}
 * 
 * 2. Auto-select shop:
 *    - Nếu shopId được truyền vào
 *    - Và form có usedStores = true
 *    - Tự động chọn shop từ danh sách shops
 * 
 * 3. Display mode = "step":
 *    - Hiển thị từng câu một
 *    - Progress bar: "Câu 1 / 10"
 *    - Validate câu hiện tại trước khi Next
 *    - Previous/Next buttons
 * 
 * 4. Submit:
 *    - Validate toàn bộ form
 *    - Gửi với queryKey (formKey)
 *    - Include shopId trong payload (qua enrichedFormData)
 *    - API: POST /api/SForm/InsertResult
 *    - Callback onSubmitSuccess(resultId)
 * 
 * 5. Dependencies:
 *    - formKey: Thay thế formId, dùng để fetch + submit
 *    - shopId: Auto-select shop khi load
 *    - displayMode: "step" cho mobile, "all" cho web
 *    - onCameraCapture: Inject camera từ parent app
 */

// ============================================================
// Test Scenarios
// ============================================================

/**
 * Scenario 1: User select form từ list
 * ✅ List hiển thị: "Form A - Chưa làm"
 * ✅ User click → Navigate với { formKey, shopId }
 * ✅ Form detail auto-select shop
 * ✅ Step 1/5 hiển thị
 * 
 * Scenario 2: User fill form và submit
 * ✅ Answer câu 1 → Next enabled
 * ✅ Answer câu 2-5
 * ✅ Submit → Success
 * ✅ Quay về list → Form A: "✓ Đã làm"
 * 
 * Scenario 3: Công thức logic điều kiện
 * ✅ Câu 1: Radio "Có/Không"
 * ✅ Chọn "Có" → Câu 2 hiển thị (nextStep)
 * ✅ Chọn "Không" → Skip câu 2, đến câu 3
 * ✅ Step counter update đúng
 * 
 * Scenario 4: Required validation
 * ✅ Câu required chưa answer → Next disabled
 * ✅ Answer → Next enabled
 * ✅ Submit validate tất cả required
 * 
 * Scenario 5: Camera capture
 * ✅ Câu type = 8 (Camera)
 * ✅ Click button → onCameraCapture called
 * ✅ Parent app open camera
 * ✅ Callback với imageUri → Save vào form
 */

// ============================================================
// Important Props
// ============================================================

/**
 * SFormList Props:
 * - shopId: number                        ← (Required) Shop để lấy list
 * - employeeId?: number                    ← (Optional) Filter theo employee
 * - apiConfig: { baseUrl, token }          ← (Required) API config
 * - onSelectForm: (formKey, shopId, item) ← (Required) Callback khi click
 * 
 * SFormResult Props:
 * - formId: string                         ← (Required) Fallback nếu không có formKey
 * - formKey?: string                       ← (Optional) Key từ list, ưu tiên cao
 * - shopId?: number                        ← (Optional) Auto-select shop
 * - apiConfig: { baseUrl, token }          ← (Required) API config
 * - displayMode?: 'all' | 'step'           ← (Optional) Default: 'all'
 * - mode?: 'fill' | 'view'                 ← (Optional) Default: 'fill'
 * - onSubmitSuccess?: (resultId) => void   ← (Optional) Success callback
 * - onSubmitError?: (message) => void      ← (Optional) Error callback
 * - onCameraCapture?: (qId, callback)      ← (Optional) Camera inject
 */
