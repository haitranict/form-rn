"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormTitle = FormTitle;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormTitle({
  formData
}) {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.card
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.title
  }, formData.title), formData.subTitle ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.subtitle
  }, formData.subTitle) : null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.hint
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.hintText
  }, "B\u1EAFt Bu\u1ED9c: (", /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.star
  }, "*"), ")")));
}
const styles = _reactNative.StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderTopWidth: 6,
    borderTopColor: '#4285F4',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.2
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6368',
    lineHeight: 22,
    marginBottom: 16
  },
  hint: {
    marginTop: 8
  },
  hintText: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500'
  },
  star: {
    color: '#EA4335',
    fontWeight: '700'
  }
});
//# sourceMappingURL=FormTitle.js.map