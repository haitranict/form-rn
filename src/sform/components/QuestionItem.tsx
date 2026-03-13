import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Question, CheckListItem } from '../types/sform.types';
import type { AnswerItem } from '../types/sform.types';
import { AnswerRenderer } from '../answers/AnswerRenderer';
import type { Province, District, Town } from '../types/sform.types';

interface CameraImage { index: number; questionId: number; imageData: string; }

interface Props {
  question: Question;
  checkItem: CheckListItem | undefined;
  provinces: Province[];
  districts: District[];
  towns: Town[];
  cameraImages: CameraImage[];
  onCapture: (q: Question) => void;
  onDeleteCameraImage: (index: number) => void;
  onDeleteUploadedImage: (questionId: number, url: string) => void;
  onUploadImages: (files: Array<{ uri: string; name: string; type: string }>, q: Question) => void;
  onUploadAudio: (files: Array<{ uri: string; name: string; type: string }>, q: Question) => void;
  onChange: (question: Question, value: unknown, answerItem?: AnswerItem) => void;
}

function formatConstraint(
  min: string | null,
  max: string | null,
  ansType: number
): string | null {
  if (!min && !max) return null;
  const label = ansType === 7 || ansType === 8 ? 'Số lượng hình' : 'Giá trị';
  const parts: string[] = [];
  if (min) parts.push(`${label} tối thiểu: ${min}`);
  if (max) parts.push(`${label} tối đa: ${max}`);
  return parts.join(' - ');
}

export function QuestionItem({
  question,
  checkItem,
  provinces,
  districts,
  towns,
  cameraImages,
  onCapture,
  onDeleteCameraImage,
  onDeleteUploadedImage,
  onUploadImages,
  onUploadAudio,
  onChange,
}: Props) {
  // Ẩn nếu checkList bảo không hiển thị
  if (!checkItem?.isShow) return null;

  const ansType = question.anwserItem[0]?.anwserType ?? 0;
  const constraint = formatConstraint(question.min, question.max, ansType);

  return (
    <View style={styles.card}>
      {/* Question title */}
      <View style={styles.header}>
        <Text style={styles.questionText}>
          {question.questionName}
          {question.required && (
            <Text style={styles.required}> *</Text>
          )}
        </Text>
        {constraint && (
          <Text style={styles.constraint}>( {constraint} )</Text>
        )}
      </View>

      {/* Answer */}
      <View style={styles.answerContainer}>
        <AnswerRenderer
          question={question}
          provinces={provinces}
          districts={districts}
          towns={towns}
          cameraImages={cameraImages}
          onCapture={onCapture}
          onDeleteCameraImage={onDeleteCameraImage}
          onDeleteUploadedImage={onDeleteUploadedImage}
          onUploadImages={onUploadImages}
          onUploadAudio={onUploadAudio}
          onChange={onChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#202124',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  required: {
    color: '#EA4335',
    fontSize: 17,
    fontWeight: '700',
  },
  constraint: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 6,
    fontStyle: 'italic',
  },
  answerContainer: {
    minHeight: 48,
  },
  imageGrid: {
    marginTop: 12,
  },
  thumbnailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});
