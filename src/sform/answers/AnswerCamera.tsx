import React from 'react';
import {
  View, Image, TouchableOpacity, Text, ScrollView, StyleSheet, Alert,
} from 'react-native';
import type { Question } from '../types/sform.types';

interface CameraImage {
  index: number;
  questionId: number;
  imageData: string;
}

interface Props {
  question: Question;
  cameraImages: CameraImage[];
  onCapture: () => void;
  onDelete: (index: number) => void;
}

export function AnswerCamera({ question, cameraImages, onCapture, onDelete }: Props) {
  const myImages = cameraImages.filter((img) => img.questionId === question.questionId);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {myImages.map((img) => (
          <View key={img.index} style={styles.imgWrapper}>
            <Image source={{ uri: img.imageData }} style={styles.img} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(img.index)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.cameraBtn} onPress={onCapture}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>Chụp ảnh</Text>
      </TouchableOpacity>
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
  cameraBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8,
    borderWidth: 1, borderColor: '#34A853', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start',
  },
  cameraIcon: { fontSize: 18, marginRight: 6 },
  cameraText: { fontSize: 14, color: '#202124' },
});
