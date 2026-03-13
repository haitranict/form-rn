# 🗺️ Navigation Flow Diagram

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     App Root                            │
│              (NavigationContainer)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Stack Navigator                          │
│  RootStackParamList: { FormList, FormDetail }          │
└─────────┬──────────────────────────┬────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐
│  FormList Screen     │    │  FormDetail Screen   │
│                      │    │                      │
│  Params:             │    │  Params:             │
│  - shopId ✓          │    │  - formId ✓          │
│  - shopName?         │    │  - formKey ✓         │
│                      │    │  - shopId ✓          │
│  Component:          │    │  - formName ✓        │
│  <SFormList />       │    │  - fromDate?         │
│                      │    │  - toDate?           │
│                      │    │                      │
│                      │    │  Component:          │
│                      │    │  <SFormResult />     │
└──────────────────────┘    └──────────────────────┘
```

## 🔄 Navigation Flow

### Flow 1: Từ Home → List → Detail

```
┌─────────┐   params: { shopId }    ┌──────────────┐
│  Home   │ ────────────────────────>│  FormList    │
│ Screen  │                          │   Screen     │
└─────────┘                          └───────┬──────┘
                                            │
                                            │ onSelectForm
                                            │ params: {
                                            │   formId,
                                            │   formKey, ← KEY
                                            │   shopId,
                                            │   formName
                                            │ }
                                            ▼
                                     ┌──────────────┐
                                     │  FormDetail  │
                                     │   Screen     │
                                     └───────┬──────┘
                                            │
                                            │ onSubmitSuccess
                                            │ goBack()
                                            ▼
                                     ┌──────────────┐
                                     │  FormList    │
                                     │   Screen     │
                                     └──────────────┘
```

### Flow 2: Deep Link Direct to Detail

```
┌──────────┐   params: {              ┌──────────────┐
│ Deep     │     formId,               │  FormDetail  │
│ Link     │ ──> formKey,  ────────────>│   Screen     │
│ Handler  │     shopId,               └──────────────┘
└──────────┘     formName
               }
```

## 📦 Params Flow

### FormList Screen

**Params IN:**
```typescript
{
  shopId: number,        // Shop ID để lấy list
  shopName?: string,     // Tên shop (optional, hiển thị header)
}
```

**Params OUT (to FormDetail):**
```typescript
{
  formId: item.Id.toString(),
  formKey: item.AccessKey,      // ← KEY từ API
  shopId: shopId,               // Pass through
  formName: item.Title,
  fromDate: item.FromDate,      // Optional
  toDate: item.ToDate,          // Optional
}
```

### FormDetail Screen

**Params IN:**
```typescript
{
  formId: string,        // Display purposes
  formKey: string,       // ← KEY để fetch (priority)
  shopId: number,        // Auto-select shop
  formName: string,      // Header title
  fromDate?: number,     // Optional
  toDate?: number,       // Optional
}
```

**Actions OUT:**
```typescript
onSubmitSuccess: () => {
  navigation.goBack();  // Return to FormList
}

onSubmitError: (message) => {
  // Show error
}
```

## 🔑 Data Flow trong Navigation

```
API Response                onSelectForm Params         SFormResult Props
─────────────              ───────────────────         ─────────────────
Id: 374          ──────>   formId: "374"     ────────> formId (display)
AccessKey: "2d.." ──────>  formKey: "2d..."  ────────> formKey (fetch) ✓
Title: "Test"    ──────>   formName: "Test"  ────────> header title
shopId: 123      ──────>   shopId: 123       ────────> shopId (auto-select)
FromDate: 20260312 ─────>  fromDate: 20260312 ───────> optional
ToDate: 20260331   ─────>  toDate: 20260331   ───────> optional
```

## 🎯 Implementation Example

```typescript
// 1. Define Types
type RootStackParamList = {
  FormList: { shopId: number; shopName?: string };
  FormDetail: {
    formId: string;
    formKey: string;
    shopId: number;
    formName: string;
  };
};

// 2. FormList Screen
function FormListScreen({ route, navigation }) {
  const { shopId } = route.params;

  return (
    <SFormList
      shopId={shopId}
      apiConfig={config}
      onSelectForm={(formKey, shopId, item) => {
        navigation.navigate('FormDetail', {
          formId: item.Id.toString(),
          formKey: item.AccessKey,  // ← Quan trọng
          shopId: shopId,
          formName: item.Title,
        });
      }}
    />
  );
}

// 3. FormDetail Screen
function FormDetailScreen({ route, navigation }) {
  const { formId, formKey, shopId, formName } = route.params;

  return (
    <SFormResult
      formId={formId}
      formKey={formKey}  // ← Ưu tiên fetch với key này
      shopId={shopId}
      apiConfig={config}
      onSubmitSuccess={() => navigation.goBack()}
    />
  );
}
```

## 📱 Navigation Patterns

### Pattern 1: Stack (Recommended)
- FormList → FormDetail
- Linear flow
- Easy back navigation

### Pattern 2: Tab with State
- Tab chứa FormList
- State quản lý selected form
- Không cần navigate

### Pattern 3: Drawer
- Drawer menu → FormList
- FormList → FormDetail
- Good for multi-section app

### Pattern 4: Modal
- FormDetail as Modal
- Present over FormList
- Quick preview

## 🔧 Common Operations

### Go Back
```typescript
navigation.goBack()
```

### Reset Stack
```typescript
navigation.reset({
  index: 0,
  routes: [{ name: 'FormList', params: { shopId: 123 } }],
})
```

### Replace Screen
```typescript
navigation.replace('FormSuccess', { resultId })
```

### Navigate with Params
```typescript
navigation.navigate('FormDetail', {
  formId: '374',
  formKey: 'abc-123',
  shopId: 123,
  formName: 'Test',
})
```

## ✅ Best Practices

1. ✅ **Type-safe params** với TypeScript
2. ✅ **formKey phải là AccessKey** từ API
3. ✅ **shopId consistent** giữa screens
4. ✅ **Validate params** trước khi navigate
5. ✅ **Handle back press** properly
6. ✅ **Clean up state** khi unmount

## ⚠️ Common Mistakes

❌ Sử dụng formId thay vì formKey để fetch
❌ Không truyền shopId
❌ Param name typo (formname vs formName)
❌ Không handle goBack() sau submit
❌ Deep link không có đủ params

## 📚 See Also

- [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx) - Full code examples
- [NAVIGATION_PARAMS.md](NAVIGATION_PARAMS.md) - Quick reference
- [API_INTEGRATION_EXAMPLE.tsx](API_INTEGRATION_EXAMPLE.tsx) - API integration
