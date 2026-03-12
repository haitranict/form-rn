import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function FormSuccess({
  message
}) {
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.icon
  }, "\u2705"), /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "\u0110\xE3 g\u1EEDi th\xE0nh c\xF4ng!"), message ? /*#__PURE__*/React.createElement(Text, {
    style: styles.message
  }, message) : null);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff'
  },
  icon: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34A853',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    fontSize: 15,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 22
  }
});
//# sourceMappingURL=FormSuccess.js.map