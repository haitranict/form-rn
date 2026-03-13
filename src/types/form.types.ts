import type { FieldConfig } from './field.types';

// ============================================================
// FORM TYPES
// ============================================================

export interface FormPage {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
}

export interface FormSubmitData {
  values: Record<string, unknown>;
  meta: {
    formId: string;
    submittedAt: string;
    duration?: number; // ms spent filling form
  };
}

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  /** Single-page: pass `fields`. Multi-page: pass `pages`. */
  fields?: FieldConfig[];
  pages?: FormPage[];
  submitLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
  showProgressBar?: boolean;
  showPageNumbers?: boolean;
  /** Called with validated data on submit */
  onSubmit: (data: FormSubmitData) => void | Promise<void>;
  /** Called on any field value change */
  onChange?: (fieldId: string, value: unknown, allValues: Record<string, unknown>) => void;
  /** Called when user navigates between pages */
  onPageChange?: (currentPage: number, totalPages: number) => void;
}
