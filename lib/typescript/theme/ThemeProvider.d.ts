import React, { type ReactNode } from 'react';
import { type FormTheme } from './defaultTheme';
export declare function ThemeProvider({ theme, children, }: {
    theme?: Partial<FormTheme>;
    children: ReactNode;
}): React.JSX.Element;
export declare function useTheme(): FormTheme;
//# sourceMappingURL=ThemeProvider.d.ts.map