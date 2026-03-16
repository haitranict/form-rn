import React from 'react';
import type { Question, AnswerItem, Province, District, Town, Province2025 } from '../types/sform.types';
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

interface CameraImage { index: number; questionId: number; imageData: string; }

interface Props {
  question: Question;
  provinces: Province[];
  districts: District[];
  towns: Town[];
  cameraImages: CameraImage[];
  onCapture: (question: Question) => void;
  onDeleteCameraImage: (index: number) => void;
  onDeleteUploadedImage: (questionId: number, url: string) => void;
  onUploadImages: (files: Array<{ uri: string; name: string; type: string }>, question: Question) => void;
  onUploadAudio: (files: Array<{ uri: string; name: string; type: string }>, question: Question) => void;
  onPickImageFromGallery?: (question: Question) => void;
  onCaptureImageFromCamera?: (question: Question) => void;
  onRecordAudio?: (question: Question) => void;
  onPickAudioFromFiles?: (question: Question) => void;
  filesBasePath?: string;
  dvhc2025?: Province2025[];
  onChange: (question: Question, value: unknown, answerItem?: AnswerItem) => void;
}

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
  dvhc2025,
  onChange,
}: Props) {
  if (question.anwserItem.length === 0) {
    return <Text style={{ color: '#9AA0A6' }}>Không có câu trả lời</Text>;
  }

  const ansType = question.anwserItem[0].anwserType;

  switch (ansType) {
    case 1:
      return (
        <AnswerInput
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 2:
      return (
        <AnswerTextArea
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 3:
      return (
        <AnswerNumber
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 4:
      return (
        <AnswerCheckbox
          question={question}
          onChange={(q, v, ans) => onChange(q, v, ans)}
        />
      );
    case 5:
      return (
        <AnswerRadio
          question={question}
          onChange={(q, v, ans) => onChange(q, v, ans)}
        />
      );
    case 6:
      return (
        <AnswerDate
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 7:
      return (
        <AnswerImage
          question={question}
          onChange={(q, v) => onChange(q, v)}
          onDelete={(qId, url) => onDeleteUploadedImage(qId, url)}
          onUpload={onUploadImages}
          onPickFromGallery={onPickImageFromGallery}
          onCaptureFromCamera={onCaptureImageFromCamera}
          filesBasePath={filesBasePath}
        />
      );
    case 8:
      return (
        <AnswerCamera
          question={question}
          cameraImages={cameraImages}
          onCapture={() => onCapture(question)}
          onDelete={onDeleteCameraImage}
          onCameraCapture={onCaptureImageFromCamera}
          filesBasePath={filesBasePath}
        />
      );
    case 16:
      return (
        <AnswerAudio
          question={question}
          onChange={(q, v) => onChange(q, v)}
          onUpload={onUploadAudio}
          onRecord={onRecordAudio}
          onPickFromFiles={onPickAudioFromFiles}
        />
      );
    case 10:
      return (
        <AnswerGrid
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 11:
      return (
        <AnswerAddress
          question={question}
          provinces={provinces}
          districts={districts}
          towns={towns}
          onChange={onChange}
          dvhc2025={dvhc2025}
        />
      );
    case 12:
      return (
        <AnswerDropdown
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    case 13:
      return (
        <AnswerMultiSelect
          question={question}
          onChange={(q, v) => onChange(q, v)}
        />
      );
    default:
      return <Text style={{ color: '#EA4335' }}>Không có loại câu hỏi này.</Text>;
  }
}
