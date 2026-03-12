import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
export function AnswerAudio({
  question,
  onChange,
  onUpload
}) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch {/* ignore */}
  const handlePick = () => {
    // NOTE: Cần react-native-document-picker
    // import DocumentPicker from 'react-native-document-picker';
    Alert.alert('Audio Picker', 'Tích hợp react-native-document-picker ở đây');
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, audioUrls.map((url, idx) => /*#__PURE__*/React.createElement(View, {
    key: url,
    style: styles.audioRow
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.audioIcon
  }, "\uD83C\uDFB5"), /*#__PURE__*/React.createElement(Text, {
    style: styles.audioUrl,
    numberOfLines: 1
  }, url))), /*#__PURE__*/React.createElement(View, {
    style: styles.actions
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.btn,
    onPress: handlePick
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnIcon
  }, "\uD83C\uDFA4"), /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText
  }, "Ch\u1ECDn \xE2m thanh")), audioUrls.length > 0 && /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, styles.clearBtn],
    onPress: () => onChange(question, 'clear')
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText
  }, "Xo\xE1"))));
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 8,
    minHeight: 70
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  audioIcon: {
    fontSize: 18,
    marginRight: 8
  },
  audioUrl: {
    flex: 1,
    fontSize: 13,
    color: '#5F6368'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  clearBtn: {
    borderColor: '#EA4335'
  },
  btnIcon: {
    fontSize: 16,
    marginRight: 4
  },
  btnText: {
    fontSize: 14,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerAudio.js.map