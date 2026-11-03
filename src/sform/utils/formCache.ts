import type { FormListItem } from '../types/sform.types';

// Bộ nhớ đệm lưu thông tin các form từ danh sách (shop/formlist)
// Giúp SFormResult lấy được ngay các thông tin metadata (locked, done, banner...)
// mà không phụ thuộc vào việc màn hình ngoài có truyền props qua hay không.
const cacheByAccessKey = new Map<string, FormListItem>();
const cacheById = new Map<string, FormListItem>();

let lastSelectedFormItem: FormListItem | null = null;

export function setCachedFormItem(item: FormListItem | null | undefined) {
  if (!item) return;
  lastSelectedFormItem = item;
  if (item.accessKey) {
    cacheByAccessKey.set(String(item.accessKey), item);
  }
  if ((item as any).AccessKey) {
    cacheByAccessKey.set(String((item as any).AccessKey), item);
  }
  if (item.id !== undefined && item.id !== null) {
    cacheById.set(String(item.id), item);
  }
  if ((item as any).Id !== undefined && (item as any).Id !== null) {
    cacheById.set(String((item as any).Id), item);
  }
}

export function cacheFormItems(items: FormListItem[] | null | undefined) {
  if (!Array.isArray(items)) return;
  items.forEach(setCachedFormItem);
}

export function getCachedFormItem(key?: string | number | null): FormListItem | null {
  if (key === undefined || key === null || key === '') {
    return lastSelectedFormItem;
  }
  const strKey = String(key);
  return (
    cacheByAccessKey.get(strKey) ||
    cacheById.get(strKey) ||
    lastSelectedFormItem ||
    null
  );
}

export function getLastSelectedFormItem(): FormListItem | null {
  return lastSelectedFormItem;
}

