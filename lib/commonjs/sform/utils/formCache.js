"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheFormItems = cacheFormItems;
exports.getCachedFormItem = getCachedFormItem;
exports.getLastSelectedFormItem = getLastSelectedFormItem;
exports.setCachedFormItem = setCachedFormItem;
// Bộ nhớ đệm lưu thông tin các form từ danh sách (shop/formlist)
// Giúp SFormResult lấy được ngay các thông tin metadata (locked, done, banner...)
// mà không phụ thuộc vào việc màn hình ngoài có truyền props qua hay không.
const cacheByAccessKey = new Map();
const cacheById = new Map();
let lastSelectedFormItem = null;
function setCachedFormItem(item) {
  if (!item) return;
  lastSelectedFormItem = item;
  if (item.accessKey) {
    cacheByAccessKey.set(String(item.accessKey), item);
  }
  if (item.AccessKey) {
    cacheByAccessKey.set(String(item.AccessKey), item);
  }
  if (item.id !== undefined && item.id !== null) {
    cacheById.set(String(item.id), item);
  }
  if (item.Id !== undefined && item.Id !== null) {
    cacheById.set(String(item.Id), item);
  }
}
function cacheFormItems(items) {
  if (!Array.isArray(items)) return;
  items.forEach(setCachedFormItem);
}
function getCachedFormItem(key) {
  if (key === undefined || key === null || key === '') {
    return lastSelectedFormItem;
  }
  const strKey = String(key);
  return cacheByAccessKey.get(strKey) || cacheById.get(strKey) || lastSelectedFormItem || null;
}
function getLastSelectedFormItem() {
  return lastSelectedFormItem;
}
//# sourceMappingURL=formCache.js.map