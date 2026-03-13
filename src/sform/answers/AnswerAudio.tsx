import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: string) => void;
  onUpload: (
    files: Array<{ uri: string; name: string; type: string }>,
    question: Question
  ) => void;
  onRecord?: (question: Question) => void;
  onPickFromFiles?: (question: Question) => void;
}

export function AnswerAudio({ question, onChange, onUpload, onRecord, onPickFromFiles }: Props) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls: string[] = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch { /* ignore */ }

  const handleRecord = () => {
    if (onRecord) {
      onRecord(question);
    } else {
      Alert.alert('Ghi âm', 'Vui lòng truyền callback onRecord để ghi âm');
    }
  };

  const handlePickFromFiles = () => {
    if (onPickFromFiles) {
      onPickFromFiles(question);
    } else {
      Alert.alert('Chọn file', 'Vui lòng truyền callback onPickFromFiles để chọn file audio');
    }
  };

  return (
    <View style={styles.container}>
      {audioUrls.map((url, idx) => (
        <View key={url} style={styles.audioRow}>
          <Text style={styles.audioIcon}>🎵</Text>
          <Text style={styles.audioUrl} numberOfLines={1}>{url}</Text>
        </View>
      ))}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={handleRecord}>
          <Text style={styles.btnIcon}>🎤</Text>
          <Text style={styles.btnText}>Ghi âm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handlePickFromFiles}>
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={styles.btnText}>Chọn file</Text>
        </TouchableOpacity>
        {audioUrls.length > 0 && (
          <TouchableOpacity
            style={[styles.btn, styles.clearBtn]}
            onPress={() => onChange(question, 'clear')}
          >
            <Text style={styles.btnText}>Xoá</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#4285F4', borderRadius: 8, padding: 8, minHeight: 70 },
  audioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  audioIcon: { fontSize: 18, marginRight: 8 },
  audioUrl: { flex: 1, fontSize: 13, color: '#5F6368' },
  actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  btn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#4285F4', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  clearBtn: { borderColor: '#EA4335' },
  btnIcon: { fontSize: 16, marginRight: 4 },
  btnText: { fontSize: 14, color: '#202124' },
});
