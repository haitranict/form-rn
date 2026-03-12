export interface FieldError {
    message: string;
    type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'phone' | 'custom';
}
export type FormErrors = Record<string, FieldError>;
export type FormTouchedFields = Record<string, boolean>;
//# sourceMappingURL=validation.types.d.ts.map