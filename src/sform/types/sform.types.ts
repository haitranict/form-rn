// ============================================================
// SForm Types - mirror của web form-result.js
// ============================================================

// ---- Answer Types (anwserType) ----
// 1  = Text input
// 2  = Textarea
// 3  = Number
// 4  = Checkbox (multi-choice)
// 5  = Radio (single-choice)
// 6  = Date
// 7  = Image (gallery upload)
// 8  = Camera
// 10 = Grid/Matrix
// 11 = Address (Province/District/Town)
// 12 = Dropdown (single autocomplete)
// 13 = Multi-select
// 16 = Audio

// ---- Question Types (questionType) cho Grid ----
// 0   = Normal question
// 101 = Grid Radio
// 102 = Grid Checkbox
// 103 = Grid Text
// 104 = Grid Number
// 105 = Grid Date
// 106 = Grid Dropdown

export type AnswerType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 11 | 12 | 13 | 16;
export type QuestionType = 0 | 101 | 102 | 103 | 104 | 105 | 106;

export interface AnswerImage {
  imageURL: string;
}

export interface AnswerItem {
  id: number;                  // 99 = "Khác/Other"
  anwserType: AnswerType;
  anwserName: string;          // For radio/checkbox: display text. For grid/dropdown: JSON string
  anwserValue: string;         // Current value (string or JSON stringified)
  ortherValue?: string;        // Value when id===99 (Other)
  nextStep: number;            // Next questionId to jump to. 9999 = end form
  selectedItem?: unknown;      // For address dropdowns: selected object
  images?: AnswerImage[];      // Optional reference images for this answer
  dropdown?: string[];         // For grid type 106
}

// Grid column
export interface GridCol {
  colId: number;
  colName: string;
}

// Grid row
export interface GridRow {
  rowId: number;
  rowName: string;
}

// Grid schema (parsed from anwserName)
export interface GridSchema {
  row: GridRow[];
  column: GridCol[];
}

// Grid value cell
export interface GridColValue {
  colId: number;
  colValue: string | boolean;
}

// Grid row value
export interface GridRowValue {
  rowId: number;
  rowValue: GridColValue[];
}

export interface Question {
  questionId: number;
  questionName: string;
  questionType: QuestionType;
  required: boolean;
  min: string | null;
  max: string | null;
  isEnd: boolean;
  indexRow: number;
  anwserItem: AnswerItem[];
  images?: AnswerImage[];      // Reference images attached to the question
}

// Item trong checkList tracking visibility
export interface CheckListItem {
  questionId: number;
  isShow: boolean;
  isEnd: boolean;
}

// Banner config (parsed from formData.banner)
export interface BannerConfig {
  imageURL: string;
  imageHeight: number;
}

// Raw form data from API
export interface SFormData {
  id: number;
  title: string;
  subTitle: string;
  banner: string | null;       // JSON string of BannerConfig
  formData: string;            // JSON string of Question[]
  employees: string;           // JSON string of Employee[]
  usedEmployees: boolean;
  usedStores: boolean;
  toDate: number | null;       // YYYYMMDD format
  fromDate: number | null;
  accountId: number;
  createBy: number;
}

export interface Employee {
  Id: number;
  FullName: string;
  EmployeeCode?: string;
}

export interface Shop {
  shopId: number;
  shopNameVN: string;
}

// Province / District / Town (dvhcvn structure)
export interface Town {
  level3_id: string;
  name: string;
}

export interface District {
  level2_id: string;
  name: string;
  level3s: Town[];
}

export interface Province {
  level1_id: string;
  name: string;
  level2s: District[];
}

// Upload result
export interface UploadResult {
  fileUrl: string;
  message: string;
}

// Submit payload
export interface InsertResultPayload {
  dataByDomain: string;
  formData: SFormData;
}

// Submit API response
export interface InsertResultResponse {
  result: number;     // 1 = success
  error: string;      // resultId as string when success
  messenger: string;
}

// Form state (dùng trong useSFormState)
export interface SFormState {
  formData: SFormData | null;
  checkList: CheckListItem[];
  employees: Employee[];
  shops: Shop[];
  selectedEmployee: Employee | null;
  selectedShop: Shop | null;
  imageQuestion: { index: number; questionId: number; imageData: string }[];
  dataDistrict: District[];
  dataTown: Town[];
  sended: boolean;
  resultId: number;
  loading: boolean;
  expired: boolean;
  isSubmitting: boolean;
}

// ============================================================
// Form List Types
// ============================================================

export interface FormListItem {
  Id: number;                // formId
  Title: string;             // Tên form
  SubTitle?: string;         // Mô tả
  AccessKey: string;         // formKey - dùng để fetch detail
  FromDate?: number;         // YYYYMMDD
  ToDate?: number;           // YYYYMMDD
  MMobile?: number;
  formData?: string;         // JSON string
  InApp?: number;
  WebUrl?: string;
  publicUrl?: string;
  Banner?: string;           // JSON string
}

// Response wrapper
export interface FormListResponse {
  code: number;              // 200 = success
  message: string;
  data: FormListItem[];
}
