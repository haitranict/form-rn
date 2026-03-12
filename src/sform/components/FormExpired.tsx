import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function FormExpired() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚫 Form đã hết hạn</Text>
      <Text style={styles.subtitle}>
        Form này đã quá ngày hết hạn. Vui lòng liên hệ quản trị viên.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EA4335',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 22,
  },
});
