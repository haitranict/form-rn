import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function FormExpired() {
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "\uD83D\uDEAB Form \u0111\xE3 h\u1EBFt h\u1EA1n"), /*#__PURE__*/React.createElement(Text, {
    style: styles.subtitle
  }, "Form n\xE0y \u0111\xE3 qu\xE1 ng\xE0y h\u1EBFt h\u1EA1n. Vui l\xF2ng li\xEAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\xEAn."));
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EA4335',
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 22
  }
});
//# sourceMappingURL=FormExpired.js.map