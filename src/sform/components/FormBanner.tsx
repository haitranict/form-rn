import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { parseBanner } from '../utils/bannerUtils';

interface Props {
  banner: string | null | undefined;
  /** Banner dự phòng (vd: từ item trong SFormList) */
  fallbackBanner?: string | null;
  /** Base URL để ghép với đường dẫn ảnh tương đối */
  baseUrl?: string | null;
}

export function FormBanner({ banner, fallbackBanner, baseUrl }: Props) {
  const primary = parseBanner(banner, baseUrl);
  const parsed = primary.url ? primary : parseBanner(fallbackBanner, baseUrl);

  if (!parsed.url) {
    console.warn('[FormBanner] No image url. banner raw:', banner);
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: parsed.url }}
        style={[styles.image, { height: parsed.height ?? 200 }]}
        resizeMode="cover"
        onError={(e) => console.error('[FormBanner] Image load error:', parsed.url, e.nativeEvent.error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  image: { width: '100%' },
});
