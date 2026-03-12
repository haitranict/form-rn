"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerCamera = AnswerCamera;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerCamera({
  question,
  cameraImages,
  onCapture,
  onDelete
}) {
  const myImages = cameraImages.filter(img => img.questionId === question.questionId);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false
  }, myImages.map(img => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: img.index,
    style: styles.imgWrapper
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: img.imageData
    },
    style: styles.img
  }), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.deleteBtn,
    onPress: () => onDelete(img.index)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.deleteText
  }, "\u2715"))))), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.cameraBtn,
    onPress: onCapture
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.cameraIcon
  }, "\uD83D\uDCF7"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.cameraText
  }, "Ch\u1EE5p \u1EA3nh")));
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
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#34A853',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start'
  },
  cameraIcon: {
    fontSize: 18,
    marginRight: 6
  },
  cameraText: {
    fontSize: 14,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerCamera.js.map