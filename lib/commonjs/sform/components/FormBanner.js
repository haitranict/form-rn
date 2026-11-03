"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormBanner = FormBanner;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _bannerUtils = require("../utils/bannerUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormBanner({
  banner,
  fallbackBanner,
  baseUrl
}) {
  const primary = (0, _bannerUtils.parseBanner)(banner, baseUrl);
  const parsed = primary.url ? primary : (0, _bannerUtils.parseBanner)(fallbackBanner, baseUrl);
  if (!parsed.url) {
    console.warn('[FormBanner] No image url. banner raw:', banner);
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: parsed.url
    },
    style: [styles.image, {
      height: parsed.height ?? 200
    }],
    resizeMode: "cover",
    onError: e => console.error('[FormBanner] Image load error:', parsed.url, e.nativeEvent.error)
  }));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    marginBottom: 8
  },
  image: {
    width: '100%'
  }
});
//# sourceMappingURL=FormBanner.js.map