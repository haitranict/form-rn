"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerNumber = AnswerNumber;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function formatThousand(val) {
  const clean = val.replace(/,/g, '');
  if (clean === '' || isNaN(Number(clean))) return val;
  return Number(clean).toLocaleString('en-US');
}
function AnswerNumber({
  question,
  onChange
}) {
  const raw = question.anwserItem[0].anwserValue;
  const [display, setDisplay] = (0, _react.useState)(raw ? formatThousand(raw) : '');
  const [isFocused, setIsFocused] = (0, _react.useState)(false);
  const handleChange = text => {
    const clean = text.replace(/,/g, '');
    setDisplay(formatThousand(clean));
    onChange(question, clean);
  };
  const handleBlur = () => {
    setIsFocused(false);

    // Validate min/max constraints
    const clean = display.replace(/,/g, '');
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      const min = question.min ? parseFloat(question.min) : null;
      const max = question.max ? parseFloat(question.max) : null;
      let finalValue = num;
      let changed = false;
      if (min !== null && num < min) {
        finalValue = min;
        changed = true;
      }
      if (max !== null && num > max) {
        finalValue = max;
        changed = true;
      }
      if (changed) {
        const finalDisplay = formatThousand(String(finalValue));
        setDisplay(finalDisplay);
        onChange(question, String(finalValue));
      }
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.row, isFocused && styles.focused]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    style: styles.input,
    value: display === '' ? undefined : display,
    onChangeText: handleChange,
    onFocus: () => setIsFocused(true),
    onBlur: handleBlur,
    placeholder: "Nh\u1EADp c\xE2u tr\u1EA3 l\u1EDDi (Number)",
    placeholderTextColor: "#9AA0A6",
    keyboardType: "numeric"
  }));
}
const styles = _reactNative.StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '60%'
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#202124'
  }
});
//# sourceMappingURL=AnswerNumber.js.map