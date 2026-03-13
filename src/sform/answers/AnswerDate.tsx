import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: Date | null) => void;
}

export function AnswerDate({ question, onChange }: Props) {
  const raw = question.anwserItem[0].anwserValue;
  const dateValue = raw ? new Date(raw) : new Date();
  const [show, setShow] = useState(false);

  const displayText = raw
    ? new Date(raw).toLocaleDateString('vi-VN')
    : 'Chọn ngày';

  const minDate = question.min ? new Date(question.min) : undefined;
  const maxDate = question.max ? new Date(question.max) : undefined;

  return (
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, !raw && styles.placeholder]}>
          {displayText}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="spinner"
          onChange={(_, date) => {
            setShow(Platform.OS === 'ios');
            onChange(question, date ?? null);
          }}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DADCE0', borderRadius: 8,
    height: 48, paddingHorizontal: 12, backgroundColor: '#fff',
    alignSelf: 'flex-start', minWidth: 200,
  },
  text: { flex: 1, fontSize: 16, color: '#202124' },
  placeholder: { color: '#9AA0A6' },
  icon: { fontSize: 18 },
});
