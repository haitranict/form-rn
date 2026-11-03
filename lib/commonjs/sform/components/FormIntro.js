"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormIntro = FormIntro;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _moment = _interopRequireDefault(require("moment"));
var _bannerUtils = require("../utils/bannerUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormIntro({
  title,
  subTitle,
  banner,
  fallbackBanner,
  baseUrl,
  fromDate,
  toDate,
  fromTime,
  toTime,
  locked = false,
  isDone = false,
  onStart
}) {
  const isReview = Boolean(locked || isDone);

  // Parse banner (hỗ trợ JSON, URL trực tiếp, đường dẫn tương đối, base64...)
  const primary = (0, _bannerUtils.parseBanner)(banner, baseUrl);
  const fallback = (0, _bannerUtils.parseBanner)(fallbackBanner, baseUrl);
  const candidates = [primary.url, fallback.url].filter((u, i, arr) => !!u && arr.indexOf(u) === i);
  const [urlIndex, setUrlIndex] = _react.default.useState(0);
  const bannerUrl = candidates[urlIndex] ?? null;
  _react.default.useEffect(() => {
    setUrlIndex(0);
    console.log('[FormIntro] banner raw:', banner, '| fallback:', fallbackBanner, '→ candidates:', candidates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner, fallbackBanner]);

  // Format dates
  const formatDate = date => {
    if (!date) return '';
    const str = date.toString();
    return (0, _moment.default)(str, 'YYYYMMDD').format('DD/MM/YYYY');
  };
  const fromDateStr = formatDate(fromDate);
  const toDateStr = formatDate(toDate);
  return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
    style: styles.container,
    contentContainerStyle: styles.content
  }, bannerUrl && /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: bannerUrl
    },
    style: styles.banner,
    resizeMode: "cover",
    onError: error => {
      console.error('[FormIntro] Image load error:', bannerUrl, error.nativeEvent.error);
      // Thử URL dự phòng tiếp theo nếu có
      if (urlIndex < candidates.length - 1) setUrlIndex(urlIndex + 1);
    },
    onLoad: () => {
      console.log('[FormIntro] Image loaded successfully:', bannerUrl);
    }
  }), locked ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.lockedContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.lockedText
  }, "\uD83D\uDD12 Kh\u1EA3o s\xE1t \u0111\xE3 b\u1ECB kho\xE1. B\u1EA1n ch\u1EC9 c\xF3 th\u1EC3 xem l\u1EA1i, kh\xF4ng th\u1EC3 ch\u1EC9nh s\u1EEDa ho\u1EB7c g\u1EEDi.")) : isDone ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.doneContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.doneText
  }, "\u2713 Kh\u1EA3o s\xE1t \u0111\xE3 ho\xE0n th\xE0nh. B\u1EA1n c\xF3 th\u1EC3 xem l\u1EA1i n\u1ED9i dung \u0111\xE3 th\u1EF1c hi\u1EC7n.")) : null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.titleContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.title
  }, title)), subTitle && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.subtitleContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.subtitle
  }, subTitle)), (fromDateStr || toDateStr) && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.timelineContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.timelineTitle
  }, "\u23F0 Th\u1EDDi gian th\u1EF1c hi\u1EC7n"), fromDateStr && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.timelineText
  }, "T\u1EEB: ", fromDateStr, " ", fromTime || ''), toDateStr && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.timelineText
  }, "\u0110\u1EBFn: ", toDateStr, " ", toTime || '')), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.instructionsContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.instructionsTitle
  }, "\uD83D\uDCCB H\u01B0\u1EDBng d\u1EABn"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.instructionsText
  }, "\u2022 \u0110\u1ECDc k\u1EF9 t\u1EEBng c\xE2u h\u1ECFi tr\u01B0\u1EDBc khi tr\u1EA3 l\u1EDDi", '\n', "\u2022 Nh\u1EEFng c\xE2u c\xF3 d\u1EA5u (*) l\xE0 b\u1EAFt bu\u1ED9c", '\n', "\u2022 Ki\u1EC3m tra l\u1EA1i tr\u01B0\u1EDBc khi g\u1EEDi", '\n', "\u2022 Th\u1EDDi gian l\xE0m b\xE0i s\u1EBD \u0111\u01B0\u1EE3c t\xEDnh t\u1EEB khi b\u1EA5m \"B\u1EAFt \u0111\u1EA7u\"")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.startButton, isReview && styles.reviewButton],
    onPress: onStart,
    activeOpacity: 0.8
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.startButtonText
  }, isReview ? 'Xem lại' : 'Bắt đầu khảo sát')));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  content: {
    paddingBottom: 40
  },
  banner: {
    width: '100%',
    height: 220,
    backgroundColor: '#E8EAED'
  },
  lockedContainer: {
    margin: 15,
    marginBottom: 0,
    padding: 15,
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#EA4335'
  },
  lockedText: {
    fontSize: 14,
    color: '#C5221F',
    fontWeight: '600',
    lineHeight: 20
  },
  doneContainer: {
    margin: 15,
    marginBottom: 0,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#34A853'
  },
  doneText: {
    fontSize: 14,
    color: '#1E4620',
    fontWeight: '600',
    lineHeight: 20
  },
  reviewButton: {
    backgroundColor: '#5F6368'
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  subtitleContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF'
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center'
  },
  timelineContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800'
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8
  },
  timelineText: {
    fontSize: 14,
    color: '#E65100',
    marginTop: 4
  },
  instructionsContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8
  },
  instructionsText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22
  },
  startButton: {
    margin: 20,
    marginTop: 30,
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=FormIntro.js.map