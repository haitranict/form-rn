"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormTimer = FormTimer;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function FormTimer({
  startTime
}) {
  const [elapsed, setElapsed] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.icon
  }, "\u23F1"), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.time
  }, String(minutes).padStart(2, '0'), ":", String(seconds).padStart(2, '0')));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  icon: {
    fontSize: 16,
    marginRight: 6
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace'
  }
});
//# sourceMappingURL=FormTimer.js.map