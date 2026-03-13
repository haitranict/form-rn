import React from 'react';
import {
  View, Image, TouchableOpacity, Text, ScrollView, StyleSheet, Alert,
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
}

export function AnswerImage({ question, onChange, onDelete, onUpload, onPickFromGallery, onCaptureFromCamera }: Props) {
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((url) => (
          <View key={url} style={styles.imgWrapper}>
            <Image source={{ uri: url }} style={styles.img} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(question.questionId, url)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={handlePickFromGallery}>
          <Text style={styles.btnIcon}>🖼</Text>
          <Text style={styles.btnText}>Thư viện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleCaptureFromCamera}>
          <Text style={styles.btnIcon}>📷</Text>
          <Text style={styles.btnText}>Chụp ảnh</Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={handleClear}>
            <Text style={styles.btnText}>Xoá tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#4285F4', borderRadius: 8, padding: 8, minHeight: 100 },
  imgWrapper: { position: 'relative', marginRight: 8 },
  img: { width: 80, height: 80, borderRadius: 6 },
  deleteBtn: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#EA4335', borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  deleteText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  btn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#4285F4', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  clearBtn: { borderColor: '#EA4335' },
  btnIcon: { fontSize: 18, marginRight: 4 },
  btnText: { fontSize: 14, color: '#202124' },
});
