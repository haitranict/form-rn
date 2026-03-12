"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormExpired = FormExpired;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormExpired() {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.title
  }, "\uD83D\uDEAB Form \u0111\xE3 h\u1EBFt h\u1EA1n"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.subtitle
  }, "Form n\xE0y \u0111\xE3 qu\xE1 ng\xE0y h\u1EBFt h\u1EA1n. Vui l\xF2ng li\xEAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\xEAn."));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EA4335',
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 22
  }
});
//# sourceMappingURL=FormExpired.js.map