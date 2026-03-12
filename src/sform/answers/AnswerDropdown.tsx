import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, TextInput,
  StyleSheet, SafeAreaView,
} from 'react-native';
import type { Question } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (question: Question, value: unknown) => void;
}

export function AnswerDropdown({ question, onChange }: Props) {
  const anwserName = question.anwserItem[0].anwserName;
  const rawValue = question.anwserItem[0].anwserValue;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  let options: string[] = [];
  try { options = JSON.parse(anwserName); } catch { /* ignore */ }

  let selected = '';
  try {
    const v = JSON.parse(rawValue);
    selected = typeof v === 'object' ? v?.name ?? '' : String(v);
  } catch { selected = rawValue; }

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected || 'Chọn câu trả lời'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.overlay}>
          <View style={styles.sheet}>
            <TextInput
              style={styles.search}
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#9AA0A6"
            />
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(question, { name: item, value: item });
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <Text style={[styles.optionText, item === selected && styles.optionSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DADCE0', borderRadius: 8,
    height: 48, paddingHorizontal: 12, backgroundColor: '#fff',
  },
  triggerText: { flex: 1, fontSize: 16, color: '#202124' },
  placeholder: { color: '#9AA0A6' },
  arrow: { fontSize: 12, color: '#5F6368' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 16,
    borderTopRightRadius: 16, maxHeight: '60%',
  },
  search: {
    margin: 12, borderWidth: 1, borderColor: '#DADCE0',
    borderRadius: 8, paddingHorizontal: 12, height: 40, fontSize: 16,
  },
  option: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#DADCE0',
  },
  optionText: { fontSize: 16, color: '#202124' },
  optionSelected: { color: '#4285F4', fontWeight: '600' },
});
