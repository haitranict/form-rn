"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerRenderer = AnswerRenderer;
var _react = _interopRequireDefault(require("react"));
var _AnswerInput = require("./AnswerInput");
var _AnswerTextArea = require("./AnswerTextArea");
var _AnswerNumber = require("./AnswerNumber");
var _AnswerCheckbox = require("./AnswerCheckbox");
var _AnswerRadio = require("./AnswerRadio");
var _AnswerDate = require("./AnswerDate");
var _AnswerImage = require("./AnswerImage");
var _AnswerCamera = require("./AnswerCamera");
var _AnswerAudio = require("./AnswerAudio");
var _AnswerGrid = require("./AnswerGrid");
var _AnswerAddress = require("./AnswerAddress");
var _AnswerDropdown = require("./AnswerDropdown");
var _AnswerMultiSelect = require("./AnswerMultiSelect");
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AnswerRenderer({
  question,
  provinces,
  districts,
  towns,
  cameraImages,
  onCapture,
  onDeleteCameraImage,
  onDeleteUploadedImage,
  onUploadImages,
  onUploadAudio,
  onChange
}) {
  if (question.anwserItem.length === 0) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: {
        color: '#9AA0A6'
      }
    }, "Kh\xF4ng c\xF3 c\xE2u tr\u1EA3 l\u1EDDi");
  }
  const ansType = question.anwserItem[0].anwserType;
  switch (ansType) {
    case 1:
      return /*#__PURE__*/_react.default.createElement(_AnswerInput.AnswerInput, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 2:
      return /*#__PURE__*/_react.default.createElement(_AnswerTextArea.AnswerTextArea, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 3:
      return /*#__PURE__*/_react.default.createElement(_AnswerNumber.AnswerNumber, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 4:
      return /*#__PURE__*/_react.default.createElement(_AnswerCheckbox.AnswerCheckbox, {
        question: question,
        onChange: (q, v, ans) => onChange(q, v, ans)
      });
    case 5:
      return /*#__PURE__*/_react.default.createElement(_AnswerRadio.AnswerRadio, {
        question: question,
        onChange: (q, v, ans) => onChange(q, v, ans)
      });
    case 6:
      return /*#__PURE__*/_react.default.createElement(_AnswerDate.AnswerDate, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 7:
      return /*#__PURE__*/_react.default.createElement(_AnswerImage.AnswerImage, {
        question: question,
        onChange: (q, v) => onChange(q, v),
        onDelete: (qId, url) => onDeleteUploadedImage(qId, url),
        onUpload: onUploadImages
      });
    case 8:
      return /*#__PURE__*/_react.default.createElement(_AnswerCamera.AnswerCamera, {
        question: question,
        cameraImages: cameraImages,
        onCapture: () => onCapture(question),
        onDelete: onDeleteCameraImage
      });
    case 16:
      return /*#__PURE__*/_react.default.createElement(_AnswerAudio.AnswerAudio, {
        question: question,
        onChange: (q, v) => onChange(q, v),
        onUpload: onUploadAudio
      });
    case 10:
      return /*#__PURE__*/_react.default.createElement(_AnswerGrid.AnswerGrid, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 11:
      return /*#__PURE__*/_react.default.createElement(_AnswerAddress.AnswerAddress, {
        question: question,
        provinces: provinces,
        districts: districts,
        towns: towns,
        onChange: onChange
      });
    case 12:
      return /*#__PURE__*/_react.default.createElement(_AnswerDropdown.AnswerDropdown, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 13:
      return /*#__PURE__*/_react.default.createElement(_AnswerMultiSelect.AnswerMultiSelect, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    default:
      return /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: {
          color: '#EA4335'
        }
      }, "Kh\xF4ng c\xF3 lo\u1EA1i c\xE2u h\u1ECFi n\xE0y.");
  }
}
//# sourceMappingURL=AnswerRenderer.js.map