"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerGrid = AnswerGrid;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function AnswerGrid({
  question,
  onChange
}) {
  const [displayMode, setDisplayMode] = (0, _react.useState)('table');
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

  // Render mode: Table (default)
  const renderTableMode = () => /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, {
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

  // Render mode: Group by Row
  const renderGroupByRow = () => /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: row.rowId,
    style: styles.groupCard
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.groupTitle
  }, row.rowName), cols.map(col => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: col.colId,
    style: styles.groupItem
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.groupItemLabel
  }, col.colName), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.groupItemValue
  }, renderCell(row.rowId, col.colId)))))));

  // Render mode: Group by Column
  const renderGroupByColumn = () => /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, null, cols.map(col => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: col.colId,
    style: styles.groupCard
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.groupTitle
  }, col.colName), rows.map(row => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: row.rowId,
    style: styles.groupItem
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.groupItemLabel
  }, row.rowName), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.groupItemValue
  }, renderCell(row.rowId, col.colId)))))));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.modeSelector
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modeBtn, displayMode === 'table' && styles.modeBtnActive],
    onPress: () => setDisplayMode('table')
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.modeBtnText, displayMode === 'table' && styles.modeBtnTextActive]
  }, "\uD83D\uDCCA B\u1EA3ng")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modeBtn, displayMode === 'group-by-row' && styles.modeBtnActive],
    onPress: () => setDisplayMode('group-by-row')
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.modeBtnText, displayMode === 'group-by-row' && styles.modeBtnTextActive]
  }, "\u27A1\uFE0F Theo d\xF2ng")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modeBtn, displayMode === 'group-by-column' && styles.modeBtnActive],
    onPress: () => setDisplayMode('group-by-column')
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.modeBtnText, displayMode === 'group-by-column' && styles.modeBtnTextActive]
  }, "\u2B07\uFE0F Theo c\u1ED9t"))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.content
  }, displayMode === 'table' && renderTableMode(), displayMode === 'group-by-row' && renderGroupByRow(), displayMode === 'group-by-column' && renderGroupByColumn()));
}
const styles = _reactNative.StyleSheet.create({
  // Mode Selector
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DADCE0',
    backgroundColor: '#fff'
  },
  modeBtnActive: {
    borderColor: '#4285F4',
    backgroundColor: '#E8F0FE'
  },
  modeBtnText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '500'
  },
  modeBtnTextActive: {
    color: '#4285F4',
    fontWeight: '600'
  },
  content: {
    marginTop: 8
  },
  // Table Mode Styles
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
    borderColor: '#DADCE0',
    backgroundColor: '#FAFAFA'
  },
  rowLabel: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500'
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
  // Group Mode Styles
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DADCE0',
    padding: 12,
    marginBottom: 12
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4
  },
  groupItemLabel: {
    flex: 1,
    fontSize: 14,
    color: '#5F6368',
    marginRight: 8
  },
  groupItemValue: {
    flex: 1,
    alignItems: 'flex-start'
  },
  // Input Styles
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    minWidth: 84,
    width: '100%'
  }
});
//# sourceMappingURL=AnswerGrid.js.map