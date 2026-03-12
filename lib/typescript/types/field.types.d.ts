export type FieldType = 'text' | 'textarea' | 'email' | 'password' | 'number' | 'phone' | 'url' | 'date' | 'time' | 'datetime' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'checkbox_group' | 'switch' | 'rating' | 'slider' | 'image' | 'file' | 'signature' | 'section_header' | 'divider';
export interface FieldOption {
    label: string;
    value: string | number;
    disabled?: boolean;
    icon?: string;
    description?: string;
}
export interface ConditionalRule {
    fieldId: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
    value?: unknown;
}
export interface ConditionalLogic {
    action: 'show' | 'hide' | 'require' | 'disable';
    match: 'all' | 'any';
    rules: ConditionalRule[];
}
export interface FieldValidation {
    required?: boolean | {
        value: boolean;
        message: string;
    };
    minLength?: number | {
        value: number;
        message: string;
    };
    maxLength?: number | {
        value: number;
        message: string;
    };
    min?: number | {
        value: number;
        message: string;
    };
    max?: number | {
        value: number;
        message: string;
    };
    pattern?: RegExp | {
        value: RegExp;
        message: string;
    };
    email?: boolean | {
        value: boolean;
        message: string;
    };
    url?: boolean | {
        value: boolean;
        message: string;
    };
    phone?: boolean | {
        value: boolean;
        message: string;
    };
    custom?: (value: unknown, formValues: Record<string, unknown>) => string | undefined | null;
}
export interface BaseFieldConfig {
    id: string;
    type: FieldType;
    label?: string;
    placeholder?: string;
    description?: string;
    defaultValue?: unknown;
    validation?: FieldValidation;
    conditional?: ConditionalLogic;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    style?: object;
}
export interface TextFieldConfig extends BaseFieldConfig {
    type: 'text' | 'email' | 'password' | 'url';
    maxLength?: number;
    prefix?: string;
    suffix?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}
export interface TextAreaFieldConfig extends BaseFieldConfig {
    type: 'textarea';
    numberOfLines?: number;
    maxLength?: number;
}
export interface NumberFieldConfig extends BaseFieldConfig {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    suffix?: string;
}
export interface PhoneFieldConfig extends BaseFieldConfig {
    type: 'phone';
    countryCode?: string;
}
export interface DateFieldConfig extends BaseFieldConfig {
    type: 'date';
    minDate?: Date;
    maxDate?: Date;
    format?: string;
    mode?: 'date';
}
export interface TimeFieldConfig extends BaseFieldConfig {
    type: 'time';
    format?: '12h' | '24h';
    minuteInterval?: number;
    mode?: 'time';
}
export interface DateTimeFieldConfig extends BaseFieldConfig {
    type: 'datetime';
    minDate?: Date;
    maxDate?: Date;
    format?: string;
    mode?: 'datetime';
}
export interface SelectFieldConfig extends BaseFieldConfig {
    type: 'select';
    options: FieldOption[];
    searchable?: boolean;
    clearable?: boolean;
}
export interface MultiSelectFieldConfig extends BaseFieldConfig {
    type: 'multiselect';
    options: FieldOption[];
    searchable?: boolean;
    maxSelections?: number;
}
export interface RadioFieldConfig extends BaseFieldConfig {
    type: 'radio';
    options: FieldOption[];
    layout?: 'vertical' | 'horizontal';
}
export interface CheckboxFieldConfig extends BaseFieldConfig {
    type: 'checkbox';
    checkboxLabel?: string;
}
export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
    type: 'checkbox_group';
    options: FieldOption[];
    layout?: 'vertical' | 'horizontal';
    maxSelections?: number;
}
export interface SwitchFieldConfig extends BaseFieldConfig {
    type: 'switch';
    onLabel?: string;
    offLabel?: string;
}
export interface RatingFieldConfig extends BaseFieldConfig {
    type: 'rating';
    maxRating?: number;
    icon?: 'star' | 'heart' | 'thumb';
    allowHalf?: boolean;
}
export interface SliderFieldConfig extends BaseFieldConfig {
    type: 'slider';
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    minLabel?: string;
    maxLabel?: string;
}
export interface ImageFieldConfig extends BaseFieldConfig {
    type: 'image';
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMB?: number;
    quality?: number;
    allowCamera?: boolean;
    allowGallery?: boolean;
}
export interface FileFieldConfig extends BaseFieldConfig {
    type: 'file';
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptTypes?: string[];
}
export interface SignatureFieldConfig extends BaseFieldConfig {
    type: 'signature';
    strokeColor?: string;
    strokeWidth?: number;
    backgroundColor?: string;
    height?: number;
}
export interface SectionHeaderConfig extends BaseFieldConfig {
    type: 'section_header';
    title: string;
    subtitle?: string;
    imageUrl?: string;
}
export interface DividerConfig extends BaseFieldConfig {
    type: 'divider';
    color?: string;
    thickness?: number;
}
export type FieldConfig = TextFieldConfig | TextAreaFieldConfig | NumberFieldConfig | PhoneFieldConfig | DateFieldConfig | TimeFieldConfig | DateTimeFieldConfig | SelectFieldConfig | MultiSelectFieldConfig | RadioFieldConfig | CheckboxFieldConfig | CheckboxGroupFieldConfig | SwitchFieldConfig | RatingFieldConfig | SliderFieldConfig | ImageFieldConfig | FileFieldConfig | SignatureFieldConfig | SectionHeaderConfig | DividerConfig;
//# sourceMappingURL=field.types.d.ts.map