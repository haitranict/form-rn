"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerDate = AnswerDate;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _datetimepicker = _interopRequireDefault(require("@react-native-community/datetimepicker"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function AnswerDate({
  question,
  onChange
}) {
  const raw = question.anwserItem[0].anwserValue;
  const dateValue = raw ? new Date(raw) : new Date();
  const [show, setShow] = (0, _react.useState)(false);
  const displayText = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'Chọn ngày';
  const minDate = question.min ? new Date(question.min) : undefined;
  const maxDate = question.max ? new Date(question.max) : undefined;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: styles.trigger,
    onPress: () => setShow(true),
    activeOpacity: 0.8
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.text, !raw && styles.placeholder]
  }, displayText), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.icon
  }, "\uD83D\uDCC5")), show && /*#__PURE__*/_react.default.createElement(_datetimepicker.default, {
    value: dateValue,
    mode: "date",
    display: _reactNative.Platform.OS === 'ios' ? 'spinner' : 'default',
    onChange: (_, date) => {
      setShow(_reactNative.Platform.OS === 'ios');
      onChange(question, date ?? null);
    },
    minimumDate: minDate,
    maximumDate: maxDate
  }));
}
const styles = _reactNative.StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    minWidth: 200
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#202124'
  },
  placeholder: {
    color: '#9AA0A6'
  },
  icon: {
    fontSize: 18
  }
});
//# sourceMappingURL=AnswerDate.js.map