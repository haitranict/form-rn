import React from 'react';
import type { FieldConfig } from '../../types/field.types';
import { TextField } from '../fields/TextField';
import { TextAreaField } from '../fields/TextAreaField';
import { NumberField } from '../fields/NumberField';
import { SelectField } from '../fields/SelectField';
import { MultiSelectField } from '../fields/MultiSelectField';
import { RadioField } from '../fields/RadioField';
import { CheckboxField } from '../fields/CheckboxField';
import { CheckboxGroupField } from '../fields/CheckboxGroupField';
import { SwitchField } from '../fields/SwitchField';
import { RatingField } from '../fields/RatingField';
import { DateField } from '../fields/DateField';
import { SliderField } from '../fields/SliderField';
import { SectionHeader } from '../layout/SectionHeader';
import { FormDivider } from '../layout/FormDivider';
import type {
  TextFieldConfig,
  TextAreaFieldConfig,
  NumberFieldConfig,
  SelectFieldConfig,
  MultiSelectFieldConfig,
  RadioFieldConfig,
  CheckboxFieldConfig,
  CheckboxGroupFieldConfig,
  SwitchFieldConfig,
  RatingFieldConfig,
  DateFieldConfig,
  TimeFieldConfig,
  DateTimeFieldConfig,
  SliderFieldConfig,
  SectionHeaderConfig,
  DividerConfig,
} from '../../types/field.types';

interface FieldRendererProps {
  field: FieldConfig;
}

/**
 * Renders the correct component based on field.type.
 * Add new field types here as the library grows.
 */
export function FieldRenderer({ field }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return <TextField config={field as TextFieldConfig} />;

    case 'textarea':
      return <TextAreaField config={field as TextAreaFieldConfig} />;

    case 'phone':
      return <TextField config={{ ...(field as unknown as TextFieldConfig), type: 'text' }} />;

    case 'number':
      return <NumberField config={field as NumberFieldConfig} />;

    case 'date':
    case 'time':
    case 'datetime':
      return <DateField config={field as DateFieldConfig | TimeFieldConfig | DateTimeFieldConfig} />;

    case 'select':
      return <SelectField config={field as SelectFieldConfig} />;

    case 'multiselect':
      return <MultiSelectField config={field as MultiSelectFieldConfig} />;

    case 'radio':
      return <RadioField config={field as RadioFieldConfig} />;

    case 'checkbox':
      return <CheckboxField config={field as CheckboxFieldConfig} />;

    case 'checkbox_group':
      return <CheckboxGroupField config={field as CheckboxGroupFieldConfig} />;

    case 'switch':
      return <SwitchField config={field as SwitchFieldConfig} />;

    case 'rating':
      return <RatingField config={field as RatingFieldConfig} />;

    case 'slider':
      return <SliderField config={field as SliderFieldConfig} />;

    case 'section_header':
      return <SectionHeader config={field as SectionHeaderConfig} />;

    case 'divider':
      return <FormDivider config={field as DividerConfig} />;

    // TODO: Add 'image', 'file', 'signature' when media fields are implemented
    default:
      return null;
  }
}
