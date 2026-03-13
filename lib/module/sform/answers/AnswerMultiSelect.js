import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
export function AnswerMultiSelect({
  question,
  onChange
}) {
  const anwserName = question.anwserItem[0].anwserName;
  const rawValue = question.anwserItem[0].anwserValue;
  const [open, setOpen] = useState(false);
  let options = [];
  try {
    options = JSON.parse(anwserName);
  } catch {/* ignore */}
  let selected = [];
  try {
    const v = JSON.parse(rawValue);
    if (Array.isArray(v)) {
      // Handle both formats: string[] or object[]
      selected = v.map(x => typeof x === 'object' && x.name ? x.name : String(x));
    }
  } catch {/* ignore */}
  const toggle = item => {
    const exists = selected.includes(item);
    const next = exists ? selected.filter(s => s !== item) : [...selected, item];
    // Save as simple string array instead of object array
    onChange(question, next);
  };
  const displayText = selected.length > 0 ? selected.join(', ') : 'Chọn câu trả lời';
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.trigger,
    onPress: () => setOpen(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.triggerText, selected.length === 0 && styles.placeholder],
    numberOfLines: 2
  }, displayText), /*#__PURE__*/React.createElement(Text, {
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
  }, /*#__PURE__*/React.createElement(FlatList, {
    data: options,
    keyExtractor: item => item,
    renderItem: ({
      item
    }) => {
      const checked = selected.includes(item);
      return /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: styles.option,
        onPress: () => toggle(item)
      }, /*#__PURE__*/React.createElement(View, {
        style: [styles.box, checked && styles.boxChecked]
      }, checked && /*#__PURE__*/React.createElement(Text, {
        style: styles.checkmark
      }, "\u2713")), /*#__PURE__*/React.createElement(Text, {
        style: styles.optionText
      }, item));
    }
  }), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.doneBtn,
    onPress: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.doneText
  }, "Xong"))))));
}
const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0'
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DADCE0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  boxChecked: {
    borderColor: '#4285F4',
    backgroundColor: '#4285F4'
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  optionText: {
    fontSize: 16,
    color: '#202124'
  },
  doneBtn: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DADCE0'
  },
  doneText: {
    color: '#4285F4',
    fontWeight: '600',
    fontSize: 16
  }
});
//# sourceMappingURL=AnswerMultiSelect.js.map