"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuestionItem = QuestionItem;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _AnswerRenderer = require("../answers/AnswerRenderer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function formatConstraint(min, max, ansType) {
  if (!min && !max) return null;
  const label = ansType === 7 || ansType === 8 ? 'Số lượng hình' : 'Giá trị';
  const parts = [];
  if (min) parts.push(`${label} tối thiểu: ${min}`);
  if (max) parts.push(`${label} tối đa: ${max}`);
  return parts.join(' - ');
}
function QuestionItem({
  question,
  checkItem,
  provinces,
  districts,
  towns,
  cameraImages,
  onCapture,
  onDeleteCameraImage,
  onDeleteUploadedImage,
  onUploadImages,
  onUploadAudio,
  onPickImageFromGallery,
  onCaptureImageFromCamera,
  onRecordAudio,
  onPickAudioFromFiles,
  onChange
}) {
  // Ẩn nếu checkList bảo không hiển thị
  if (!checkItem?.isShow) return null;
  const ansType = question.anwserItem[0]?.anwserType ?? 0;
  const constraint = formatConstraint(question.min, question.max, ansType);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.card
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.header
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.questionText
  }, question.questionName, question.required && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.required
  }, " *")), constraint && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.constraint
  }, "( ", constraint, " )")), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.answerContainer
  }, /*#__PURE__*/_react.default.createElement(_AnswerRenderer.AnswerRenderer, {
    question: question,
    provinces: provinces,
    districts: districts,
    towns: towns,
    cameraImages: cameraImages,
    onCapture: onCapture,
    onDeleteCameraImage: onDeleteCameraImage,
    onDeleteUploadedImage: onDeleteUploadedImage,
    onUploadImages: onUploadImages,
    onUploadAudio: onUploadAudio,
    onPickImageFromGallery: onPickImageFromGallery,
    onCaptureImageFromCamera: onCaptureImageFromCamera,
    onRecordAudio: onRecordAudio,
    onPickAudioFromFiles: onPickAudioFromFiles,
    onChange: onChange
  })));
}
const styles = _reactNative.StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  header: {
    marginBottom: 16
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#202124',
    lineHeight: 24,
    letterSpacing: 0.1
  },
  required: {
    color: '#EA4335',
    fontSize: 17,
    fontWeight: '700'
  },
  constraint: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 6,
    fontStyle: 'italic'
  },
  answerContainer: {
    minHeight: 48
  },
  imageGrid: {
    marginTop: 12
  },
  thumbnailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  }
});
//# sourceMappingURL=QuestionItem.js.map