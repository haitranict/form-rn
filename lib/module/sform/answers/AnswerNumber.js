import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
function formatThousand(val) {
  const clean = val.replace(/,/g, '');
  if (clean === '' || isNaN(Number(clean))) return val;
  return Number(clean).toLocaleString('en-US');
}
export function AnswerNumber({
  question,
  onChange
}) {
  const raw = question.anwserItem[0].anwserValue;
  const [display, setDisplay] = useState(raw ? formatThousand(raw) : '');
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = text => {
    const clean = text.replace(/,/g, '');
    setDisplay(formatThousand(clean));
    onChange(question, clean);
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.row, isFocused && styles.focused]
  }, /*#__PURE__*/React.createElement(TextInput, {
    style: styles.input,
    value: display === '' ? undefined : display,
    onChangeText: handleChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder: "Nh\u1EADp c\xE2u tr\u1EA3 l\u1EDDi (Number)",
    placeholderTextColor: "#9AA0A6",
    keyboardType: "numeric"
  }));
}
const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '60%'
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerNumber.js.map