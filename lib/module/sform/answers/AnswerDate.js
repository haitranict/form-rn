import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
export function AnswerDate({
  question,
  onChange
}) {
  const raw = question.anwserItem[0].anwserValue;
  const dateValue = raw ? new Date(raw) : new Date();
  const [show, setShow] = useState(false);
  const displayText = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'Chọn ngày';
  const minDate = question.min ? new Date(question.min) : undefined;
  const maxDate = question.max ? new Date(question.max) : undefined;
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.trigger,
    onPress: () => setShow(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, !raw && styles.placeholder]
  }, displayText), /*#__PURE__*/React.createElement(Text, {
    style: styles.icon
  }, "\uD83D\uDCC5")), show && /*#__PURE__*/React.createElement(DateTimePicker, {
    value: dateValue,
    mode: "date",
    display: "spinner",
    onChange: (_, date) => {
      setShow(Platform.OS === 'ios');
      onChange(question, date ?? null);
    },
    minimumDate: minDate,
    maximumDate: maxDate
  }));
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
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    minWidth: 200
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#202124'
  },
  placeholder: {
    color: '#9AA0A6'
  },
  icon: {
    fontSize: 18
  }
});
//# sourceMappingURL=AnswerDate.js.map