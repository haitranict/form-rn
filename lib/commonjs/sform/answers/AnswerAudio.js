"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerAudio = AnswerAudio;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeNitroSound = _interopRequireDefault(require("react-native-nitro-sound"));
var _picker = require("@react-native-documents/picker");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// @ts-ignore - peerDependency provided by host app

// @ts-ignore - peerDependency provided by host app

const isLocalAudioUri = uri => {
  if (!uri) return false;
  return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('/') && !uri.startsWith('/uploaded');
};
const getAudioDisplayName = uri => {
  if (!uri) return 'audio';
  const clean = uri.split('?')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || uri;
};
function AnswerAudio({
  question,
  onChange,
  onRecord,
  onPickFromFiles
}) {
  const raw = question.anwserItem[0].anwserValue;
  let audioUrls = [];
  try {
    if (raw) audioUrls = JSON.parse(raw);
  } catch {/* ignore */}
  const [recordVisible, setRecordVisible] = (0, _react.useState)(false);
  const [isRecording, setIsRecording] = (0, _react.useState)(false);
  const [recordTime, setRecordTime] = (0, _react.useState)('00:00:00');
  (0, _react.useEffect)(() => {
    return () => {
      _reactNativeNitroSound.default.removeRecordBackListener();
      _reactNativeNitroSound.default.stopRecorder().catch(() => {});
    };
  }, []);
  const max = question.max ? Number(question.max) : 0;
  const isMaxReached = max > 0 && audioUrls.length >= max;
  const requestMicPermission = async () => {
    if (_reactNative.Platform.OS !== 'android') {
      return true;
    }
    try {
      const granted = await _reactNative.PermissionsAndroid.request(_reactNative.PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Quyền ghi âm',
        message: 'Ứng dụng cần quyền sử dụng micro để ghi âm.',
        buttonNegative: 'Hủy',
        buttonPositive: 'Đồng ý'
      });
      return granted === _reactNative.PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };
  const requestAudioReadPermission = async () => {
    if (_reactNative.Platform.OS !== 'android') {
      return true;
    }
    try {
      const perm = Number(_reactNative.Platform.Version) >= 33 ? _reactNative.PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO : _reactNative.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const granted = await _reactNative.PermissionsAndroid.request(perm, {
        title: 'Quyền truy cập âm thanh',
        message: 'Ứng dụng cần quyền đọc tệp âm thanh từ thiết bị.',
        buttonNegative: 'Hủy',
        buttonPositive: 'Đồng ý'
      });
      return granted === _reactNative.PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };
  const handleOpenRecorder = async () => {
    if (isMaxReached) {
      _reactNative.Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi ghi âm mới.`);
      return;
    }
    const hasPerm = await requestMicPermission();
    if (!hasPerm) {
      _reactNative.Alert.alert('Thông báo', 'Chưa cấp quyền sử dụng micro để ghi âm.');
      return;
    }
    setRecordTime('00:00:00');
    setIsRecording(false);
    setRecordVisible(true);
  };
  const handleStartRecord = async () => {
    try {
      _reactNativeNitroSound.default.removeRecordBackListener();
      _reactNativeNitroSound.default.addRecordBackListener(e => {
        setRecordTime(_reactNativeNitroSound.default.mmssss(Math.floor(e.currentPosition)));
      });
      await _reactNativeNitroSound.default.startRecorder();
      setIsRecording(true);
    } catch (error) {
      _reactNativeNitroSound.default.removeRecordBackListener();
      _reactNative.Alert.alert('Lỗi ghi âm', error?.message || 'Không thể bắt đầu ghi âm.');
    }
  };
  const handleStopAndSave = async () => {
    try {
      const resultUri = await _reactNativeNitroSound.default.stopRecorder();
      _reactNativeNitroSound.default.removeRecordBackListener();
      setIsRecording(false);
      setRecordVisible(false);
      if (!resultUri) {
        _reactNative.Alert.alert('Lỗi', 'Không lấy được file ghi âm.');
        return;
      }
      const normalizedUri = resultUri.startsWith('file://') || resultUri.startsWith('content://') ? resultUri : `file://${resultUri}`;

      // Lưu đường dẫn local vào câu trả lời; khi bấm Gửi form sẽ upload lên server
      const nextUrls = [...audioUrls, normalizedUri];
      onChange(question, JSON.stringify(nextUrls));
      if (onRecord) {
        onRecord(question, normalizedUri);
      }
    } catch (error) {
      _reactNativeNitroSound.default.removeRecordBackListener();
      setIsRecording(false);
      _reactNative.Alert.alert('Lỗi', error?.message || 'Không thể lưu file ghi âm.');
    }
  };
  const handleCloseModal = async () => {
    if (isRecording) {
      try {
        await _reactNativeNitroSound.default.stopRecorder();
      } catch {/* ignore */}
      _reactNativeNitroSound.default.removeRecordBackListener();
      setIsRecording(false);
    }
    setRecordVisible(false);
  };
  const handlePickFromFiles = async () => {
    if (isMaxReached) {
      _reactNative.Alert.alert('Giới hạn', `Đã đạt giới hạn tối đa ${max} file audio. Vui lòng xóa file cũ trước khi chọn file mới.`);
      return;
    }
    const hasPerm = await requestAudioReadPermission();
    if (!hasPerm) {
      _reactNative.Alert.alert('Thông báo', 'Chưa cấp quyền đọc tệp âm thanh từ thiết bị.');
      return;
    }
    try {
      const result = await (0, _picker.pick)({
        type: [_picker.types.audio],
        allowMultiSelection: false
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
    } catch (err) {
      if ((0, _picker.isCancel)(err)) {
        return;
      }
      _reactNative.Alert.alert('Lỗi', err?.message || 'Không thể chọn file âm thanh.');
    }
  };
  const handleRemoveItem = idxToRemove => {
    const nextUrls = audioUrls.filter((_, idx) => idx !== idxToRemove);
    onChange(question, nextUrls.length > 0 ? JSON.stringify(nextUrls) : 'clear');
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, audioUrls.map((url, idx) => {
    const isLocal = isLocalAudioUri(url);
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: `${url}_${idx}`,
      style: styles.audioRow
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.audioIcon
    }, "\uD83C\uDFB5"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.audioUrl,
      numberOfLines: 1
    }, getAudioDisplayName(url)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.statusBadge, isLocal ? styles.statusPending : styles.statusUploaded]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [styles.statusText, isLocal ? styles.statusPendingText : styles.statusUploadedText]
    }, isLocal ? 'Chờ gửi' : 'Đã tải')), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: () => handleRemoveItem(idx),
      style: styles.removeItemBtn
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.removeItemText
    }, "\u2715")));
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.actions
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, isMaxReached && styles.btnDisabled],
    onPress: handleOpenRecorder,
    disabled: isMaxReached
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83C\uDFA4"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.btnText, isMaxReached && styles.btnTextDisabled]
  }, "Ghi \xE2m")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, isMaxReached && styles.btnDisabled],
    onPress: handlePickFromFiles,
    disabled: isMaxReached
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnIcon
  }, "\uD83D\uDCC1"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.btnText, isMaxReached && styles.btnTextDisabled]
  }, "Ch\u1ECDn file")), audioUrls.length > 0 && /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.btn, styles.clearBtn],
    onPress: () => onChange(question, 'clear')
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnText
  }, "Xo\xE1 h\u1EBFt"))), /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: recordVisible,
    transparent: true,
    animationType: "fade",
    onRequestClose: handleCloseModal
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.modalBackdrop
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.modalCard
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.modalTitle
  }, "Ghi \xE2m c\xE2u tr\u1EA3 l\u1EDDi"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.timerText
  }, recordTime), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.hintText
  }, isRecording ? 'Đang ghi âm...' : 'Nhấn Bắt đầu để ghi âm'), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.modalActions
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modalBtn, styles.modalCancelBtn],
    onPress: handleCloseModal
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.modalCancelText
  }, "\u0110\xF3ng")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modalBtn, isRecording ? styles.modalStopBtn : styles.modalStartBtn],
    onPress: isRecording ? handleStopAndSave : handleStartRecord
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.modalActionText
  }, isRecording ? 'Dừng & Lưu' : 'Bắt đầu')))))));
}
const styles = _reactNative.StyleSheet.create({
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
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6
  },
  audioIcon: {
    fontSize: 16,
    marginRight: 6
  },
  audioUrl: {
    flex: 1,
    fontSize: 13,
    color: '#202124'
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6
  },
  statusPending: {
    backgroundColor: '#FEF3C7'
  },
  statusUploaded: {
    backgroundColor: '#DCFCE7'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  statusPendingText: {
    color: '#B45309'
  },
  statusUploadedText: {
    color: '#15803D'
  },
  removeItemBtn: {
    marginLeft: 8,
    paddingHorizontal: 4
  },
  removeItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
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