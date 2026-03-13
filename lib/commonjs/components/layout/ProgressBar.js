"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBar = ProgressBar;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../../theme");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ProgressBar({
  currentPage,
  totalPages,
  showLabel = true
}) {
  const theme = (0, _theme.useTheme)();
  const progress = totalPages > 1 ? (currentPage + 1) / totalPages : 1;
  const styles = _reactNative.StyleSheet.create({
    container: {
      marginBottom: 16
    },
    track: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden'
    },
    fill: {
      height: '100%',
      width: `${progress * 100}%`,
      backgroundColor: theme.colors.primary,
      borderRadius: 2
    },
    label: {
      fontSize: theme.typography.fontSizeHelper,
      color: theme.colors.textSecondary,
      textAlign: 'right',
      marginTop: 4
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.track
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.fill
  })), showLabel && totalPages > 1 ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.label
  }, "Step ", currentPage + 1, " of ", totalPages) : null);
}
//# sourceMappingURL=ProgressBar.js.map