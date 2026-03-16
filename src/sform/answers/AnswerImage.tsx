import React from 'react';
import {
  View, Image, TouchableOpacity, Text, ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: string) => void;
  onDelete: (questionId: number, url: string) => void;
  onUpload: (
    files: Array<{ uri: string; name: string; type: string }>,
    question: Question
  ) => void;
  onPickFromGallery?: (question: Question) => void;
  onCaptureFromCamera?: (question: Question) => void;
  /** Base path for files directory in app (e.g., ReactNativeFS.DocumentDirectoryPath) */
  filesBasePath?: string;
}

/**
 * Normalize image URI for display
 * Handles paths like: file://20260313/xxx.jpg or absolute paths
 */
function normalizeImageUri(uri: string, basePath?: string): string {
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
  // e.g., file://20260316/xxx.jpg
  if (uri.startsWith('file://')) {
    const relativePath = uri.substring(7); // Remove 'file://'
    if (basePath) {
      const cleanBase = basePath.replace(/\/$/, ''); // Remove trailing slash
      // Check if basePath already has file:// scheme
      if (cleanBase.startsWith('file://')) {
        return `${cleanBase}/${relativePath}`;
      }
      // basePath is plain path, add file:// scheme
      return `file://${cleanBase}/${relativePath}`;
    }
    return uri; // No basePath, return as-is
  }
  
  // Plain relative path (no scheme)
  // e.g., 20260316/xxx.jpg
  if (basePath && !uri.startsWith('/')) {
    const cleanBase = basePath.replace(/\/$/, ''); // Remove trailing slash
    // Check if basePath already has file:// scheme
    if (cleanBase.startsWith('file://')) {
      return `${cleanBase}/${uri}`;
    }
    // basePath is plain path, add file:// scheme
    return `file://${cleanBase}/${uri}`;
  }
  
  // Absolute local path without file:// scheme
  // e.g., /data/user/0/com.app/files/xxx.jpg
  if (uri.startsWith('/')) {
    return `file://${uri}`;
  }
  
  // Fallback: return as-is
  return uri;
}

export function AnswerImage({ question, onChange, onDelete, onUpload, onPickFromGallery, onCaptureFromCamera, filesBasePath }: Props) {
  const raw = question.anwserItem[0].anwserValue;
  let images: string[] = [];
  try {
    if (raw) images = JSON.parse(raw);
  } catch { /* ignore */ }

  const handlePickFromGallery = () => {
    if (onPickFromGallery) {
      onPickFromGallery(question);
    } else {
      Alert.alert('Image Picker', 'Vui lòng truyền callback onPickFromGallery để chọn ảnh từ gallery');
    }
  };

  const handleCaptureFromCamera = () => {
    if (onCaptureFromCamera) {
      onCaptureFromCamera(question);
    } else {
      Alert.alert('Camera', 'Vui lòng truyền callback onCaptureFromCamera để chụp ảnh');
    }
  };

  const handleClear = () => {
    onChange(question, 'clear');
  };

  return (
    <View style={styles.container}>
      {images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {images.map((url, index) => {
            const displayUri = normalizeImageUri(url, filesBasePath);
            console.log(`[AnswerImage] Image ${index + 1}: original="${url}" → display="${displayUri}"`);
            return (
              <View key={`${url}_${index}`} style={styles.imgWrapper}>
                <Image 
                  source={{ uri: displayUri }} 
                  style={styles.img}
                  resizeMode="cover"
                  onError={(e) => {
                    console.error(`[AnswerImage] Failed to load image: ${displayUri}`, e.nativeEvent);
                  }}
                  onLoad={() => {
                    console.log(`[AnswerImage] Successfully loaded: ${displayUri}`);
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDelete(question.questionId, url)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.imageCount}>
                  <Text style={styles.imageCountText}>{index + 1}/{images.length}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={handlePickFromGallery}
          activeOpacity={0.7}
        >
          <Text style={styles.btnIcon}>🖼</Text>
          <Text style={styles.btnText}>Thư viện</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleCaptureFromCamera}
          activeOpacity={0.7}
        >
          <Text style={styles.btnIcon}>📷</Text>
          <Text style={styles.btnText}>Chụp ảnh</Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <TouchableOpacity 
            style={[styles.btn, styles.clearBtn]} 
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnText, styles.clearBtnText]}>Xoá tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 12, 
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  imgWrapper: { 
    position: 'relative', 
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  img: { 
    width: 120, 
    height: 120, 
    borderRadius: 8,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  deleteText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '700',
    lineHeight: 14,
  },
  imageCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  actions: { 
    flexDirection: 'row', 
    marginTop: 12, 
    gap: 8,
    flexWrap: 'wrap',
  },
  btn: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1.5, 
    borderColor: '#4285F4', 
    borderRadius: 8,
    paddingHorizontal: 14, 
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  clearBtn: { 
    borderColor: '#EA4335',
    backgroundColor: '#FFF5F5',
  },
  btnIcon: { 
    fontSize: 18, 
    marginRight: 6,
  },
  btnText: { 
    fontSize: 14, 
    color: '#202124',
    fontWeight: '500',
  },
  clearBtnText: {
    color: '#EA4335',
  },
});
