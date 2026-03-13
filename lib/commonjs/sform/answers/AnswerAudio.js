"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerAudio = AnswerAudio;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerAudio({
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
    _reactNative.Alert.alert('Audio Picker', 'Tích hợp react-native-document-picker ở đây');
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, audioUrls.map((url, idx) => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: url,
    style: styles.audioRow
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.audioIcon
  }, "\uD83C\uDFB5"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.audioUrl,
    numberOfLines: 1
  }, url))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.actions
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.btn,
    onPress: handlePick
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83C\uDFA4"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Ch\u1ECDn \xE2m thanh")), audioUrls.length > 0 && /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, styles.clearBtn],
    onPress: () => onChange(question, 'clear')
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Xo\xE1"))));
}
const styles = _reactNative.StyleSheet.create({
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