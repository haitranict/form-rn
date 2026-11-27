import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
export function AnswerDate({
  question,
  onChange
}) {
  const raw = question.anwserItem[0].anwserValue;
  const dateValue = raw ? new Date(raw) : new Date();
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(dateValue);
  const displayText = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'Chọn ngày';
  const minDate = question.min ? new Date(question.min) : undefined;
  const maxDate = question.max ? new Date(question.max) : undefined;
  const handleOpen = () => {
    const initial = raw ? new Date(raw) : new Date();
    setTempDate(initial);
    // Mặc định chọn ngày hiện tại ngay khi mở nếu chưa có giá trị
    if (!raw) {
      onChange(question, initial);
    }
    setShow(true);
  };
  const handleConfirmIOS = () => {
    onChange(question, tempDate);
    setShow(false);
  };
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.trigger,
    onPress: handleOpen,
    activeOpacity: 0.8
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.text, !raw && styles.placeholder]
  }, displayText), /*#__PURE__*/React.createElement(Text, {
    style: styles.icon
  }, "\uD83D\uDCC5")), Platform.OS === 'android' && show && /*#__PURE__*/React.createElement(DateTimePicker, {
    value: tempDate,
    mode: "date",
    display: "default",
    onChange: (event, date) => {
      setShow(false);
      if (event.type === 'set' && date) {
        setTempDate(date);
        onChange(question, date);
      }
    },
    minimumDate: minDate,
    maximumDate: maxDate
  }), Platform.OS === 'ios' && /*#__PURE__*/React.createElement(Modal, {
    visible: show,
    transparent: true,
    animationType: "fade",
    onRequestClose: () => setShow(false)
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalBackdrop
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalCard
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalHeader
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => setShow(false)
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.cancelText
  }, "H\u1EE7y")), /*#__PURE__*/React.createElement(Text, {
    style: styles.modalTitle
  }, "Ch\u1ECDn ng\xE0y"), /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: handleConfirmIOS
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.confirmText
  }, "X\xE1c nh\u1EADn"))), /*#__PURE__*/React.createElement(DateTimePicker, {
    value: tempDate,
    mode: "date",
    display: "spinner",
    themeVariant: "light",
    textColor: "#202124",
    onChange: (_, date) => {
      if (date) {
        setTempDate(date);
      }
    },
    minimumDate: minDate,
    maximumDate: maxDate,
    style: styles.iosPicker
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
    backgroundColor: '#FFFFFF',
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
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124'
  },
  cancelText: {
    fontSize: 15,
    color: '#5F6368'
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A73E8'
  },
  iosPicker: {
    backgroundColor: '#FFFFFF'
  }
});
//# sourceMappingURL=AnswerDate.js.map