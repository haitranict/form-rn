import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  canGoNext,
  isSubmitting,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Câu {currentStep + 1} / {totalSteps}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / totalSteps) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonsRow}>
        {/* Previous button */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.previousBtn,
            isFirstStep && styles.buttonDisabled,
          ]}
          onPress={onPrevious}
          disabled={isFirstStep}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.previousText]}>
            ← Quay lại
          </Text>
        </TouchableOpacity>

        {/* Next/Submit button */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.nextBtn,
            (!canGoNext || isSubmitting) && styles.buttonDisabled,
          ]}
          onPress={isLastStep ? onSubmit : onNext}
          disabled={!canGoNext || isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.nextText]}>
            {isLastStep ? '✓ Gửi' : 'Tiếp →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DADCE0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 13,
    color: '#5F6368',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8EAED',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 3,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  previousBtn: {
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  nextBtn: {
    backgroundColor: '#4285F4',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previousText: {
    color: '#5F6368',
  },
  nextText: {
    color: '#fff',
  },
});
