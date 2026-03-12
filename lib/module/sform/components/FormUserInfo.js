import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet, SafeAreaView } from 'react-native';
export function FormUserInfo({
  formData,
  employees,
  shops,
  selectedEmployee,
  selectedShop,
  onSelectEmployee,
  onSelectShop
}) {
  const [showEmp, setShowEmp] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [empSearch, setEmpSearch] = useState('');
  const [shopSearch, setShopSearch] = useState('');
  const showEmployees = formData.usedEmployees && employees.length > 0;
  const showShops = formData.usedStores && shops.length > 0;
  if (!showEmployees && !showShops) return null;
  let header = '';
  if (showEmployees && showShops) header = 'Thông tin nhân viên & cửa hàng';else if (showEmployees) header = 'Thông tin nhân viên';else header = 'Thông tin cửa hàng';
  const filteredEmployees = empSearch ? employees.filter(e => e.FullName.toLowerCase().includes(empSearch.toLowerCase())) : employees;
  const filteredShops = shopSearch ? shops.filter(s => s.shopNameVN.toLowerCase().includes(shopSearch.toLowerCase())) : shops;
  return /*#__PURE__*/React.createElement(View, {
    style: styles.card
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.header
  }, header), /*#__PURE__*/React.createElement(View, {
    style: styles.row
  }, showEmployees && /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, styles.btnEmployee],
    onPress: () => setShowEmp(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText,
    numberOfLines: 1
  }, selectedEmployee?.FullName ?? 'Chọn 1 nhân viên')), showShops && /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, styles.btnShop],
    onPress: () => setShowShop(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText,
    numberOfLines: 1
  }, selectedShop?.shopNameVN ?? 'Chọn 1 cửa hàng'))), /*#__PURE__*/React.createElement(Modal, {
    visible: showEmp,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => setShowEmp(false)
  }, /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.overlay
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.sheet
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.sheetTitle
  }, "Ch\u1ECDn Nh\xE2n Vi\xEAn"), /*#__PURE__*/React.createElement(TextInput, {
    style: styles.search,
    value: empSearch,
    onChangeText: setEmpSearch,
    placeholder: "T\xECm ki\u1EBFm nh\xE2n vi\xEAn...",
    placeholderTextColor: "#9AA0A6"
  }), /*#__PURE__*/React.createElement(FlatList, {
    data: filteredEmployees,
    keyExtractor: item => String(item.Id),
    renderItem: ({
      item
    }) => /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [styles.option, selectedEmployee?.Id === item.Id && styles.optionSelected],
      onPress: () => {
        onSelectEmployee(item);
        setShowEmp(false);
        setEmpSearch('');
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.optionText
    }, item.FullName))
  })))), /*#__PURE__*/React.createElement(Modal, {
    visible: showShop,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => setShowShop(false)
  }, /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.overlay
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.sheet
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.sheetTitle
  }, "Ch\u1ECDn C\u1EEDa H\xE0ng"), /*#__PURE__*/React.createElement(TextInput, {
    style: styles.search,
    value: shopSearch,
    onChangeText: setShopSearch,
    placeholder: "T\xECm ki\u1EBFm c\u1EEDa h\xE0ng...",
    placeholderTextColor: "#9AA0A6"
  }), /*#__PURE__*/React.createElement(FlatList, {
    data: filteredShops,
    keyExtractor: item => String(item.shopId),
    renderItem: ({
      item
    }) => /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: [styles.option, selectedShop?.shopId === item.shopId && styles.optionSelected],
      onPress: () => {
        onSelectShop(item);
        setShowShop(false);
        setShopSearch('');
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.optionText
    }, item.shopNameVN))
  })))));
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DADCE0',
    padding: 14,
    marginBottom: 8
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  btnEmployee: {
    backgroundColor: '#34A853'
  },
  btnShop: {
    backgroundColor: '#FBBC04'
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%'
  },
  sheetTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    padding: 16
  },
  search: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0'
  },
  optionSelected: {
    backgroundColor: '#E8F0FE'
  },
  optionText: {
    fontSize: 15,
    color: '#202124'
  }
});
//# sourceMappingURL=FormUserInfo.js.map