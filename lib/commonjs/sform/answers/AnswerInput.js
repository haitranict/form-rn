"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerInput = AnswerInput;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function AnswerInput({
  question,
  onChange
}) {
  const value = question.anwserItem[0].anwserValue;
  const [isFocused, setIsFocused] = (0, _react.useState)(false);
  return /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: [styles.input, isFocused && styles.focused],
    value: value === '' ? undefined : value,
    onChangeText: text => onChange(question, text),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder: "Nh\u1EADp c\xE2u tr\u1EA3 l\u1EDDi",
    placeholderTextColor: "#9AA0A6"
  });
}
const styles = _reactNative.StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#202124',
    backgroundColor: '#fff',
    minHeight: 48
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2
  }
});
//# sourceMappingURL=AnswerInput.js.map