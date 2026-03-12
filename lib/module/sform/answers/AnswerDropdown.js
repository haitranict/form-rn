import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet, SafeAreaView } from 'react-native';
export function AnswerDropdown({
  question,
  onChange
}) {
  const anwserName = question.anwserItem[0].anwserName;
  const rawValue = question.anwserItem[0].anwserValue;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  let options = [];
  try {
    options = JSON.parse(anwserName);
  } catch {/* ignore */}
  let selected = '';
  try {
    const v = JSON.parse(rawValue);
    selected = typeof v === 'object' ? v?.name ?? '' : String(v);
  } catch {
    selected = rawValue;
  }
  const filtered = search ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options;
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.trigger,
    onPress: () => setOpen(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.triggerText, !selected && styles.placeholder]
  }, selected || 'Chọn câu trả lời'), /*#__PURE__*/React.createElement(Text, {
    style: styles.arrow
  }, "\u25BC")), /*#__PURE__*/React.createElement(Modal, {
    visible: open,
    transparent: true,
    animationType: "slide",
    onRequestClose: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.overlay
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.sheet
  }, /*#__PURE__*/React.createElement(TextInput, {
    style: styles.search,
    value: search,
    onChangeText: setSearch,
    placeholder: "T\xECm ki\u1EBFm...",
    placeholderTextColor: "#9AA0A6"
  }), /*#__PURE__*/React.createElement(FlatList, {
    data: filtered,
    keyExtractor: item => item,
    renderItem: ({
      item
    }) => /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.option,
      onPress: () => {
        onChange(question, {
          name: item,
          value: item
        });
        setOpen(false);
        setSearch('');
      }
    }, /*#__PURE__*/React.createElement(Text, {
      style: [styles.optionText, item === selected && styles.optionSelected]
    }, item))
  })))));
}
const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: '#202124'
  },
  placeholder: {
    color: '#9AA0A6'
  },
  arrow: {
    fontSize: 12,
    color: '#5F6368'
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
    maxHeight: '60%'
  },
  search: {
    margin: 12,
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
  optionText: {
    fontSize: 16,
    color: '#202124'
  },
  optionSelected: {
    color: '#4285F4',
    fontWeight: '600'
  }
});
//# sourceMappingURL=AnswerDropdown.js.map