import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { BannerConfig } from '../types/sform.types';

interface Props {
  banner: string | null | undefined;
}

export function FormBanner({ banner }: Props) {
  console.log('[FormBanner] banner raw:', banner);
  if (!banner) return null;

  let config: BannerConfig | null = null;
  try {
    config = JSON.parse(banner) as BannerConfig;
    console.log('[FormBanner] parsed config:', config);
  } catch (e) {
    console.error('[FormBanner] JSON parse error:', e);
    return null;
  }

  if (!config?.imageURL) {
    console.warn('[FormBanner] No imageURL in config');
    return null;
  }

  console.log('[FormBanner] Rendering image:', config.imageURL);
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: config.imageURL }}
        style={[styles.image, { height: config.imageHeight ?? 200 }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  image: { width: '100%' },
});
