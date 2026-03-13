import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList,
  StyleSheet, SafeAreaView,
} from 'react-native';
import type { Question, AnswerItem, Province, District, Town } from '../types/sform.types';

interface Props {
  question: Question;
  provinces: Province[];
  districts: District[];
  towns: Town[];
  onChange: (question: Question, value: unknown, answerItem: AnswerItem) => void;
}

function SearchModal({
  visible,
  data,
  labelKey,
  onSelect,
  onClose,
  title,
}: {
  visible: boolean;
  data: unknown[];
  labelKey: string;
  onSelect: (item: unknown) => void;
  onClose: () => void;
  title: string;
}) {
  const [search, setSearch] = useState('');
  const filtered = search
    ? (data as Record<string, string>[]).filter((d) =>
        d[labelKey]?.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TextInput
            style={styles.search}
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#9AA0A6"
          />
          <FlatList
            data={filtered as unknown[]}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => { onSelect(item); onClose(); setSearch(''); }}
              >
                <Text style={styles.optionText}>{(item as Record<string, string>)[labelKey]}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export function AnswerAddress({ question, provinces, districts, towns, onChange }: Props) {
  const [showProvince, setShowProvince] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showTown, setShowTown] = useState(false);

  const getItem = (id: number) => question.anwserItem.find((a) => a.id === id);

  return (
    <View style={styles.container}>
      {question.anwserItem.map((item) => {
        if (item.id === 1) {
          // Street text
          return (
            <View key={item.id} style={styles.field}>
              <Text style={styles.fieldLabel}>{item.anwserName}</Text>
              <TextInput
                style={styles.input}
                value={item.anwserValue}
                onChangeText={(text) => onChange(question, text, item)}
                placeholder={item.anwserName}
                placeholderTextColor="#9AA0A6"
              />
            </View>
          );
        }
        if (item.id === 2) {
          return (
            <View key={item.id} style={styles.field}>
              <Text style={styles.fieldLabel}>{item.anwserName}</Text>
              <TouchableOpacity style={styles.picker} onPress={() => setShowProvince(true)}>
                <Text style={[styles.pickerText, !item.anwserValue && styles.placeholder]}>
                  {item.anwserValue || 'Chọn tỉnh/thành'}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              <SearchModal
                visible={showProvince}
                data={provinces}
                labelKey="name"
                title="Chọn Tỉnh/Thành"
                onSelect={(p) => onChange(question, p, item)}
                onClose={() => setShowProvince(false)}
              />
            </View>
          );
        }
        if (item.id === 3) {
          return (
            <View key={item.id} style={styles.field}>
              <Text style={styles.fieldLabel}>{item.anwserName}</Text>
              <TouchableOpacity
                style={[styles.picker, districts.length === 0 && styles.disabled]}
                onPress={() => districts.length > 0 && setShowDistrict(true)}
              >
                <Text style={[styles.pickerText, !item.anwserValue && styles.placeholder]}>
                  {item.anwserValue || 'Chọn quận/huyện'}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              <SearchModal
                visible={showDistrict}
                data={districts}
                labelKey="name"
                title="Chọn Quận/Huyện"
                onSelect={(d) => onChange(question, d, item)}
                onClose={() => setShowDistrict(false)}
              />
            </View>
          );
        }
        if (item.id === 4) {
          return (
            <View key={item.id} style={styles.field}>
              <Text style={styles.fieldLabel}>{item.anwserName}</Text>
              <TouchableOpacity
                style={[styles.picker, towns.length === 0 && styles.disabled]}
                onPress={() => towns.length > 0 && setShowTown(true)}
              >
                <Text style={[styles.pickerText, !item.anwserValue && styles.placeholder]}>
                  {item.anwserValue || 'Chọn phường/xã'}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              <SearchModal
                visible={showTown}
                data={towns}
                labelKey="name"
                title="Chọn Phường/Xã"
                onSelect={(t) => onChange(question, t, item)}
                onClose={() => setShowTown(false)}
              />
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  field: { marginBottom: 4 },
  fieldLabel: { fontSize: 13, color: '#5F6368', marginBottom: 4, fontWeight: '500' },
  input: {
    borderWidth: 1, borderColor: '#DADCE0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#202124',
  },
  picker: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DADCE0', borderRadius: 8,
    height: 48, paddingHorizontal: 12,
  },
  disabled: { backgroundColor: '#F8F9FA', opacity: 0.6 },
  pickerText: { flex: 1, fontSize: 16, color: '#202124' },
  placeholder: { color: '#9AA0A6' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%' },
  sheetTitle: { textAlign: 'center', fontWeight: '600', fontSize: 16, padding: 16 },
  search: {
    marginHorizontal: 12, marginBottom: 8, borderWidth: 1, borderColor: '#DADCE0',
    borderRadius: 8, paddingHorizontal: 12, height: 40, fontSize: 16,
  },
  option: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#DADCE0' },
  optionText: { fontSize: 16, color: '#202124' },
});
