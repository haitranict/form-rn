"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionHeader = SectionHeader;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../../theme");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function SectionHeader({
  config
}) {
  const theme = (0, _theme.useTheme)();
  const styles = _reactNative.StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sectionGap,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: theme.shape.borderRadius,
      marginBottom: 12
    },
    title: {
      fontSize: theme.typography.fontSizeSectionTitle,
      fontWeight: theme.typography.fontWeightSectionTitle,
      color: theme.colors.text
    },
    subtitle: {
      fontSize: theme.typography.fontSizeHelper + 2,
      color: theme.colors.textSecondary,
      marginTop: 6
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, config.imageUrl ? /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: config.imageUrl
    },
    style: styles.image,
    resizeMode: "cover"
  }) : null, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.title
  }, config.title), config.subtitle ? /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.subtitle
  }, config.subtitle) : null);
}
//# sourceMappingURL=SectionHeader.js.map