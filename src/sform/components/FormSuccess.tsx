import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function FormSuccess({ message }: { message?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Đã gửi thành công!</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#34A853', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 15, color: '#5F6368', textAlign: 'center', lineHeight: 22 },
});
