import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
export function FormBanner({
  banner
}) {
  if (!banner) return null;
  let config = null;
  try {
    config = JSON.parse(banner);
  } catch {
    return null;
  }
  if (!config?.imageURL) return null;
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: config.imageURL
    },
    style: [styles.image, {
      height: config.imageHeight ?? 200
    }],
    resizeMode: "cover"
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