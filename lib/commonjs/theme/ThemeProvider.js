"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
var _react = _interopRequireWildcard(require("react"));
var _defaultTheme = require("./defaultTheme");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ThemeContext = /*#__PURE__*/(0, _react.createContext)(_defaultTheme.defaultTheme);
function ThemeProvider({
  theme,
  children
}) {
  const merged = theme ? {
    colors: {
      ..._defaultTheme.defaultTheme.colors,
      ...theme.colors
    },
    typography: {
      ..._defaultTheme.defaultTheme.typography,
      ...theme.typography
    },
    spacing: {
      ..._defaultTheme.defaultTheme.spacing,
      ...theme.spacing
    },
    shape: {
      ..._defaultTheme.defaultTheme.shape,
      ...theme.shape
    },
    sizes: {
      ..._defaultTheme.defaultTheme.sizes,
      ...theme.sizes
    }
  } : _defaultTheme.defaultTheme;
  return /*#__PURE__*/_react.default.createElement(ThemeContext.Provider, {
    value: merged
  }, children);
}
function useTheme() {
  return (0, _react.useContext)(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map