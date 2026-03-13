"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerGrid = AnswerGrid;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerGrid({
  question,
  onChange
}) {
  const anwserItem = question.anwserItem[0];
  let schema = {
    row: [],
    column: []
  };
  let values = [];
  try {
    schema = JSON.parse(anwserItem.anwserName);
  } catch {/* ignore */}
  try {
    values = JSON.parse(anwserItem.anwserValue);
  } catch {/* ignore */}
  const rows = schema.row.filter(r => r.rowId !== 100);
  const cols = schema.column.filter(c => c.colId !== 100);
  const getCellValue = (rowId, colId) => {
    try {
      const row = values.find(r => r.rowId === rowId);
      const col = row?.rowValue.find(c => c.colId === colId);
      return col?.colValue ?? '';
    } catch {
      return '';
    }
  };
  const emitChange = (rowId, colId, val) => {
    onChange(question, {
      cellId: `${rowId}_${colId}`,
      cellValue: val
    });
  };
  const renderCell = (rowId, colId) => {
    const val = getCellValue(rowId, colId);
    switch (question.questionType) {
      case 101:
        // Radio
        return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
          style: styles.radioOuter,
          onPress: () => emitChange(rowId, colId, true)
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: [styles.radioInner, val === true && styles.radioSelected]
        }));
      case 102:
        // Checkbox
        return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
          style: [styles.checkbox, val === true && styles.checkboxChecked],
          onPress: () => emitChange(rowId, colId, val !== true)
        }, val === true && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.checkmark
        }, "\u2713"));
      case 103:
        // Text
        return /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
          style: styles.textInput,
          value: String(val ?? ''),
          onChangeText: t => emitChange(rowId, colId, t),
          placeholder: "Nh\u1EADp",
          placeholderTextColor: "#9AA0A6"
        });
      case 104:
        // Number
        return /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
          style: styles.textInput,
          value: String(val ?? ''),
          onChangeText: t => emitChange(rowId, colId, t.replace(/,/g, '')),
          placeholder: "0",
          placeholderTextColor: "#9AA0A6",
          keyboardType: "numeric"
        });
      case 105:
        // Date - simplified
        return /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
          style: styles.textInput,
          value: String(val ?? ''),
          onChangeText: t => emitChange(rowId, colId, t),
          placeholder: "YYYY-MM-DD",
          placeholderTextColor: "#9AA0A6"
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: true
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.headerRow
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.rowLabelCell
  }), cols.map(col => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: col.colId,
    style: styles.headerCell
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.headerText
  }, col.colName)))), rows.map(row => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: row.rowId,
    style: styles.dataRow
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.rowLabelCell
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.rowLabel
  }, row.rowName)), cols.map(col => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: col.colId,
    style: styles.dataCell
  }, renderCell(row.rowId, col.colId)))))));
}
const styles = _reactNative.StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderColor: '#DADCE0'
  },
  headerCell: {
    width: 100,
    padding: 8,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderColor: '#DADCE0'
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center'
  },
  rowLabelCell: {
    width: 120,
    padding: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#DADCE0'
  },
  rowLabel: {
    fontSize: 14,
    color: '#202124'
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DADCE0'
  },
  dataCell: {
    width: 100,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#DADCE0'
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DADCE0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  radioSelected: {
    backgroundColor: '#4285F4'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DADCE0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxChecked: {
    borderColor: '#4285F4',
    backgroundColor: '#4285F4'
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 13,
    width: 84
  }
});
//# sourceMappingURL=AnswerGrid.js.map