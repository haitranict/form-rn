import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
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
  dvhc2025,
  onChange
}) {
  // Ẩn nếu checkList bảo không hiển thị
  if (!checkItem?.isShow) return null;
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const ansType = question.anwserItem[0]?.anwserType ?? 0;
  const constraint = formatConstraint(question.min, question.max, ansType);

  // Check if question has images
  const questionImages = question.images || [];
  const hasImages = questionImages.length > 0;
  const handleImagePress = index => {
    setSelectedImageIndex(index);
    setViewerVisible(true);
  };
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
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
  }, "( ", constraint, " )")), hasImages && /*#__PURE__*/React.createElement(View, {
    style: styles.imageGrid
  }, /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false
  }, questionImages.map((img, index) => {
    const imageUrl = img.imageURL.startsWith('http') ? img.imageURL : `https://vnmpg.spiral.com.vn/${img.imageURL}`;
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      key: index,
      onPress: () => handleImagePress(index),
      activeOpacity: 0.8
    }, /*#__PURE__*/React.createElement(Image, {
      source: {
        uri: imageUrl
      },
      style: [styles.thumbnail, {
        height: img.imageHeight || 100
      }],
      resizeMode: "cover"
    }));
  }))), /*#__PURE__*/React.createElement(View, {
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
    dvhc2025: dvhc2025,
    onChange: onChange
  })), /*#__PURE__*/React.createElement(Modal, {
    visible: viewerVisible,
    transparent: true,
    animationType: "fade",
    onRequestClose: () => setViewerVisible(false)
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalContainer
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.modalBackdrop,
    activeOpacity: 1,
    onPress: () => setViewerVisible(false)
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalContent
  }, /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    contentOffset: {
      x: selectedImageIndex * screenWidth,
      y: 0
    }
  }, questionImages.map((img, index) => {
    const imageUrl = img.imageURL.startsWith('http') ? img.imageURL : `https://vnmpg.spiral.com.vn/${img.imageURL}`;
    return /*#__PURE__*/React.createElement(View, {
      key: index,
      style: {
        width: screenWidth,
        height: screenHeight
      }
    }, /*#__PURE__*/React.createElement(ScrollView, {
      maximumZoomScale: 3,
      minimumZoomScale: 1,
      contentContainerStyle: styles.zoomContainer
    }, /*#__PURE__*/React.createElement(Image, {
      source: {
        uri: imageUrl
      },
      style: styles.fullImage,
      resizeMode: "contain"
    })));
  })), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.closeButton,
    onPress: () => setViewerVisible(false)
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.closeButtonText
  }, "\u2715")), questionImages.length > 1 && /*#__PURE__*/React.createElement(View, {
    style: styles.imageCounter
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.imageCounterText
  }, selectedImageIndex + 1, " / ", questionImages.length)))))));
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
    marginTop: 8,
    marginBottom: 12
  },
  thumbnail: {
    width: 120,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)'
  },
  modalBackdrop: {
    flex: 1
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  imageCounter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
//# sourceMappingURL=QuestionItem.js.map