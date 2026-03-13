# @spiral/rn-form

🚀 Thư viện Form động dạng Google Form cho React Native

## ✨ Tính năng

### SFormResult (Form Chi Tiết)
- ✅ 13 loại câu hỏi: Text, Textarea, Number, Checkbox, Radio, Date, Image, Camera, Audio, Grid/Matrix, Address, Dropdown, Multi-select
- ✅ Logic điều kiện phức tạp (conditional logic)
- ✅ Validation đầy đủ (required, min/max, range)
- ✅ Upload ảnh/audio
- ✅ Tích hợp camera linh hoạt (inject từ parent app)
- ✅ Support Employee/Shop selection
- ✅ Form expiration & success states
- ✅ **Display Mode**: 'all' (hiện tất cả) hoặc 'step' (từng câu một cho mobile)

### SFormList (Danh Sách Form) 🆕
- ✅ Hiển thị danh sách form khảo sát theo shop
- ✅ Trạng thái: Đã làm / Chưa làm / Hết hạn
- ✅ Click vào item → navigate sang form chi tiết
- ✅ Hỗ trợ filter theo employee
- ✅ Retry on error
- ✅ Beautiful mobile UI

### Common
- ✅ TypeScript support
- ✅ Zero dependencies (ngoại trừ React Native core)

## 📦 Cài đặt

### Từ local (development)
```bash
npm install ../path/to/ModuleApp/Form
# hoặc
yarn add file:../path/to/ModuleApp/Form
```

### Từ npm (sau khi publish)
```bash
npm install @spiral/rn-form
# hoặc
yarn add @spiral/rn-form
```

## 🚀 Quick Start

### 1. Form List → Detail Flow

```tsx
import { SFormList, SFormResult } from '@spiral/rn-form';

function SurveyScreen({ shopId }: { shopId: number }) {
  const [selected, setSelected] = React.useState(null);

  // API Configuration
  const apiConfig = {
    baseUrl: 'https://api.com',
    token: 'Bearer xxx',  // Authorization: Bearer {token}
  };

  // Show list
  if (!selected) {
    return (
      <SFormList
        shopId={shopId}
        apiConfig={apiConfig}
        onSelectForm={(formKey, shopId, item) => {
          setSelected({ formKey, shopId, item });
        }}
      />
    );
  }

  // Show detail
  return (
    <SFormResult
      formId={selected.item.formId.toString()}
      formKey={selected.formKey}
      shopId={selected.shopId}
      apiConfig={apiConfig}
      displayMode="step"
      onSubmitSuccess={() => setSelected(null)}
    />
  );
}
```

### 2. Standalone Form Detail

```tsx
import { SFormResult } from '@spiral/rn-form';

export default function MyApp() {
  return (
    <SFormResult
      formId="abc123"
      apiConfig={{
        baseUrl: 'https://your-api.com',
        token: 'Bearer your-token',
      }}
      onSubmitSuccess={(resultId) => {
        console.log('Success:', resultId);
      }}
    />
  );
}
```

## 📖 Documentation

- **Authorization**: Xem [AUTHORIZATION.md](AUTHORIZATION.md) - Chi tiết về Authorization header
- **Navigation**: Xem [NAVIGATION_PARAMS.md](NAVIGATION_PARAMS.md) và [NAVIGATION_EXAMPLE.tsx](NAVIGATION_EXAMPLE.tsx)
- **Form List**: Xem [FORMLIST_EXAMPLE.md](FORMLIST_EXAMPLE.md)
- **Form Detail**: Xem [USAGE_EXAMPLE.md](USAGE_EXAMPLE.md)
- **API Integration**: Xem [API_INTEGRATION_EXAMPLE.tsx](API_INTEGRATION_EXAMPLE.tsx)

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run prepare

# Lint
npm run lint

# Type check
npm run typescript
```

## 📄 License

Copyright © 2026 Spiral
