import React from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import type { Question, GridSchema, GridRowValue, GridColValue } from '../types/sform.types';

interface Props {
  question: Question;
  onChange: (
    question: Question,
    value: { cellId: string; cellValue: unknown }
  ) => void;
}

export function AnswerGrid({ question, onChange }: Props) {
  const anwserItem = question.anwserItem[0];
  let schema: GridSchema = { row: [], column: [] };
  let values: GridRowValue[] = [];

  try { schema = JSON.parse(anwserItem.anwserName); } catch { /* ignore */ }
  try { values = JSON.parse(anwserItem.anwserValue); } catch { /* ignore */ }

  const rows = schema.row.filter((r) => r.rowId !== 100);
  const cols = schema.column.filter((c) => c.colId !== 100);

  const getCellValue = (rowId: number, colId: number): GridColValue['colValue'] => {
    try {
      const row = values.find((r) => r.rowId === rowId);
      const col = row?.rowValue.find((c) => c.colId === colId);
      return col?.colValue ?? '';
    } catch { return ''; }
  };

  const emitChange = (rowId: number, colId: number, val: unknown) => {
    onChange(question, { cellId: `${rowId}_${colId}`, cellValue: val });
  };

  const renderCell = (rowId: number, colId: number) => {
    const val = getCellValue(rowId, colId);
    switch (question.questionType) {
      case 101: // Radio
        return (
          <TouchableOpacity
            style={styles.radioOuter}
            onPress={() => emitChange(rowId, colId, true)}
          >
            <View style={[styles.radioInner, val === true && styles.radioSelected]} />
          </TouchableOpacity>
        );
      case 102: // Checkbox
        return (
          <TouchableOpacity
            style={[styles.checkbox, val === true && styles.checkboxChecked]}
            onPress={() => emitChange(rowId, colId, val !== true)}
          >
            {val === true && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      case 103: // Text
        return (
          <TextInput
            style={styles.textInput}
            value={String(val ?? '')}
            onChangeText={(t) => emitChange(rowId, colId, t)}
            placeholder="Nhập"
            placeholderTextColor="#9AA0A6"
          />
        );
      case 104: // Number
        return (
          <TextInput
            style={styles.textInput}
            value={String(val ?? '')}
            onChangeText={(t) => emitChange(rowId, colId, t.replace(/,/g, ''))}
            placeholder="0"
            placeholderTextColor="#9AA0A6"
            keyboardType="numeric"
          />
        );
      case 105: // Date - simplified
        return (
          <TextInput
            style={styles.textInput}
            value={String(val ?? '')}
            onChangeText={(t) => emitChange(rowId, colId, t)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9AA0A6"
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.rowLabelCell} />
          {cols.map((col) => (
            <View key={col.colId} style={styles.headerCell}>
              <Text style={styles.headerText}>{col.colName}</Text>
            </View>
          ))}
        </View>
        {/* Rows */}
        {rows.map((row) => (
          <View key={row.rowId} style={styles.dataRow}>
            <View style={styles.rowLabelCell}>
              <Text style={styles.rowLabel}>{row.rowName}</Text>
            </View>
            {cols.map((col) => (
              <View key={col.colId} style={styles.dataCell}>
                {renderCell(row.rowId, col.colId)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderBottomWidth: 1, borderColor: '#DADCE0' },
  headerCell: { width: 100, padding: 8, alignItems: 'center', borderLeftWidth: 1, borderColor: '#DADCE0' },
  headerText: { fontSize: 13, fontWeight: '600', color: '#202124', textAlign: 'center' },
  rowLabelCell: { width: 120, padding: 8, justifyContent: 'center', borderRightWidth: 1, borderColor: '#DADCE0' },
  rowLabel: { fontSize: 14, color: '#202124' },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#DADCE0' },
  dataCell: { width: 100, padding: 8, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderColor: '#DADCE0' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DADCE0', alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioSelected: { backgroundColor: '#4285F4' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#DADCE0', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: '#4285F4', backgroundColor: '#4285F4' },
  checkmark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  textInput: { borderWidth: 1, borderColor: '#DADCE0', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4, fontSize: 13, width: 84 },
});
