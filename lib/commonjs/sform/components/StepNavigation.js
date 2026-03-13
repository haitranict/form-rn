"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StepNavigation = StepNavigation;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  canGoNext,
  isSubmitting
}) {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.progressContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.progressText
  }, "C\xE2u ", currentStep + 1, " / ", totalSteps), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.progressBar
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.progressFill, {
      width: `${(currentStep + 1) / totalSteps * 100}%`
    }]
  }))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.buttonsRow
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.button, styles.previousBtn, isFirstStep && styles.buttonDisabled],
    onPress: onPrevious,
    disabled: isFirstStep,
    activeOpacity: 0.7
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.buttonText, styles.previousText]
  }, "\u2190 Quay l\u1EA1i")), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: [styles.button, styles.nextBtn, (!canGoNext || isSubmitting) && styles.buttonDisabled],
    onPress: isLastStep ? onSubmit : onNext,
    disabled: !canGoNext || isSubmitting,
    activeOpacity: 0.7
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.buttonText, styles.nextText]
  }, isLastStep ? '✓ Gửi' : 'Tiếp →'))));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DADCE0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  progressContainer: {
    marginBottom: 12
  },
  progressText: {
    fontSize: 13,
    color: '#5F6368',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500'
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8EAED',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 3
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120
  },
  previousBtn: {
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#DADCE0'
  },
  nextBtn: {
    backgroundColor: '#4285F4'
  },
  buttonDisabled: {
    opacity: 0.4
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  previousText: {
    color: '#5F6368'
  },
  nextText: {
    color: '#fff'
  }
});
//# sourceMappingURL=StepNavigation.js.map