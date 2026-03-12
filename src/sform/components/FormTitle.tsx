import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SFormData } from '../types/sform.types';

interface Props {
  formData: SFormData;
}

export function FormTitle({ formData }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{formData.title}</Text>
      {formData.subTitle ? (
        <Text style={styles.subtitle}>{formData.subTitle}</Text>
      ) : null}
      <View style={styles.hint}>
        <Text style={styles.hintText}>
          Bắt Buộc: (<Text style={styles.star}>*</Text>)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderTopWidth: 6,
    borderTopColor: '#4285F4',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6368',
    lineHeight: 22,
    marginBottom: 16,
  },
  hint: { marginTop: 8 },
  hintText: { fontSize: 14, color: '#5F6368', fontWeight: '500' },
  star: { color: '#EA4335', fontWeight: '700' },
});
