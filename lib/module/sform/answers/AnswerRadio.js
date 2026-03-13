import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
export function AnswerRadio({
  question,
  onChange
}) {
  const answers = question.anwserItem.filter(a => a.id < 100);
  return /*#__PURE__*/React.createElement(View, null, answers.map(ans => {
    const checked = ans.anwserValue === 'true' || ans.anwserValue === true;
    return /*#__PURE__*/React.createElement(View, {
      key: ans.id
    }, /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.row,
      onPress: () => onChange(question, {
        id: ans.id
      }),
      activeOpacity: 0.7,
      accessibilityRole: "radio",
      accessibilityState: {
        checked
      }
    }, /*#__PURE__*/React.createElement(View, {
      style: [styles.outer, checked && styles.outerChecked]
    }, checked && /*#__PURE__*/React.createElement(View, {
      style: styles.inner
    })), /*#__PURE__*/React.createElement(Text, {
      style: styles.label
    }, ans.anwserName)), ans.id === 99 && checked && /*#__PURE__*/React.createElement(TextInput, {
      style: styles.otherInput,
      value: ans.ortherValue ?? '',
      onChangeText: text => onChange(question, {
        id: ans.id
      }, {
        ...ans,
        ortherValue: text
      }),
      placeholder: "Nh\u1EADp n\u1ED9i dung kh\xE1c",
      placeholderTextColor: "#9AA0A6"
    }));
  }));
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DADCE0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  outerChecked: {
    borderColor: '#4285F4'
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4'
  },
  label: {
    fontSize: 15,
    color: '#202124',
    flex: 1
  },
  otherInput: {
    marginLeft: 30,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#202124',
    marginBottom: 4
  }
});
//# sourceMappingURL=AnswerRadio.js.map