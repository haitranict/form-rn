"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSuccess = FormSuccess;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormSuccess({
  message
}) {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.icon
  }, "\u2705"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.title
  }, "\u0110\xE3 g\u1EEDi th\xE0nh c\xF4ng!"), message ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.message
  }, message) : null);
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff'
  },
  icon: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34A853',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    fontSize: 15,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 22
  }
});
//# sourceMappingURL=FormSuccess.js.map