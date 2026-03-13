import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import type { Question, AnswerItem } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: { id: number; checked: boolean }, answerItem?: AnswerItem) => void;
}

export function AnswerCheckbox({ question, onChange }: Props) {
  const answers = question.anwserItem.filter((a) => a.id < 100);

  return (
    <View>
      {answers.map((ans) => {
        const checked = ans.anwserValue === 'true' || ans.anwserValue === true as unknown as string;
        return (
          <View key={ans.id}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => onChange(question, { id: ans.id, checked: !checked })}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.box, checked && styles.boxChecked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.label}>{ans.anwserName}</Text>
            </TouchableOpacity>

            {/* "Khác" input */}
            {ans.id === 99 && checked && (
              <TextInput
                style={styles.otherInput}
                value={ans.ortherValue ?? ''}
                onChangeText={(text) => onChange(question, { id: ans.id, checked: true }, { ...ans, ortherValue: text } as AnswerItem)}
                placeholder="Nhập nội dung khác"
                placeholderTextColor="#9AA0A6"
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  box: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: '#DADCE0', backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  boxChecked: { borderColor: '#4285F4', backgroundColor: '#4285F4' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  label: { fontSize: 15, color: '#202124', flex: 1 },
  otherInput: {
    marginLeft: 30, borderWidth: 1, borderColor: '#DADCE0',
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6,
    fontSize: 14, color: '#202124', marginBottom: 4,
  },
});
