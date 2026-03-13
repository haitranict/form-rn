"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerImage = AnswerImage;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerImage({
  question,
  onChange,
  onDelete,
  onUpload,
  onPickFromGallery,
  onCaptureFromCamera
}) {
  const raw = question.anwserItem[0].anwserValue;
  let images = [];
  try {
    if (raw) images = JSON.parse(raw);
  } catch {/* ignore */}
  const handlePickFromGallery = () => {
    if (onPickFromGallery) {
      onPickFromGallery(question);
    } else {
      _reactNative.Alert.alert('Image Picker', 'Vui lòng truyền callback onPickFromGallery để chọn ảnh từ gallery');
    }
  };
  const handleCaptureFromCamera = () => {
    if (onCaptureFromCamera) {
      onCaptureFromCamera(question);
    } else {
      _reactNative.Alert.alert('Camera', 'Vui lòng truyền callback onCaptureFromCamera để chụp ảnh');
    }
  };
  const handleClear = () => {
    onChange(question, 'clear');
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false
  }, images.map(url => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: url,
    style: styles.imgWrapper
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: url
    },
    style: styles.img
  }), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.deleteBtn,
    onPress: () => onDelete(question.questionId, url)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.deleteText
  }, "\u2715"))))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.actions
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.btn,
    onPress: handlePickFromGallery
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83D\uDDBC"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Th\u01B0 vi\u1EC7n")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.btn,
    onPress: handleCaptureFromCamera
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83D\uDCF7"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Ch\u1EE5p \u1EA3nh")), images.length > 0 && /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, styles.clearBtn],
    onPress: handleClear
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Xo\xE1 t\u1EA5t c\u1EA3"))));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 8,
    minHeight: 100
  },
  imgWrapper: {
    position: 'relative',
    marginRight: 8
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 6
  },
  deleteBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EA4335',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700'
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
    fontSize: 18,
    marginRight: 4
  },
  btnText: {
    fontSize: 14,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerImage.js.map