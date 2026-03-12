import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
export function AnswerInput({
  question,
  onChange
}) {
  const value = question.anwserItem[0].anwserValue;
  const [isFocused, setIsFocused] = useState(false);
  return /*#__PURE__*/React.createElement(TextInput, {
    style: [styles.input, isFocused && styles.focused],
    value: value === '' ? undefined : value,
    onChangeText: text => onChange(question, text),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder: "Nh\u1EADp c\xE2u tr\u1EA3 l\u1EDDi",
    placeholderTextColor: "#9AA0A6"
  });
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#202124',
    backgroundColor: '#fff',
    minHeight: 48
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2
  }
});
//# sourceMappingURL=AnswerInput.js.map