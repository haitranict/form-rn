import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { parseBanner } from '../utils/bannerUtils';
export function FormBanner({
  banner,
  fallbackBanner,
  baseUrl
}) {
  const primary = parseBanner(banner, baseUrl);
  const parsed = primary.url ? primary : parseBanner(fallbackBanner, baseUrl);
  if (!parsed.url) {
    console.warn('[FormBanner] No image url. banner raw:', banner);
    return null;
  }
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: parsed.url
    },
    style: [styles.image, {
      height: parsed.height ?? 200
    }],
    resizeMode: "cover",
    onError: e => console.error('[FormBanner] Image load error:', parsed.url, e.nativeEvent.error)
  }));
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 8
  },
  image: {
    width: '100%'
  }
});
//# sourceMappingURL=FormBanner.js.map