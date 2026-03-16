// ============================================================
// @spiral/rn-form
// A Google Form-like library for React Native
// ============================================================

// Main Form Component
export { Form } from './components/Form/index';
export { FormPage } from './components/Form/FormPage';
export { FieldRenderer } from './components/Form/FieldRenderer';

// Field Components (for standalone use)
export { TextField } from './components/fields/TextField';
export { TextAreaField } from './components/fields/TextAreaField';
export { NumberField } from './components/fields/NumberField';
export { SelectField } from './components/fields/SelectField';
export { MultiSelectField } from './components/fields/MultiSelectField';
export { RadioField } from './components/fields/RadioField';
export { CheckboxField } from './components/fields/CheckboxField';
export { CheckboxGroupField } from './components/fields/CheckboxGroupField';
export { SwitchField } from './components/fields/SwitchField';
export { RatingField } from './components/fields/RatingField';
export { DateField } from './components/fields/DateField';
export { SliderField } from './components/fields/SliderField';

// Layout Components
export { FieldWrapper } from './components/layout/FieldWrapper';
export { SectionHeader } from './components/layout/SectionHeader';
export { FormDivider } from './components/layout/FormDivider';
export { ProgressBar } from './components/layout/ProgressBar';

// Hooks (for custom form UIs)
export { useForm } from './hooks/useForm';
export { useFormField } from './hooks/useFormField';
export { useFormContext } from './context/FormContext';

// Theme
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export { defaultTheme } from './theme/defaultTheme';
export type { FormTheme } from './theme/defaultTheme';

// Types
export type {
  // Field
  FieldType,
  FieldOption,
  FieldConfig,
  BaseFieldConfig,
  TextFieldConfig,
  TextAreaFieldConfig,
  NumberFieldConfig,
  PhoneFieldConfig,
  DateFieldConfig,
  TimeFieldConfig,
  DateTimeFieldConfig,
  SelectFieldConfig,
  MultiSelectFieldConfig,
  RadioFieldConfig,
  CheckboxFieldConfig,
  CheckboxGroupFieldConfig,
  SwitchFieldConfig,
  RatingFieldConfig,
  SliderFieldConfig,
  ImageFieldConfig,
  FileFieldConfig,
  SignatureFieldConfig,
  SectionHeaderConfig,
  DividerConfig,
  FieldValidation,
  ConditionalLogic,
  ConditionalRule,
} from './types/field.types';

export type {
  FormConfig,
  FormPage as FormPageConfig,
  FormSubmitData,
} from './types/form.types';

export type {
  FieldError,
  FormErrors,
  FormTouchedFields,
} from './types/validation.types';

// ---- SForm (Google Form-like dynamic form) ----
export * from './sform/index';

// ---- Data ----
export * from './data/index';
