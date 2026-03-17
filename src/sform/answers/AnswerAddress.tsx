import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import type { Question, AnswerItem, Province, District, Town, Province2025, Ward2025 } from '../types/sform.types';

interface Props {
  question: Question;
  provinces: Province[];
  districts: District[];
  towns: Town[];
  onChange: (question: Question, value: unknown, answerItem: AnswerItem) => void;
  /** DVHC 2025 data - if provided, will use this instead of provinces/districts/towns */
  dvhc2025?: Province2025[];
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
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.overlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function AnswerAddress({ question, provinces, districts, towns, onChange, dvhc2025 }: Props) {
  const [showProvince, setShowProvince] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showTown, setShowTown] = useState(false);

  const useDVHC2025 = !!dvhc2025;

  // Get selected province to filter wards
  const selectedProvinceItem = question.anwserItem.find((a) => a.id === 2);
  const selectedProvinceName = selectedProvinceItem?.anwserValue || '';

  // Get wards for selected province (DVHC 2025 mode)
  const wards2025 = useMemo(() => {
    if (!useDVHC2025 || !selectedProvinceName || !dvhc2025) return [];
    const province = dvhc2025.find((p) => p.name === selectedProvinceName);
    return province?.level2s || [];
  }, [useDVHC2025, selectedProvinceName, dvhc2025]);

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
                data={useDVHC2025 ? (dvhc2025 || []) : provinces}
                labelKey="name"
                title="Chọn Tỉnh/Thành"
                onSelect={(p) => onChange(question, p, item)}
                onClose={() => setShowProvince(false)}
              />
            </View>
          );
        }
        if (item.id === 3) {
          // Skip district field in DVHC 2025 mode
          if (useDVHC2025) return null;

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
          const wardData = useDVHC2025 ? wards2025 : towns;
          const isDisabled = wardData.length === 0;

          return (
            <View key={item.id} style={styles.field}>
              <Text style={styles.fieldLabel}>{item.anwserName}</Text>
              <TouchableOpacity
                style={[styles.picker, isDisabled && styles.disabled]}
                onPress={() => !isDisabled && setShowTown(true)}
              >
                <Text style={[styles.pickerText, !item.anwserValue && styles.placeholder]}>
                  {item.anwserValue || 'Chọn phường/xã'}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              <SearchModal
                visible={showTown}
                data={wardData}
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
