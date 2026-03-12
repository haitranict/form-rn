# 🧭 Navigation Params Reference

## 📋 Quick Reference

### 1. Navigate TO FormList Screen
```typescript
navigation.navigate('FormList', {
  shopId: 123,              // REQUIRED - Shop ID
  shopName: 'Shop A',       // Optional - Tên shop (hiển thị header)
});
```

### 2. Navigate TO FormDetail Screen
```typescript
navigation.navigate('FormDetail', {
  formId: '374',                                    // REQUIRED - Form ID (display)
  formKey: '2d2775de-0c81-43eb-96d4-4f04a241821b', // REQUIRED - AccessKey (fetch)
  shopId: 123,                                      // REQUIRED - Shop ID
  formName: 'Test Form',                            // REQUIRED - Header title
  fromDate: 20260312,                               // Optional
  toDate: 20260331,                                 // Optional
});
```

### 3. onSelectForm Callback
```typescript
<SFormList
  shopId={123}
  apiConfig={config}
  onSelectForm={(formKey, shopId, item) => {
    navigation.navigate('FormDetail', {
      formId: item.Id.toString(),
      formKey: item.AccessKey,    // ← KEY để fetch form
      shopId: shopId,
      formName: item.Title,
    });
  }}
/>
```

## 📦 TypeScript Types

```typescript
export type RootStackParamList = {
  FormList: {
    shopId: number;
    shopName?: string;
  };
  FormDetail: {
    formId: string;
    formKey: string;        // AccessKey từ API
    shopId: number;
    formName: string;
    fromDate?: number;
    toDate?: number;
  };
};
```

## 🔑 Key Points

1. **formKey** = `item.AccessKey` từ API - đây là KEY quan trọng để fetch form chi tiết
2. **shopId** - cần thiết cho cả list và detail
3. **formName** - dùng để set header title
4. **formId** - chỉ dùng để display, không dùng để fetch

## 📱 Common Patterns

### Pattern 1: Stack Navigator
```typescript
const Stack = createNativeStackNavigator<RootStackParamList>();

<Stack.Navigator>
  <Stack.Screen name="FormList" component={FormListScreen} />
  <Stack.Screen name="FormDetail" component={FormDetailScreen} />
</Stack.Navigator>
```

### Pattern 2: Navigate từ Home
```typescript
function HomeScreen({ navigation }) {
  return (
    <Button
      title="Mở khảo sát"
      onPress={() => {
        navigation.navigate('FormList', {
          shopId: 123,
          shopName: 'Shop A',
        });
      }}
    />
  );
}
```

### Pattern 3: Go Back sau Submit
```typescript
<SFormResult
  {...props}
  onSubmitSuccess={(resultId) => {
    navigation.goBack();  // Quay về FormList
  }}
/>
```

## 🎯 Full Example

```typescript
// FormListScreen.tsx
function FormListScreen({ route, navigation }) {
  const { shopId, shopName } = route.params;

  return (
    <SFormList
      shopId={shopId}
      apiConfig={config}
      onSelectForm={(formKey, shopId, item) => {
        navigation.navigate('FormDetail', {
          formId: item.Id.toString(),
          formKey: item.AccessKey,
          shopId: shopId,
          formName: item.Title,
        });
      }}
    />
  );
}

// FormDetailScreen.tsx
function FormDetailScreen({ route, navigation }) {
  const { formId, formKey, shopId, formName } = route.params;

  return (
    <SFormResult
      formId={formId}
      formKey={formKey}
      shopId={shopId}
      apiConfig={config}
      displayMode="step"
      onSubmitSuccess={() => navigation.goBack()}
    />
  );
}
```

## 📚 Related Files

- [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx) - Full examples với Stack/Tab/Drawer
- [API_INTEGRATION_EXAMPLE.tsx](API_INTEGRATION_EXAMPLE.tsx) - API integration
- [COMPLETE_FLOW_EXAMPLE.tsx](COMPLETE_FLOW_EXAMPLE.tsx) - Complete flow without navigation

## ⚠️ Important Notes

1. **Param names phải match chính xác** với TypeScript types
2. **formKey phải là AccessKey** từ API response
3. **shopId phải consisten** giữa list và detail
4. **formName** dùng cho header, không ảnh hưởng logic

## 🚀 Quick Start

1. Copy [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx)
2. Update `apiConfig` với Authorization header:
   ```typescript
   const apiConfig = {
     baseUrl: 'https://your-api.com',
     token: 'Bearer your-token',  // Authorization: Bearer {token}
   };
   ```
3. Update `shopId` từ context/auth của bạn
4. Chạy app!
