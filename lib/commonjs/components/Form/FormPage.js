"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormPage = FormPage;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FieldRenderer = require("./FieldRenderer");
var _theme = require("../../theme");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FormPage({
  page,
  fields: directFields
}) {
  const theme = (0, _theme.useTheme)();
  const fields = page?.fields ?? directFields ?? [];
  const styles = _reactNative.StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.pagePaddingH,
      paddingVertical: theme.spacing.pagePaddingV
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, fields.map(field => /*#__PURE__*/_react.default.createElement(_FieldRenderer.FieldRenderer, {
    key: field.id,
    field: field
  })));
}
//# sourceMappingURL=FormPage.js.map