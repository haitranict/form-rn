"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormIntro = FormIntro;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _moment = _interopRequireDefault(require("moment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormIntro({
  title,
  subTitle,
  banner,
  fromDate,
  toDate,
  fromTime,
  toTime,
  onStart
}) {
  // Parse banner JSON to get imageURL
  const getBannerUrl = () => {
    console.log('[FormIntro] banner raw:', banner);
    if (!banner) return null;
    try {
      const config = JSON.parse(banner);
      console.log('[FormIntro] parsed config:', config);
      const url = config?.imageURL || null;
      console.log('[FormIntro] extracted imageURL:', url);
      return url;
    } catch (e) {
      console.error('[FormIntro] JSON parse error:', e);
      return null;
    }
  };
  const bannerUrl = getBannerUrl();

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
    resizeMode: "cover"
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
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
    style: styles.startButton,
    onPress: onStart
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.startButtonText
  }, "B\u1EAFt \u0111\u1EA7u kh\u1EA3o s\xE1t")));
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
    height: 220
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
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