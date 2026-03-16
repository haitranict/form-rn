import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import type { Question, CheckListItem } from '../types/sform.types';
import type { AnswerItem } from '../types/sform.types';
import { AnswerRenderer } from '../answers/AnswerRenderer';
import type { Province, District, Town, Province2025 } from '../types/sform.types';

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
  onPickImageFromGallery?: (question: Question) => void;
  onCaptureImageFromCamera?: (question: Question) =>void;
  onRecordAudio?: (question: Question) => void;
  onPickAudioFromFiles?: (question: Question) => void;
  filesBasePath?: string;
  dvhc2025?: Province2025[];
  baseUrl?: string;          // Base URL for question images
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
  onPickImageFromGallery,
  onCaptureImageFromCamera,
  onRecordAudio,
  onPickAudioFromFiles,
  filesBasePath,
  dvhc2025,
  baseUrl,
  onChange,
}: Props) {
  // Ẩn nếu checkList bảo không hiển thị
  if (!checkItem?.isShow) return null;

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const ansType = question.anwserItem[0]?.anwserType ?? 0;
  const constraint = formatConstraint(question.min, question.max, ansType);

  // Check if question has images
  const questionImages = question.images || [];
  const hasImages = questionImages.length > 0;

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setViewerVisible(true);
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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

      {/* Question Images */}
      {hasImages && (
        <View style={styles.imageGrid}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {questionImages.map((img, index) => {
              const imageUrl = img.imageURL.startsWith('http') 
                ? img.imageURL 
                : `${baseUrl || 'https://vnmpg.spiral.com.vn'}/${img.imageURL}`;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleImagePress(index)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={[
                      styles.thumbnail,
                      { height: img.imageHeight || 100 }
                    ]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

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
          onPickImageFromGallery={onPickImageFromGallery}
          onCaptureImageFromCamera={onCaptureImageFromCamera}
          onRecordAudio={onRecordAudio}
          onPickAudioFromFiles={onPickAudioFromFiles}
          filesBasePath={filesBasePath}
          dvhc2025={dvhc2025}
          onChange={onChange}
        />
      </View>

      {/* Image Viewer Modal */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setViewerVisible(false)}
          >
            <View style={styles.modalContent}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
              >
                {questionImages.map((img, index) => {
                  const imageUrl = img.imageURL.startsWith('http') 
                    ? img.imageURL 
                    : `${baseUrl || 'https://vnmpg.spiral.com.vn'}/${img.imageURL}`;
                  
                  return (
                    <View key={index} style={{ width: screenWidth, height: screenHeight }}>
                      <ScrollView
                        maximumZoomScale={3}
                        minimumZoomScale={1}
                        contentContainerStyle={styles.zoomContainer}
                      >
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.fullImage}
                          resizeMode="contain"
                        />
                      </ScrollView>
                    </View>
                  );
                })}
              </ScrollView>
              
              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setViewerVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* Image counter */}
              {questionImages.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {selectedImageIndex + 1} / {questionImages.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginTop: 8,
    marginBottom: 12,
  },
  thumbnail: {
    width: 120,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
