import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerRenderer } from '../answers/AnswerRenderer';
function formatConstraint(min, max, ansType) {
  if (!min && !max) return null;
  const label = ansType === 7 || ansType === 8 ? 'Số lượng hình' : 'Giá trị';
  const parts = [];
  if (min) parts.push(`${label} tối thiểu: ${min}`);
  if (max) parts.push(`${label} tối đa: ${max}`);
  return parts.join(' - ');
}
export function QuestionItem({
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
  filesBasePath,
  onChange
}) {
  // Ẩn nếu checkList bảo không hiển thị
  if (!checkItem?.isShow) return null;
  const ansType = question.anwserItem[0]?.anwserType ?? 0;
  const constraint = formatConstraint(question.min, question.max, ansType);
  return /*#__PURE__*/React.createElement(View, {
    style: styles.card
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.header
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.questionText
  }, question.questionName, question.required && /*#__PURE__*/React.createElement(Text, {
    style: styles.required
  }, " *")), constraint && /*#__PURE__*/React.createElement(Text, {
    style: styles.constraint
  }, "( ", constraint, " )")), /*#__PURE__*/React.createElement(View, {
    style: styles.answerContainer
  }, /*#__PURE__*/React.createElement(AnswerRenderer, {
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
    filesBasePath: filesBasePath,
    onChange: onChange
  })));
}
const styles = StyleSheet.create({
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