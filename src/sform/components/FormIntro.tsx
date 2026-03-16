import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import moment from 'moment';

interface FormIntroProps {
  title: string;
  subTitle: string;
  banner: string | null;
  fromDate: number | null;
  toDate: number | null;
  fromTime: string | null;
  toTime: string | null;
  onStart: () => void;
}

export function FormIntro({
  title,
  subTitle,
  banner,
  fromDate,
  toDate,
  fromTime,
  toTime,
  onStart,
}: FormIntroProps) {
  // Parse banner JSON to get imageURL
  const getBannerUrl = () => {
    console.log('[FormIntro] banner raw:', banner);
    if (!banner) return null;
    try {
      const config = JSON.parse(banner);
      console.log('[FormIntro] parsed config:', config);
      const url = config?.imageURL || null;
      console.log('[FormIntro] extracted imageURL:', url);
      return url;
    } catch (e) {
      console.error('[FormIntro] JSON parse error:', e);
      return null;
    }
  };

  const bannerUrl = getBannerUrl();

  // Format dates
  const formatDate = (date: number | null) => {
    if (!date) return '';
    const str = date.toString();
    return moment(str, 'YYYYMMDD').format('DD/MM/YYYY');
  };

  const fromDateStr = formatDate(fromDate);
  const toDateStr = formatDate(toDate);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner */}
      {bannerUrl && (
        <Image
          source={{ uri: bannerUrl }}
          style={styles.banner}
          resizeMode="cover"
          onError={(error) => {
            console.error('[FormIntro] Image load error:', error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log('[FormIntro] Image loaded successfully');
          }}
        />
      )}

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Subtitle */}
      {subTitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subTitle}</Text>
        </View>
      )}

      {/* Timeline */}
      {(fromDateStr || toDateStr) && (
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>⏰ Thời gian thực hiện</Text>
          {fromDateStr && (
            <Text style={styles.timelineText}>
              Từ: {fromDateStr} {fromTime || ''}
            </Text>
          )}
          {toDateStr && (
            <Text style={styles.timelineText}>
              Đến: {toDateStr} {toTime || ''}
            </Text>
          )}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📋 Hướng dẫn</Text>
        <Text style={styles.instructionsText}>
          • Đọc kỹ từng câu hỏi trước khi trả lời{'\n'}
          • Những câu có dấu (*) là bắt buộc{'\n'}
          • Kiểm tra lại trước khi gửi{'\n'}
          • Thời gian làm bài sẽ được tính từ khi bấm "Bắt đầu"
        </Text>
      </View>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Bắt đầu khảo sát</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 40,
  },
  banner: {
    width: '100%',
    height: 220,
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitleContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  timelineContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  timelineText: {
    fontSize: 14,
    color: '#E65100',
    marginTop: 4,
  },
  instructionsContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22,
  },
  startButton: {
    margin: 20,
    marginTop: 30,
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
