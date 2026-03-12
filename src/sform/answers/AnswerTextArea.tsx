import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: string) => void;
}

export function AnswerTextArea({ question, onChange }: Props) {
  const value = question.anwserItem[0].anwserValue;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[styles.input, isFocused && styles.focused]}
      value={value === '' ? undefined : value}
      onChangeText={(text) => onChange(question, text)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder="Nhập câu trả lời"
      placeholderTextColor="#9AA0A6"
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#202124',
    backgroundColor: '#fff',
    minHeight: 100,
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2,
  },
});
