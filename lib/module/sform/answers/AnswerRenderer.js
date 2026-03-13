import React from 'react';
import { AnswerInput } from './AnswerInput';
import { AnswerTextArea } from './AnswerTextArea';
import { AnswerNumber } from './AnswerNumber';
import { AnswerCheckbox } from './AnswerCheckbox';
import { AnswerRadio } from './AnswerRadio';
import { AnswerDate } from './AnswerDate';
import { AnswerImage } from './AnswerImage';
import { AnswerCamera } from './AnswerCamera';
import { AnswerAudio } from './AnswerAudio';
import { AnswerGrid } from './AnswerGrid';
import { AnswerAddress } from './AnswerAddress';
import { AnswerDropdown } from './AnswerDropdown';
import { AnswerMultiSelect } from './AnswerMultiSelect';
import { Text } from 'react-native';
export function AnswerRenderer({
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
  onPickImageFromGallery,
  onCaptureImageFromCamera,
  onRecordAudio,
  onPickAudioFromFiles,
  filesBasePath,
  onChange
}) {
  if (question.anwserItem.length === 0) {
    return /*#__PURE__*/React.createElement(Text, {
      style: {
        color: '#9AA0A6'
      }
    }, "Kh\xF4ng c\xF3 c\xE2u tr\u1EA3 l\u1EDDi");
  }
  const ansType = question.anwserItem[0].anwserType;
  switch (ansType) {
    case 1:
      return /*#__PURE__*/React.createElement(AnswerInput, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 2:
      return /*#__PURE__*/React.createElement(AnswerTextArea, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 3:
      return /*#__PURE__*/React.createElement(AnswerNumber, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 4:
      return /*#__PURE__*/React.createElement(AnswerCheckbox, {
        question: question,
        onChange: (q, v, ans) => onChange(q, v, ans)
      });
    case 5:
      return /*#__PURE__*/React.createElement(AnswerRadio, {
        question: question,
        onChange: (q, v, ans) => onChange(q, v, ans)
      });
    case 6:
      return /*#__PURE__*/React.createElement(AnswerDate, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 7:
      return /*#__PURE__*/React.createElement(AnswerImage, {
        question: question,
        onChange: (q, v) => onChange(q, v),
        onDelete: (qId, url) => onDeleteUploadedImage(qId, url),
        onUpload: onUploadImages,
        onPickFromGallery: onPickImageFromGallery,
        onCaptureFromCamera: onCaptureImageFromCamera,
        filesBasePath: filesBasePath
      });
    case 8:
      return /*#__PURE__*/React.createElement(AnswerCamera, {
        question: question,
        cameraImages: cameraImages,
        onCapture: () => onCapture(question),
        onDelete: onDeleteCameraImage
      });
    case 16:
      return /*#__PURE__*/React.createElement(AnswerAudio, {
        question: question,
        onChange: (q, v) => onChange(q, v),
        onUpload: onUploadAudio,
        onRecord: onRecordAudio,
        onPickFromFiles: onPickAudioFromFiles
      });
    case 10:
      return /*#__PURE__*/React.createElement(AnswerGrid, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 11:
      return /*#__PURE__*/React.createElement(AnswerAddress, {
        question: question,
        provinces: provinces,
        districts: districts,
        towns: towns,
        onChange: onChange
      });
    case 12:
      return /*#__PURE__*/React.createElement(AnswerDropdown, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    case 13:
      return /*#__PURE__*/React.createElement(AnswerMultiSelect, {
        question: question,
        onChange: (q, v) => onChange(q, v)
      });
    default:
      return /*#__PURE__*/React.createElement(Text, {
        style: {
          color: '#EA4335'
        }
      }, "Kh\xF4ng c\xF3 lo\u1EA1i c\xE2u h\u1ECFi n\xE0y.");
  }
}
//# sourceMappingURL=AnswerRenderer.js.map