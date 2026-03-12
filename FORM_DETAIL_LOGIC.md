# Form Detail - Logic hoàn chỉnh ✅

## 📦 Những gì đã hoàn thành

### 1. **Props mới cho SFormResult**
```typescript
interface SFormResultProps {
  formId: string;              // Fallback ID
  formKey?: string;            // ← MỚI: Key từ list (ưu tiên cao hơn formId)
  shopId?: number;             // ← MỚI: Auto-select shop
  apiConfig: SFormApiConfig;
  displayMode?: 'all' | 'step';
  onCameraCapture?: (questionId, callback) => void;
  // ... các props khác
}
```

### 2. **QueryKey Logic**
```typescript
// Ưu tiên formKey > formId
const queryKey = formKey || formId;

// Dùng queryKey cho:
- Load form: apiGetFormById(apiConfig, queryKey)
- Submit: dataByDomain = queryKey
- useEffect dependency
```

### 3. **Auto-select Shop**
```typescript
// Khi có shopId từ list:
useEffect(() => {
  if (shopId && state.shops.length > 0 && !state.selectedShop) {
    const shop = state.shops.find((s) => s.shopId === shopId);
    if (shop) {
      setSelectedShop(shop);  // ← Tự động chọn
    }
  }
}, [shopId, state.shops, state.selectedShop, setSelectedShop]);
```

### 4. **Shop trong Submit Payload**
- Shop được include trong `enrichedFormData` (validation hook)
- Nếu form có `usedStores = true`, shopId sẽ được add vào payload
- API submit nhận được đầy đủ thông tin shop

### 5. **Step-by-step Mode**
- `displayMode="step"` → Hiện từng câu một
- Progress bar: "Câu X / Total"
- Validation trước khi Next
- Previous/Next/Submit buttons

## 🧪 Test Flow

### Test 1: Standalone Form (không qua list)
```tsx
<SFormResult
  formId="abc123"
  apiConfig={config}
  displayMode="step"
/>
```
✅ Dùng formId để fetch
✅ Không auto-select shop
✅ Step mode hoạt động

### Test 2: From List (với formKey + shopId)
```tsx
// List callback:
onSelectForm={(formKey, shopId, item) => {
  // formKey: "xyz789"
  // shopId: 456
}}

// Detail:
<SFormResult
  formId={item.formId.toString()}
  formKey="xyz789"        // ← Ưu tiên
  shopId={456}            // ← Auto-select
  apiConfig={config}
/>
```
✅ Dùng formKey để fetch (không dùng formId)
✅ Auto-select shop 456
✅ shopId included trong submit payload

### Test 3: Conditional Logic
```tsx
// Câu 1: Radio "Có/Không"
// - nextStep của "Có" = 2
// - nextStep của "Không" = 5 (skip 2,3,4)

// Step counter:
totalSteps = visible questions
currentStep tăng khi Next
isLastStep = currentStep === totalSteps - 1
```

### Test 4: Required Validation
```tsx
// Câu required chưa answer:
canGoNext = false      // ← Next button disabled

// Sau khi answer:
canGoNext = true       // ← Next button enabled

// Submit:
validate() check tất cả required questions
```

## 📊 Data Flow

```
┌─────────────┐
│  SFormList  │
│ (shopId=123)│
└──────┬──────┘
       │ User click item
       │
       ├─ formKey: "abc123"
       ├─ shopId: 123
       └─ item: FormListItem
              ↓
┌──────────────────┐
│  SFormResult     │
│  formKey="abc"   │ ← Ưu tiên dùng formKey
│  shopId=123      │ ← Auto-select shop
└────────┬─────────┘
         │
         ├─ useEffect → Load form
         │  └─ apiGetFormById(config, "abc123")
         │
         ├─ useEffect → Auto-select shop
         │  └─ setSelectedShop(shop với id=123)
         │
         ├─ User fill form (step-by-step)
         │
         └─ Submit
            └─ apiInsertResult({
                 dataByDomain: "abc123",
                 formData: {
                   ...formData,
                   shopId: 123  ← Included
                 }
               })
```

## 🔧 Dependencies Updated

### useEffect thay đổi:
```typescript
// CŨ:
}, [formId]);

// MỚI:
}, [queryKey]);
```

### handleSubmit thay đổi:
```typescript
// CŨ:
dataByDomain: formId,

// MỚI:
dataByDomain: queryKey,
```

### Callback dependencies:
```typescript
// CŨ:
[apiConfig, formId, ...]

// MỚI:
[apiConfig, queryKey, ...]
```

## 🎯 Next Steps (Đợi API thực tế)

1. **API GetList structure:**
```typescript
// User sẽ cung cấp:
POST /api/SForm/GetList
Body: { shopId: number, employeeId?: number }

Response: {
  result: 1,
  data: [
    {
      formId: number,
      formKey: string,     // ← Key để fetch detail
      formName: string,
      shopId: number,      // ← Để auto-select
      isCompleted: boolean,
      // ... other fields
    }
  ]
}
```

2. **Có thể cần adjust:**
- Field names nếu API trả về khác
- Validation logic nếu có thêm rules
- Submit payload nếu cần thêm fields

## ✅ Summary

**Form Detail đã hoàn tất với:**
- ✅ Props: formKey + shopId
- ✅ Logic: queryKey (formKey > formId)
- ✅ Auto-select shop khi có shopId
- ✅ Submit với đúng key và shop info
- ✅ Step-by-step mode
- ✅ All dependencies updated
- ✅ Build thành công
- ✅ Type-safe

**Ready for integration!** 🚀
User giờ có thể test với API thực tế và adjust SFormList theo response structure.
