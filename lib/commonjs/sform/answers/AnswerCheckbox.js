"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerCheckbox = AnswerCheckbox;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerCheckbox({
  question,
  onChange
}) {
  const answers = question.anwserItem.filter(a => a.id < 100);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, answers.map(ans => {
    const checked = ans.anwserValue === 'true' || ans.anwserValue === true;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: ans.id
    }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      style: styles.row,
      onPress: () => onChange(question, {
        id: ans.id,
        checked: !checked
      }),
      activeOpacity: 0.7,
      accessibilityRole: "checkbox",
      accessibilityState: {
        checked
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.box, checked && styles.boxChecked]
    }, checked && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.checkmark
    }, "\u2713")), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.label
    }, ans.anwserName)), ans.id === 99 && checked && /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
      style: styles.otherInput,
      value: ans.ortherValue ?? '',
      onChangeText: text => onChange(question, {
        id: ans.id,
        checked: true
      }, {
        ...ans,
        ortherValue: text
      }),
      placeholder: "Nh\u1EADp n\u1ED9i dung kh\xE1c",
      placeholderTextColor: "#9AA0A6"
    }));
  }));
}
const styles = _reactNative.StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DADCE0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  boxChecked: {
    borderColor: '#4285F4',
    backgroundColor: '#4285F4'
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  label: {
    fontSize: 15,
    color: '#202124',
    flex: 1
  },
  otherInput: {
    marginLeft: 30,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#202124',
    marginBottom: 4
  }
});
//# sourceMappingURL=AnswerCheckbox.js.map