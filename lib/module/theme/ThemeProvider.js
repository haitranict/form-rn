import React, { createContext, useContext } from 'react';
import { defaultTheme } from './defaultTheme';
const ThemeContext = /*#__PURE__*/createContext(defaultTheme);
export function ThemeProvider({
  theme,
  children
}) {
  const merged = theme ? {
    colors: {
      ...defaultTheme.colors,
      ...theme.colors
    },
    typography: {
      ...defaultTheme.typography,
      ...theme.typography
    },
    spacing: {
      ...defaultTheme.spacing,
      ...theme.spacing
    },
    shape: {
      ...defaultTheme.shape,
      ...theme.shape
    },
    sizes: {
      ...defaultTheme.sizes,
      ...theme.sizes
    }
  } : defaultTheme;
  return /*#__PURE__*/React.createElement(ThemeContext.Provider, {
    value: merged
  }, children);
}
export function useTheme() {
  return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map