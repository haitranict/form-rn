import React from 'react';
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
/**
 * Renders the correct component based on field.type.
 * Add new field types here as the library grows.
 */
export function FieldRenderer({
  field
}) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return /*#__PURE__*/React.createElement(TextField, {
        config: field
      });
    case 'textarea':
      return /*#__PURE__*/React.createElement(TextAreaField, {
        config: field
      });
    case 'phone':
      return /*#__PURE__*/React.createElement(TextField, {
        config: {
          ...field,
          type: 'text'
        }
      });
    case 'number':
      return /*#__PURE__*/React.createElement(NumberField, {
        config: field
      });
    case 'date':
    case 'time':
    case 'datetime':
      return /*#__PURE__*/React.createElement(DateField, {
        config: field
      });
    case 'select':
      return /*#__PURE__*/React.createElement(SelectField, {
        config: field
      });
    case 'multiselect':
      return /*#__PURE__*/React.createElement(MultiSelectField, {
        config: field
      });
    case 'radio':
      return /*#__PURE__*/React.createElement(RadioField, {
        config: field
      });
    case 'checkbox':
      return /*#__PURE__*/React.createElement(CheckboxField, {
        config: field
      });
    case 'checkbox_group':
      return /*#__PURE__*/React.createElement(CheckboxGroupField, {
        config: field
      });
    case 'switch':
      return /*#__PURE__*/React.createElement(SwitchField, {
        config: field
      });
    case 'rating':
      return /*#__PURE__*/React.createElement(RatingField, {
        config: field
      });
    case 'slider':
      return /*#__PURE__*/React.createElement(SliderField, {
        config: field
      });
    case 'section_header':
      return /*#__PURE__*/React.createElement(SectionHeader, {
        config: field
      });
    case 'divider':
      return /*#__PURE__*/React.createElement(FormDivider, {
        config: field
      });

    // TODO: Add 'image', 'file', 'signature' when media fields are implemented
    default:
      return null;
  }
}
//# sourceMappingURL=FieldRenderer.js.map