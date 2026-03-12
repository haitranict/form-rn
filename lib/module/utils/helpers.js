/**
 * Build default values map from field configs.
 */
export function buildDefaultValues(fields) {
  const defaults = {};
  fields.forEach(field => {
    if ('defaultValue' in field && field.defaultValue !== undefined) {
      defaults[field.id] = field.defaultValue;
    } else {
      switch (field.type) {
        case 'checkbox':
          defaults[field.id] = false;
          break;
        case 'checkbox_group':
        case 'multiselect':
          defaults[field.id] = [];
          break;
        case 'switch':
          defaults[field.id] = false;
          break;
        case 'rating':
          defaults[field.id] = 0;
          break;
        case 'slider':
          defaults[field.id] = field.min ?? 0;
          break;
        case 'section_header':
        case 'divider':
          // No value for layout elements
          break;
        default:
          defaults[field.id] = '';
      }
    }
  });
  return defaults;
}

/**
 * Flatten pages fields into a single array.
 */
export function flattenFields(fields, pages) {
  if (fields) return fields;
  if (pages) return pages.flatMap(p => p.fields);
  return [];
}

/**
 * Deep clone a plain object (for form values).
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Filter out layout-only fields (section_header, divider) for submission.
 */
export function filterSubmitValues(values, fields) {
  const layoutTypes = new Set(['section_header', 'divider']);
  const result = {};
  fields.forEach(field => {
    if (!layoutTypes.has(field.type)) {
      result[field.id] = values[field.id];
    }
  });
  return result;
}
//# sourceMappingURL=helpers.js.map