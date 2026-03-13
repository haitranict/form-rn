import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import type { Question, GridSchema, GridRowValue, GridColValue } from '../types/sform.types';

type DisplayMode = 'table' | 'group-by-row' | 'group-by-column';

interface Props {
  question: Question;
  onChange: (
    question: Question,
    value: { cellId: string; cellValue: unknown }
  ) => void;
}

export function AnswerGrid({ question, onChange }: Props) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('table');
  
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

  // Render mode: Table (default)
  const renderTableMode = () => (
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

  // Render mode: Group by Row
  const renderGroupByRow = () => (
    <ScrollView>
      {rows.map((row) => (
        <View key={row.rowId} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{row.rowName}</Text>
          {cols.map((col) => (
            <View key={col.colId} style={styles.groupItem}>
              <Text style={styles.groupItemLabel}>{col.colName}</Text>
              <View style={styles.groupItemValue}>
                {renderCell(row.rowId, col.colId)}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  // Render mode: Group by Column
  const renderGroupByColumn = () => (
    <ScrollView>
      {cols.map((col) => (
        <View key={col.colId} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{col.colName}</Text>
          {rows.map((row) => (
            <View key={row.rowId} style={styles.groupItem}>
              <Text style={styles.groupItemLabel}>{row.rowName}</Text>
              <View style={styles.groupItemValue}>
                {renderCell(row.rowId, col.colId)}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeBtn, displayMode === 'table' && styles.modeBtnActive]}
          onPress={() => setDisplayMode('table')}
        >
          <Text style={[styles.modeBtnText, displayMode === 'table' && styles.modeBtnTextActive]}>
            📊 Bảng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, displayMode === 'group-by-row' && styles.modeBtnActive]}
          onPress={() => setDisplayMode('group-by-row')}
        >
          <Text style={[styles.modeBtnText, displayMode === 'group-by-row' && styles.modeBtnTextActive]}>
            ➡️ Theo dòng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, displayMode === 'group-by-column' && styles.modeBtnActive]}
          onPress={() => setDisplayMode('group-by-column')}
        >
          <Text style={[styles.modeBtnText, displayMode === 'group-by-column' && styles.modeBtnTextActive]}>
            ⬇️ Theo cột
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {displayMode === 'table' && renderTableMode()}
        {displayMode === 'group-by-row' && renderGroupByRow()}
        {displayMode === 'group-by-column' && renderGroupByColumn()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mode Selector
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DADCE0',
    backgroundColor: '#fff',
  },
  modeBtnActive: {
    borderColor: '#4285F4',
    backgroundColor: '#E8F0FE',
  },
  modeBtnText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '500',
  },
  modeBtnTextActive: {
    color: '#4285F4',
    fontWeight: '600',
  },
  content: {
    marginTop: 8,
  },

  // Table Mode Styles
  headerRow: { 
    flexDirection: 'row', 
    backgroundColor: '#F8F9FA', 
    borderBottomWidth: 1, 
    borderColor: '#DADCE0',
  },
  headerCell: { 
    width: 100, 
    padding: 8, 
    alignItems: 'center', 
    borderLeftWidth: 1, 
    borderColor: '#DADCE0',
  },
  headerText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#202124', 
    textAlign: 'center',
  },
  rowLabelCell: { 
    width: 120, 
    padding: 8, 
    justifyContent: 'center', 
    borderRightWidth: 1, 
    borderColor: '#DADCE0',
    backgroundColor: '#FAFAFA',
  },
  rowLabel: { 
    fontSize: 14, 
    color: '#202124',
    fontWeight: '500',
  },
  dataRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#DADCE0',
  },
  dataCell: { 
    width: 100, 
    padding: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderLeftWidth: 1, 
    borderColor: '#DADCE0',
  },

  // Group Mode Styles
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DADCE0',
    padding: 12,
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  groupItemLabel: {
    flex: 1,
    fontSize: 14,
    color: '#5F6368',
    marginRight: 8,
  },
  groupItemValue: {
    flex: 1,
    alignItems: 'flex-start',
  },

  // Input Styles
  radioOuter: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#DADCE0', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  radioInner: { 
    width: 10, 
    height: 10, 
    borderRadius: 5,
  },
  radioSelected: { 
    backgroundColor: '#4285F4',
  },
  checkbox: { 
    width: 20, 
    height: 20, 
    borderRadius: 4, 
    borderWidth: 2, 
    borderColor: '#DADCE0', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  checkboxChecked: { 
    borderColor: '#4285F4', 
    backgroundColor: '#4285F4',
  },
  checkmark: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '700',
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#DADCE0', 
    borderRadius: 4, 
    paddingHorizontal: 8, 
    paddingVertical: 6, 
    fontSize: 13, 
    minWidth: 84,
    width: '100%',
  },
});
