import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
export function FormTimer({
  startTime
}) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.icon
  }, "\u23F1"), /*#__PURE__*/React.createElement(Text, {
    style: styles.time
  }, String(minutes).padStart(2, '0'), ":", String(seconds).padStart(2, '0')));
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  icon: {
    fontSize: 16,
    marginRight: 6
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace'
  }
});
//# sourceMappingURL=FormTimer.js.map