import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { BannerConfig } from '../types/sform.types';

interface Props {
  banner: string | null | undefined;
}

export function FormBanner({ banner }: Props) {
  if (!banner) return null;

  let config: BannerConfig | null = null;
  try {
    config = JSON.parse(banner) as BannerConfig;
  } catch {
    return null;
  }

  if (!config?.imageURL) return null;

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
