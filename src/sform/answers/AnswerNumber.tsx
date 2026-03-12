import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: string) => void;
}

function formatThousand(val: string): string {
  const clean = val.replace(/,/g, '');
  if (clean === '' || isNaN(Number(clean))) return val;
  return Number(clean).toLocaleString('en-US');
}

export function AnswerNumber({ question, onChange }: Props) {
  const raw = question.anwserItem[0].anwserValue;
  const [display, setDisplay] = useState(raw ? formatThousand(raw) : '');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string) => {
    const clean = text.replace(/,/g, '');
    setDisplay(formatThousand(clean));
    onChange(question, clean);
  };

  return (
    <View style={[styles.row, isFocused && styles.focused]}>
      <TextInput
        style={styles.input}
        value={display === '' ? undefined : display}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Nhập câu trả lời (Number)"
        placeholderTextColor="#9AA0A6"
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '60%',
  },
  focused: {
    borderColor: '#4285F4',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#202124',
  },
});
