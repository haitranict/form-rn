"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormDivider = FormDivider;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../../theme");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormDivider({
  config
}) {
  const theme = (0, _theme.useTheme)();
  const styles = _reactNative.StyleSheet.create({
    divider: {
      height: config?.thickness ?? 1,
      backgroundColor: config?.color ?? theme.colors.border,
      marginVertical: theme.spacing.fieldGap
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.divider
  });
}
//# sourceMappingURL=FormDivider.js.map