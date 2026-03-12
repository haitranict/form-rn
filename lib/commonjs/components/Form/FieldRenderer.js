"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldRenderer = FieldRenderer;
var _react = _interopRequireDefault(require("react"));
var _TextField = require("../fields/TextField");
var _TextAreaField = require("../fields/TextAreaField");
var _NumberField = require("../fields/NumberField");
var _SelectField = require("../fields/SelectField");
var _MultiSelectField = require("../fields/MultiSelectField");
var _RadioField = require("../fields/RadioField");
var _CheckboxField = require("../fields/CheckboxField");
var _CheckboxGroupField = require("../fields/CheckboxGroupField");
var _SwitchField = require("../fields/SwitchField");
var _RatingField = require("../fields/RatingField");
var _DateField = require("../fields/DateField");
var _SliderField = require("../fields/SliderField");
var _SectionHeader = require("../layout/SectionHeader");
var _FormDivider = require("../layout/FormDivider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Renders the correct component based on field.type.
 * Add new field types here as the library grows.
 */
function FieldRenderer({
  field
}) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return /*#__PURE__*/_react.default.createElement(_TextField.TextField, {
        config: field
      });
    case 'textarea':
      return /*#__PURE__*/_react.default.createElement(_TextAreaField.TextAreaField, {
        config: field
      });
    case 'phone':
      return /*#__PURE__*/_react.default.createElement(_TextField.TextField, {
        config: {
          ...field,
          type: 'text'
        }
      });
    case 'number':
      return /*#__PURE__*/_react.default.createElement(_NumberField.NumberField, {
        config: field
      });
    case 'date':
    case 'time':
    case 'datetime':
      return /*#__PURE__*/_react.default.createElement(_DateField.DateField, {
        config: field
      });
    case 'select':
      return /*#__PURE__*/_react.default.createElement(_SelectField.SelectField, {
        config: field
      });
    case 'multiselect':
      return /*#__PURE__*/_react.default.createElement(_MultiSelectField.MultiSelectField, {
        config: field
      });
    case 'radio':
      return /*#__PURE__*/_react.default.createElement(_RadioField.RadioField, {
        config: field
      });
    case 'checkbox':
      return /*#__PURE__*/_react.default.createElement(_CheckboxField.CheckboxField, {
        config: field
      });
    case 'checkbox_group':
      return /*#__PURE__*/_react.default.createElement(_CheckboxGroupField.CheckboxGroupField, {
        config: field
      });
    case 'switch':
      return /*#__PURE__*/_react.default.createElement(_SwitchField.SwitchField, {
        config: field
      });
    case 'rating':
      return /*#__PURE__*/_react.default.createElement(_RatingField.RatingField, {
        config: field
      });
    case 'slider':
      return /*#__PURE__*/_react.default.createElement(_SliderField.SliderField, {
        config: field
      });
    case 'section_header':
      return /*#__PURE__*/_react.default.createElement(_SectionHeader.SectionHeader, {
        config: field
      });
    case 'divider':
      return /*#__PURE__*/_react.default.createElement(_FormDivider.FormDivider, {
        config: field
      });

    // TODO: Add 'image', 'file', 'signature' when media fields are implemented
    default:
      return null;
  }
}
//# sourceMappingURL=FieldRenderer.js.map