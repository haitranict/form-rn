import React, { createContext, useContext, type ReactNode } from 'react';
import { defaultTheme, type FormTheme } from './defaultTheme';

const ThemeContext = createContext<FormTheme>(defaultTheme);

export function ThemeProvider({
  theme,
  children,
}: {
  theme?: Partial<FormTheme>;
  children: ReactNode;
}) {
  const merged: FormTheme = theme
    ? {
        colors: { ...defaultTheme.colors, ...theme.colors },
        typography: { ...defaultTheme.typography, ...theme.typography },
        spacing: { ...defaultTheme.spacing, ...theme.spacing },
        shape: { ...defaultTheme.shape, ...theme.shape },
        sizes: { ...defaultTheme.sizes, ...theme.sizes },
      }
    : defaultTheme;

  return <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>;
}

export function useTheme(): FormTheme {
  return useContext(ThemeContext);
}
