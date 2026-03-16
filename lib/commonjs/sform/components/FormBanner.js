"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormBanner = FormBanner;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormBanner({
  banner
}) {
  console.log('[FormBanner] banner raw:', banner);
  if (!banner) return null;
  let config = null;
  try {
    config = JSON.parse(banner);
    console.log('[FormBanner] parsed config:', config);
  } catch (e) {
    console.error('[FormBanner] JSON parse error:', e);
    return null;
  }
  if (!config?.imageURL) {
    console.warn('[FormBanner] No imageURL in config');
    return null;
  }
  console.log('[FormBanner] Rendering image:', config.imageURL);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: config.imageURL
    },
    style: [styles.image, {
      height: config.imageHeight ?? 200
    }],
    resizeMode: "cover"
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