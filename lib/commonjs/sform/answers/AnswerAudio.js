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
  onUpload,
  onRecord,
  onPickFromFiles
}) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch {/* ignore */}

  // Check max limit
  const max = question.max ? Number(question.max) : 0;
  const isMaxReached = max > 0 && audioUrls.length >= max;
  const handleRecord = () => {
    if (isMaxReached) {
      _reactNative.Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi ghi âm mới.`);
      return;
    }
    if (onRecord) {
      onRecord(question);
    } else {
      _reactNative.Alert.alert('Ghi âm', 'Vui lòng truyền callback onRecord để ghi âm');
    }
  };
  const handlePickFromFiles = () => {
    if (isMaxReached) {
      _reactNative.Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi chọn file mới.`);
      return;
    }
    if (onPickFromFiles) {
      onPickFromFiles(question);
    } else {
      _reactNative.Alert.alert('Chọn file', 'Vui lòng truyền callback onPickFromFiles để chọn file audio');
    }
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
    style: [styles.btn, isMaxReached && styles.btnDisabled],
    onPress: handleRecord,
    disabled: isMaxReached
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83C\uDFA4"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.btnText, isMaxReached && styles.btnTextDisabled]
  }, "Ghi \xE2m")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, isMaxReached && styles.btnDisabled],
    onPress: handlePickFromFiles,
    disabled: isMaxReached
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83D\uDCC1"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.btnText, isMaxReached && styles.btnTextDisabled]
  }, "Ch\u1ECDn file")), audioUrls.length > 0 && /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
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
  btnDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
    opacity: 0.6
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
  },
  btnTextDisabled: {
    color: '#999999'
  }
});
//# sourceMappingURL=AnswerAudio.js.map