export interface FormTheme {
    colors: {
        primary: string;
        primaryLight: string;
        danger: string;
        dangerLight: string;
        warning: string;
        success: string;
        text: string;
        textSecondary: string;
        textDisabled: string;
        placeholder: string;
        border: string;
        borderFocused: string;
        background: string;
        inputBackground: string;
        labelBackground: string;
        checkmark: string;
        white: string;
    };
    typography: {
        fontSizeLabel: number;
        fontSizeInput: number;
        fontSizeHelper: number;
        fontSizeError: number;
        fontSizeSectionTitle: number;
        fontWeightLabel: '400' | '500' | '600' | '700';
        fontWeightSectionTitle: '400' | '500' | '600' | '700';
    };
    spacing: {
        fieldGap: number;
        fieldPaddingH: number;
        fieldPaddingV: number;
        labelGap: number;
        helperGap: number;
        sectionGap: number;
        pagePaddingH: number;
        pagePaddingV: number;
    };
    shape: {
        borderRadius: number;
        borderWidth: number;
        borderWidthFocused: number;
    };
    sizes: {
        inputHeight: number;
        checkboxSize: number;
        radioSize: number;
        switchWidth: number;
        switchHeight: number;
        starSize: number;
    };
}
export declare const defaultTheme: FormTheme;
//# sourceMappingURL=defaultTheme.d.ts.map