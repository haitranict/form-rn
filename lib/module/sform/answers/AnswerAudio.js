import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore - peerDependency provided by host app
import Sound from 'react-native-nitro-sound';
// @ts-ignore - peerDependency provided by host app
import { isCancel, pick, types } from '@react-native-documents/picker';
export function AnswerAudio({
  question,
  onChange,
  onUpload,
  onRecord,
  onPickFromFiles
}) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch {/* ignore */}
  const [recordVisible, setRecordVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  useEffect(() => {
    return () => {
      Sound.removeRecordBackListener();
      Sound.stopRecorder().catch(() => {});
    };
  }, []);
  const max = question.max ? Number(question.max) : 0;
  const isMaxReached = max > 0 && audioUrls.length >= max;
  const requestMicPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Quyền ghi âm',
        message: 'Ứng dụng cần quyền sử dụng micro để ghi âm.',
        buttonNegative: 'Hủy',
        buttonPositive: 'Đồng ý'
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };
  const requestAudioReadPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    try {
      const perm = Number(Platform.Version) >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.request(perm, {
        title: 'Quyền truy cập âm thanh',
        message: 'Ứng dụng cần quyền đọc tệp âm thanh từ thiết bị.',
        buttonNegative: 'Hủy',
        buttonPositive: 'Đồng ý'
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };
  const handleOpenRecorder = async () => {
    if (isMaxReached) {
      Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi ghi âm mới.`);
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
      Sound.addRecordBackListener(e => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });
      await Sound.startRecorder();
      setIsRecording(true);
    } catch (error) {
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
      const normalizedUri = resultUri.startsWith('file://') || resultUri.startsWith('content://') ? resultUri : `file://${resultUri}`;
      const filePayload = {
        uri: normalizedUri,
        name: `audio_${Date.now()}.m4a`,
        type: 'audio/m4a'
      };
      setIsUploading(true);
      try {
        await onUpload([filePayload], question);
        if (onRecord) {
          onRecord(question, normalizedUri);
        }
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      Sound.removeRecordBackListener();
      setIsRecording(false);
      Alert.alert('Lỗi', error?.message || 'Không thể lưu file ghi âm.');
    }
  };
  const handleCloseModal = async () => {
    if (isRecording) {
      try {
        await Sound.stopRecorder();
      } catch {/* ignore */}
      Sound.removeRecordBackListener();
      setIsRecording(false);
    }
    setRecordVisible(false);
  };
  const handlePickFromFiles = async () => {
    if (isMaxReached) {
      Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi chọn file mới.`);
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
        allowMultiSelection: false
      });
      const file = result?.[0];
      if (!file?.uri) {
        return;
      }
      const filePayload = {
        uri: file.uri,
        name: file.name || `audio_${Date.now()}.mp3`,
        type: file.type || 'audio/mpeg'
      };
      setIsUploading(true);
      try {
        await onUpload([filePayload], question);
        if (onPickFromFiles) {
          onPickFromFiles(question, file.uri);
        }
      } finally {
        setIsUploading(false);
      }
    } catch (err) {
      if (isCancel(err)) {
        return;
      }
      Alert.alert('Lỗi', err?.message || 'Không thể chọn file âm thanh.');
    }
  };
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, audioUrls.map(url => /*#__PURE__*/React.createElement(View, {
    key: url,
    style: styles.audioRow
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.audioIcon
  }, "\uD83C\uDFB5"), /*#__PURE__*/React.createElement(Text, {
    style: styles.audioUrl,
    numberOfLines: 1
  }, url))), /*#__PURE__*/React.createElement(View, {
    style: styles.actions
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, (isMaxReached || isUploading) && styles.btnDisabled],
    onPress: handleOpenRecorder,
    disabled: isMaxReached || isUploading
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnIcon
  }, "\uD83C\uDFA4"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.btnText, (isMaxReached || isUploading) && styles.btnTextDisabled]
  }, isUploading ? 'Đang tải...' : 'Ghi âm')), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, (isMaxReached || isUploading) && styles.btnDisabled],
    onPress: handlePickFromFiles,
    disabled: isMaxReached || isUploading
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnIcon
  }, "\uD83D\uDCC1"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.btnText, (isMaxReached || isUploading) && styles.btnTextDisabled]
  }, "Ch\u1ECDn file")), audioUrls.length > 0 && /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.btn, styles.clearBtn],
    onPress: () => onChange(question, 'clear')
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnText
  }, "Xo\xE1"))), /*#__PURE__*/React.createElement(Modal, {
    visible: recordVisible,
    transparent: true,
    animationType: "fade",
    onRequestClose: handleCloseModal
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalBackdrop
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.modalCard
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.modalTitle
  }, "Ghi \xE2m c\xE2u tr\u1EA3 l\u1EDDi"), /*#__PURE__*/React.createElement(Text, {
    style: styles.timerText
  }, recordTime), /*#__PURE__*/React.createElement(Text, {
    style: styles.hintText
  }, isRecording ? 'Đang ghi âm...' : 'Nhấn Bắt đầu để ghi âm'), /*#__PURE__*/React.createElement(View, {
    style: styles.modalActions
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.modalBtn, styles.modalCancelBtn],
    onPress: handleCloseModal
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.modalCancelText
  }, "\u0110\xF3ng")), /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.modalBtn, isRecording ? styles.modalStopBtn : styles.modalStartBtn],
    onPress: isRecording ? handleStopAndSave : handleStartRecord
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.modalActionText
  }, isRecording ? 'Dừng & Lưu' : 'Bắt đầu')))))), isUploading && /*#__PURE__*/React.createElement(View, {
    style: styles.uploadingRow
  }, /*#__PURE__*/React.createElement(ActivityIndicator, {
    size: "small",
    color: "#1A73E8"
  }), /*#__PURE__*/React.createElement(Text, {
    style: styles.uploadingText
  }, "\u0110ang upload file \xE2m thanh...")));
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    padding: 8,
    minHeight: 70
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  audioIcon: {
    fontSize: 18,
    marginRight: 8
  },
  audioUrl: {
    flex: 1,
    fontSize: 13,
    color: '#5F6368'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  btnDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
    opacity: 0.6
  },
  clearBtn: {
    borderColor: '#EA4335'
  },
  btnIcon: {
    fontSize: 16,
    marginRight: 4
  },
  btnText: {
    fontSize: 14,
    color: '#202124'
  },
  btnTextDisabled: {
    color: '#999999'
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  uploadingText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#1A73E8'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124'
  },
  timerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#202124',
    marginVertical: 14
  },
  hintText: {
    fontSize: 13,
    color: '#5F6368',
    marginBottom: 18
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 10
  },
  modalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#DADCE0'
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4043'
  },
  modalStartBtn: {
    backgroundColor: '#1A73E8'
  },
  modalStopBtn: {
    backgroundColor: '#D93025'
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
//# sourceMappingURL=AnswerAudio.js.map