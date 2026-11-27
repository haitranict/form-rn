import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore - peerDependency provided by host app
import Sound from 'react-native-nitro-sound';
// @ts-ignore - peerDependency provided by host app
import { isCancel, pick, types } from '@react-native-documents/picker';
import type { Question } from '../types/sform.types';

interface RecordBackType {
  currentPosition: number;
  currentMetering?: number;
}

interface Props {
  question: Question;
  onChange: (question: Question, value: string) => void;
  onUpload?: (
    files: Array<{ uri: string; name: string; type: string }>,
    question: Question
  ) => void | Promise<void>;
  onRecord?: (question: Question, audioUri?: string) => void;
  onPickFromFiles?: (question: Question, audioUri?: string) => void;
}

const isLocalAudioUri = (uri: string): boolean => {
  if (!uri) return false;
  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    (uri.startsWith('/') && !uri.startsWith('/uploaded'))
  );
};

const getAudioDisplayName = (uri: string): string => {
  if (!uri) return 'audio';
  const clean = uri.split('?')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || uri;
};

export function AnswerAudio({
  question,
  onChange,
  onRecord,
  onPickFromFiles,
}: Props) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls: string[] = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch { /* ignore */ }

  const [recordVisible, setRecordVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');

  useEffect(() => {
    return () => {
      Sound.removeRecordBackListener();
      Sound.stopRecorder().catch(() => {});
    };
  }, []);

  const max = question.max ? Number(question.max) : 0;
  const isMaxReached = max > 0 && audioUrls.length >= max;

  const requestMicPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Quyền ghi âm',
          message: 'Ứng dụng cần quyền sử dụng micro để ghi âm.',
          buttonNegative: 'Hủy',
          buttonPositive: 'Đồng ý',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const requestAudioReadPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const perm =
        Number(Platform.Version) >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.request(perm, {
        title: 'Quyền truy cập âm thanh',
        message: 'Ứng dụng cần quyền đọc tệp âm thanh từ thiết bị.',
        buttonNegative: 'Hủy',
        buttonPositive: 'Đồng ý',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const handleOpenRecorder = async () => {
    if (isMaxReached) {
      Alert.alert(
        'Giới hạn',
        `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi ghi âm mới.`
      );
      return;
    }
    const hasPerm = await requestMicPermission();
    if (!hasPerm) {
      Alert.alert('Thông báo', 'Chưa cấp quyền sử dụng micro để ghi âm.');
      return;
    }
    setRecordTime('00:00:00');
    setIsRecording(false);
    setRecordVisible(true);
  };

  const handleStartRecord = async () => {
    try {
      Sound.removeRecordBackListener();
      Sound.addRecordBackListener((e: RecordBackType) => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });
      await Sound.startRecorder();
      setIsRecording(true);
    } catch (error: any) {
      Sound.removeRecordBackListener();
      Alert.alert('Lỗi ghi âm', error?.message || 'Không thể bắt đầu ghi âm.');
    }
  };

  const handleStopAndSave = async () => {
    try {
      const resultUri = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setRecordVisible(false);

      if (!resultUri) {
        Alert.alert('Lỗi', 'Không lấy được file ghi âm.');
        return;
      }

      const normalizedUri =
        resultUri.startsWith('file://') || resultUri.startsWith('content://')
          ? resultUri
          : `file://${resultUri}`;

      // Lưu đường dẫn local vào câu trả lời; khi bấm Gửi form sẽ upload lên server
      const nextUrls = [...audioUrls, normalizedUri];
      onChange(question, JSON.stringify(nextUrls));
      if (onRecord) {
        onRecord(question, normalizedUri);
      }
    } catch (error: any) {
      Sound.removeRecordBackListener();
      setIsRecording(false);
      Alert.alert('Lỗi', error?.message || 'Không thể lưu file ghi âm.');
    }
  };

  const handleCloseModal = async () => {
    if (isRecording) {
      try {
        await Sound.stopRecorder();
      } catch { /* ignore */ }
      Sound.removeRecordBackListener();
      setIsRecording(false);
    }
    setRecordVisible(false);
  };

  const handlePickFromFiles = async () => {
    if (isMaxReached) {
      Alert.alert(
        'Giới hạn',
        `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi chọn file mới.`
      );
      return;
    }
    const hasPerm = await requestAudioReadPermission();
    if (!hasPerm) {
      Alert.alert('Thông báo', 'Chưa cấp quyền đọc tệp âm thanh từ thiết bị.');
      return;
    }

    try {
      const result = await pick({
        type: [types.audio],
        allowMultiSelection: false,
      });
      const file = result?.[0];
      if (!file?.uri) {
        return;
      }

      // Lưu đường dẫn local vào câu trả lời; khi bấm Gửi form sẽ upload lên server
      const nextUrls = [...audioUrls, file.uri];
      onChange(question, JSON.stringify(nextUrls));
      if (onPickFromFiles) {
        onPickFromFiles(question, file.uri);
      }
    } catch (err: any) {
      if (isCancel(err)) {
        return;
      }
      Alert.alert('Lỗi', err?.message || 'Không thể chọn file âm thanh.');
    }
  };

  const handleRemoveItem = (idxToRemove: number) => {
    const nextUrls = audioUrls.filter((_, idx) => idx !== idxToRemove);
    onChange(question, nextUrls.length > 0 ? JSON.stringify(nextUrls) : 'clear');
  };

  return (
    <View style={styles.container}>
      {audioUrls.map((url, idx) => {
        const isLocal = isLocalAudioUri(url);
        return (
          <View key={`${url}_${idx}`} style={styles.audioRow}>
            <Text style={styles.audioIcon}>🎵</Text>
            <Text style={styles.audioUrl} numberOfLines={1}>
              {getAudioDisplayName(url)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isLocal ? styles.statusPending : styles.statusUploaded,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isLocal ? styles.statusPendingText : styles.statusUploadedText,
                ]}
              >
                {isLocal ? 'Chờ gửi' : 'Đã tải'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveItem(idx)}
              style={styles.removeItemBtn}
            >
              <Text style={styles.removeItemText}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, isMaxReached && styles.btnDisabled]}
          onPress={handleOpenRecorder}
          disabled={isMaxReached}
        >
          <Text style={styles.btnIcon}>🎤</Text>
          <Text style={[styles.btnText, isMaxReached && styles.btnTextDisabled]}>
            Ghi âm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, isMaxReached && styles.btnDisabled]}
          onPress={handlePickFromFiles}
          disabled={isMaxReached}
        >
          <Text style={styles.btnIcon}>📁</Text>
          <Text style={[styles.btnText, isMaxReached && styles.btnTextDisabled]}>
            Chọn file
          </Text>
        </TouchableOpacity>
        {audioUrls.length > 0 && (
          <TouchableOpacity
            style={[styles.btn, styles.clearBtn]}
            onPress={() => onChange(question, 'clear')}
          >
            <Text style={styles.btnText}>Xoá hết</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={recordVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ghi âm câu trả lời</Text>
            <Text style={styles.timerText}>{recordTime}</Text>
            <Text style={styles.hintText}>
              {isRecording ? 'Đang ghi âm...' : 'Nhấn Bắt đầu để ghi âm'}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={handleCloseModal}
              >
                <Text style={styles.modalCancelText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  isRecording ? styles.modalStopBtn : styles.modalStartBtn,
                ]}
                onPress={isRecording ? handleStopAndSave : handleStartRecord}
              >
                <Text style={styles.modalActionText}>
                  {isRecording ? 'Dừng & Lưu' : 'Bắt đầu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 8,
    minHeight: 70,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  audioIcon: { fontSize: 16, marginRight: 6 },
  audioUrl: { flex: 1, fontSize: 13, color: '#202124' },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusUploaded: { backgroundColor: '#DCFCE7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusPendingText: { color: '#B45309' },
  statusUploadedText: { color: '#15803D' },
  removeItemBtn: {
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  removeItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  actions: { flexDirection: 'row', marginTop: 6, gap: 8 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  clearBtn: { borderColor: '#EA4335' },
  btnIcon: { fontSize: 16, marginRight: 4 },
  btnText: { fontSize: 14, color: '#202124' },
  btnTextDisabled: { color: '#999999' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
  },
  timerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#202124',
    marginVertical: 14,
  },
  hintText: {
    fontSize: 13,
    color: '#5F6368',
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4043',
  },
  modalStartBtn: {
    backgroundColor: '#1A73E8',
  },
  modalStopBtn: {
    backgroundColor: '#D93025',
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
