/**
 * API Integration Example - Real Backend Structure
 * Updated theo API thực tế: GET /shop/formlist
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SFormList, SFormResult, type FormListItem } from '@spiral/rn-form';

// ============================================================
// API Structure (Actual Backend)
// ============================================================

/**
 * API Endpoint: GET /shop/formlist
 * Header: shopId: number
 * 
 * Response:
 * {
 *   "code": 200,
 *   "message": "Get Form List",
 *   "data": [
 *     {
 *       "Id": 374,
 *       "Title": "testttttttttttttttttttttttttt",
 *       "SubTitle": "testttttttttttttttttttttttttt testttttttttttttttttttttttttt",
 *       "AccessKey": "2d2775de-0c81-43eb-96d4-4f04a241821b",
 *       "FromDate": 20260312,
 *       "ToDate": 20260331,
 *       "MMobile": 0,
 *       "InApp": 0,
 *       "WebUrl": "https://vnmmt.spiral.com.vn",
 *       "publicUrl": "https://vnmmt.spiral.com.vn/form/formresult?publicKey=...",
 *       "formData": "[...]"
 *     },
 *     {
 *       "Id": 373,
 *       "Banner": "{\"imageId\":null,\"imageURL\":\"...\",\"imageHeight\":331}",
 *       "Title": "System Template",
 *       "SubTitle": "Các bộ câu hỏi & câu trả lời mà system có thể hỗ trợ",
 *       "AccessKey": "84774137-433c-4184-be86-f134798acdaa",
 *       "FromDate": 20260301,
 *       "ToDate": 20260331
 *     }
 *   ]
 * }
 */

// ============================================================
// Config
// ============================================================

/**
 * API Configuration
 * - baseUrl: Backend URL
 * - token: Authorization header (REQUIRED)
 *   Format: "Bearer {your-token}"
 *   Header gửi lên: Authorization: Bearer xxx
 */
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer your-token-here', // Authorization: Bearer {token}
};

// ============================================================
// Example 1: Complete Flow
// ============================================================
export default function SurveyApp() {
  const shopId = 123; // Lấy từ context/auth
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh sách khảo sát</Text>
        </View>

        <SFormList
          shopId={shopId}
          apiConfig={apiConfig}
          onSelectForm={(formKey, shopId, item) => {
            console.log('📋 Selected:', {
              formKey: item.AccessKey,
              formName: item.Title,
              id: item.Id,
              fromDate: item.FromDate,
              toDate: item.ToDate,
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedForm.item.Title}
        </Text>
      </View>

      <SFormResult
        formId={selectedForm.item.Id.toString()}
        formKey={selectedForm.formKey}  // AccessKey từ API
        shopId={shopId}
        apiConfig={apiConfig}
        displayMode="step"
        onSubmitSuccess={(resultId) => {
          console.log('✅ Submit thành công:', resultId);
          setTimeout(() => handleBack(), 1500);
        }}
        onSubmitError={(message) => {
          console.error('❌ Submit failed:', message);
        }}
        onCameraCapture={(questionId, callback) => {
          console.log('📷 Camera for question:', questionId);
          // Your camera logic here
        }}
      />
    </View>
  );
}

// ============================================================
// Example 2: Simple List Only
// ============================================================
export function SimpleListExample() {
  return (
    <SFormList
      shopId={123}
      apiConfig={{
        baseUrl: 'https://vnmmt.spiral.com.vn',
        token: 'Bearer xxx',
      }}
      onSelectForm={(formKey, shopId, item) => {
        console.log('Selected form:', item.Title);
        console.log('FormKey to use:', formKey); // AccessKey
        console.log('Form ID:', item.Id);
      }}
    />
  );
}

// ============================================================
// Example 3: Test với Mock Data
// ============================================================
export function TestWithMockData() {
  // Mock response từ API
  const mockResponse = {
    code: 200,
    message: 'Get Form List',
    data: [
      {
        Id: 374,
        Title: 'Test Form 1',
        SubTitle: 'Mô tả form test 1',
        AccessKey: '2d2775de-0c81-43eb-96d4-4f04a241821b',
        FromDate: 20260312,
        ToDate: 20260331,
      },
      {
        Id: 373,
        Title: 'System Template',
        SubTitle: 'Các bộ câu hỏi & câu trả lời',
        AccessKey: '84774137-433c-4184-be86-f134798acdaa',
        FromDate: 20260301,
        ToDate: 20260331,
      },
    ],
  };

  return (
    <View>
      <Text>Mock Data Test</Text>
      {mockResponse.data.map((item) => (
        <View key={item.Id} style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>{item.Title}</Text>
          <Text>{item.SubTitle}</Text>
          <Text>From: {item.FromDate} To: {item.ToDate}</Text>
          <Text>Key: {item.AccessKey}</Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================
// Data Mapping
// ============================================================

/**
 * API Response → Component Props:
 * 
 * FormListItem (từ API):
 * - Id                → formId (cho display)
 * - AccessKey         → formKey (KEY để fetch detail)
 * - Title             → formName (hiển thị)
 * - SubTitle          → description
 * - FromDate          → fromDate (YYYYMMDD)
 * - ToDate            → toDate (YYYYMMDD)
 * - Banner            → JSON string (optional)
 * - formData          → JSON string (optional)
 * 
 * SFormResult Props:
 * - formId            → item.Id.toString()
 * - formKey           → item.AccessKey  ← ƯU TIÊN dùng để fetch
 * - shopId            → shopId từ context
 * 
 * Submit Flow:
 * 1. User fill form
 * 2. Submit với:
 *    - dataByDomain = item.AccessKey (formKey)
 *    - formData = filled data + shopId
 * 3. API: POST /api/SForm/InsertResult
 */

// ============================================================
// API Header Configuration
// ============================================================

/**
 * GET /shop/formlist
 * 
 * Headers:
 * {
 *   "Content-Type": "application/json",
 *   "Authorization": "Bearer your-token",  // Nếu cần
 *   "shopId": "123"  ← QUAN TRỌNG: shopId ở header
 * }
 * 
 * Implementation trong useSFormApi.ts:
 * ```typescript
 * const headers = buildHeaders(config);
 * headers['shopId'] = shopId.toString();
 * 
 * fetch(`${baseUrl}/shop/formlist`, {
 *   method: 'GET',
 *   headers,
 * })
 * ```
 */

// ============================================================
// isCompleted Logic
// ============================================================

/**
 * Hiện tại: Tất cả form đều hiển thị "Chưa làm"
 * 
 * Nếu cần check completed status:
 * 
 * Option 1: API trả về thêm field "isCompleted"
 * - Backend check trong DB nếu user đã submit form này chưa
 * 
 * Option 2: Client-side check
 * - Gọi thêm API: GET /api/SForm/CheckCompleted?formId=xxx&shopId=xxx
 * - Cache kết quả để không phải gọi nhiều lần
 * 
 * Option 3: Check từ formData
 * - Parse formData JSON
 * - Xem có resultId hay không
 * 
 * Hiện tại chọn: Hiển thị tất cả "Chưa làm" (theo yêu cầu user)
 */

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
// Testing Checklist
// ============================================================

/**
 * ✅ Test 1: API Call
 * - shopId được gửi đúng trong header
 * - Response code 200
 * - Data array có items
 * 
 * ✅ Test 2: List Display
 * - Hiển thị Title đúng
 * - SubTitle hiển thị (nếu có)
 * - Badge "Chưa làm" hiển thị
 * - FromDate/ToDate format đúng DD/MM/YYYY
 * - Badge "Hết hạn" nếu ToDate < today
 * 
 * ✅ Test 3: Click Item
 * - onSelectForm được gọi với đúng params
 * - formKey = AccessKey
 * - shopId được truyền
 * 
 * ✅ Test 4: Form Detail Load
 * - API GetById được gọi với AccessKey (formKey)
 * - Form data load đúng
 * - Shop được auto-select nếu có shopId
 * 
 * ✅ Test 5: Submit
 * - dataByDomain = AccessKey
 * - shopId included trong payload
 * - Success callback được gọi
 */
