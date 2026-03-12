/**
 * SFormList Usage Example
 * Component hiển thị danh sách form khảo sát từ API: GET /shop/formlist
 * API trả về: { code: 200, message: "...", data: FormListItem[] }
 */

import React from 'react';
import { View } from 'react-native';
import { SFormList, SFormResult } from '@spiral/rn-form';
import type { FormListItem } from '@spiral/rn-form';

// Config API
const apiConfig = {
  baseUrl: 'https://vnmmt.spiral.com.vn',
  token: 'Bearer your-token-here',
};

// ============================================================
// Example 1: Form List Screen
// ============================================================
export function FormListScreen({ shopId }: { shopId: number }) {
  const [selectedForm, setSelectedForm] = React.useState<{
    formKey: string;
    shopId: number;
    item: FormListItem;
  } | null>(null);

  const handleSelectForm = (formKey: string, shopId: number, item: FormListItem) => {
    // formKey = item.AccessKey (Key để fetch detail)
    // shopId = shopId từ props
    console.log('Selected:', item.Title, 'Key:', formKey);
    setSelectedForm({ formKey, shopId, item });
  };

  // Nếu đã chọn form → hiển thị chi tiết
  if (selectedForm) {
    return (
      <SFormResult
        formId={selectedForm.item.Id.toString()}
        formKey={selectedForm.formKey}    // AccessKey từ API
        shopId={selectedForm.shopId}
        apiConfig={apiConfig}
        displayMode="step"
        onSubmitSuccess={(resultId) => {
          console.log('Submit thành công:', resultId);
          setSelectedForm(null);
        }}
        onCameraCapture={(questionId, callback) => {
          console.log('Open camera for question:', questionId);
        }}
      />
    );
  }

  // Hiển thị list
  return (
    <SFormList
      shopId={shopId}
      apiConfig={apiConfig}
      onSelectForm={handleSelectForm}
    />
  );
}

// ============================================================
// Example 2: With React Navigation
// ============================================================

// ListScreen.tsx
export function SurveyListScreen({ route, navigation }: any) {
  const { shopId } = route.params;

  return (
    <SFormList
      shopId={shopId}
      apiConfig={apiConfig}
      onSelectForm={(formKey, shopId, item) => {
        navigation.navigate('SurveyDetail', {
          formKey,        // AccessKey
          shopId,
          formName: item.Title,
          formId: item.Id,
        });
      }}
    />
  );
}

// DetailScreen.tsx
export function SurveyDetailScreen({ route, navigation }: any) {
  const { formKey, shopId, formName, formId } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <SFormResult
        formId={formId.toString()}
        formKey={formKey}
        shopId={shopId}
        apiConfig={apiConfig}
        displayMode="step"
        onSubmitSuccess={(resultId) => {
          console.log('Form submitted:', resultId);
          navigation.goBack();
        }}
      />
    </View>
  );
}

// ============================================================
// Example 3: API Structure Reference
// ============================================================

/**
 * API: GET /shop/formlist
 * Headers: { shopId: "123" }
 * 
 * Response:
 * {
 *   "code": 200,
 *   "message": "Get Form List",
 *   "data": [
 *     {
 *       "Id": 374,
 *       "Title": "Test Form",
 *       "SubTitle": "Description",
 *       "AccessKey": "2d2775de-...",  // ← formKey
 *       "FromDate": 20260312,
 *       "ToDate": 20260331
 *     }
 *   ]
 * }
 * 
 * Mapping:
 * - item.Id → formId (display)
 * - item.AccessKey → formKey (fetch detail)
 * - item.Title → formName
 * - item.SubTitle → description
 * - item.FromDate/ToDate → date range
 */

// ============================================================
// Important Props
// ============================================================

/**
 * SFormList Props:
 * - shopId: number                        ← (Required) Shop để lấy list (gửi qua header)
 * - apiConfig: { baseUrl, token }         ← (Required) API config
 *   - baseUrl: Backend URL
 *   - token: "Bearer {your-token}"        ← Authorization header (REQUIRED)
 * - onSelectForm: (formKey, shopId, item) ← (Required) Callback khi click
 *   - formKey = item.AccessKey
 *   - shopId = shopId từ props
 *   - item = FormListItem object
 * 
 * SFormResult Props:
 * - formId: string                        ← (Required) item.Id.toString()
 * - formKey?: string                      ← (Optional) item.AccessKey - ƯU TIÊN cao
 * - shopId?: number                       ← (Optional) Auto-select shop
 * - apiConfig: { baseUrl, token }         ← (Required) API config
 *   - token: "Bearer {your-token}"        ← Authorization header (REQUIRED)
 * - displayMode?: 'all' | 'step'          ← (Optional) Default: 'all'
 * - onSubmitSuccess?: (resultId) => void  ← (Optional) Success callback
 * - onCameraCapture?: (qId, callback)     ← (Optional) Camera inject
 */
