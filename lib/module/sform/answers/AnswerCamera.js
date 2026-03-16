import React from 'react';
import { View, Image, TouchableOpacity, Text, ScrollView, StyleSheet, Alert } from 'react-native';
/**
 * Normalize image URI for display
 */
function normalizeImageUri(uri, basePath) {
  if (!uri) return '';

  // Already absolute HTTP(S) URI
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  // Already absolute file path - return as-is
  if (uri.startsWith('file:///')) {
    return uri;
  }

  // Handle file:// prefix (relative path with scheme)
  if (uri.startsWith('file://')) {
    const relativePath = uri.substring(7);
    if (basePath) {
      const cleanBase = basePath.replace(/\/$/, '');
      if (cleanBase.startsWith('file://')) {
        return `${cleanBase}/${relativePath}`;
      }
      return `file://${cleanBase}/${relativePath}`;
    }
    return uri;
  }

  // Plain relative path (no scheme)
  if (basePath && !uri.startsWith('/')) {
    const cleanBase = basePath.replace(/\/$/, '');
    if (cleanBase.startsWith('file://')) {
      return `${cleanBase}/${uri}`;
    }
    return `file://${cleanBase}/${uri}`;
  }

  // Absolute local path without file:// scheme
  if (uri.startsWith('/')) {
    return `file://${uri}`;
  }
  return uri;
}
export function AnswerCamera({
  question,
  cameraImages,
  onCapture,
  onDelete,
  onCameraCapture,
  filesBasePath
}) {
  // Try to get images from question.anwserItem first (new callback pattern)
  const raw = question.anwserItem[0].anwserValue;
  let images = [];
  try {
    if (raw) images = JSON.parse(raw);
  } catch {/* ignore */}

  // Fallback to old cameraImages pattern if no images in question
  const myImages = images.length > 0 ? images : cameraImages.filter(img => img.questionId === question.questionId).map(img => img.imageData);
  const handleCameraCapture = () => {
    if (onCameraCapture) {
      onCameraCapture(question);
    } else {
      onCapture();
    }
  };
  const handleClear = () => {
    // For new pattern, we don't have onChange here, so just alert
    // User should use AnswerImage component with onChange if they want clear functionality
    Alert.alert('Xoá ảnh', 'Vui lòng sử dụng nút xoá từng ảnh');
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, myImages.length > 0 && /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.scrollContent
  }, myImages.map((url, index) => {
    const displayUri = normalizeImageUri(url, filesBasePath);
    console.log(`[AnswerCamera] Image ${index + 1}: original="${url}" → display="${displayUri}"`);
    return /*#__PURE__*/React.createElement(View, {
      key: `${url}_${index}`,
      style: styles.imgWrapper
    }, /*#__PURE__*/React.createElement(Image, {
      source: {
        uri: displayUri
      },
      style: styles.img,
      resizeMode: "cover",
      onError: e => {
        console.error(`[AnswerCamera] Failed to load image: ${displayUri}`, e.nativeEvent);
      },
      onLoad: () => {
        console.log(`[AnswerCamera] Successfully loaded: ${displayUri}`);
      }
    }), /*#__PURE__*/React.createElement(TouchableOpacity, {
      style: styles.deleteBtn,
      onPress: () => {
        // For new pattern, use index; for old pattern use image index
        if (images.length > 0) {
          // New pattern - cannot delete here without onChange callback
          Alert.alert('Xoá ảnh', 'Tính năng xoá chưa được hỗ trợ cho camera-only type. Vui lòng sử dụng Image type.');
        } else {
          // Old pattern
          const imgObj = cameraImages.find(img => img.imageData === url);
          if (imgObj) onDelete(imgObj.index);
        }
      },
      activeOpacity: 0.7
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.deleteText
    }, "\u2715")), /*#__PURE__*/React.createElement(View, {
      style: styles.imageCount
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.imageCountText
    }, index + 1, "/", myImages.length)));
  })), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: styles.cameraBtn,
    onPress: handleCameraCapture,
    activeOpacity: 0.7
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.cameraIcon
  }, "\uD83D\uDCF7"), /*#__PURE__*/React.createElement(Text, {
    style: styles.cameraText
  }, "Ch\u1EE5p \u1EA3nh")));
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 8,
    minHeight: 100
  },
  scrollContent: {
    paddingVertical: 8
  },
  imgWrapper: {
    position: 'relative',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  deleteBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EA4335',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  imageCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  imageCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#34A853',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#f8f9fa'
  },
  cameraIcon: {
    fontSize: 20,
    marginRight: 8
  },
  cameraText: {
    fontSize: 15,
    color: '#202124',
    fontWeight: '500'
  }
});
//# sourceMappingURL=AnswerCamera.js.map