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
  imageId?: number | null;
  imageURL: string;
  imageData?: string | null;
  imageHeight?: number;
  imageIndex?: number | null;
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
  accessKey: string;
  banner: string | null;
  formData: string;            // JSON string of Question[]
  usedEmployees: boolean | null;
  usedStores: boolean | null;
  toDate: number | null;       // YYYYMMDD format
  fromDate: number | null;
  fromTime: string | null;
  toTime: string | null;
  accountId: number;
  createBy: number | null;
  createDate: string | null;
  status: string | null;
  slogan: string | null;
  inApp: boolean | null;
  publicUrl: string | null;
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

// Province / District / Town (dvhcvn structure - old)
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

// DVHC 2025 structure (Province → Ward directly, no District)
export interface Ward2025 {
  level2_id: number;
  name: string;
}

export interface Province2025 {
  level1_id: number;
  name: string;
  level2s: Ward2025[];
}

export interface DVHC2025Data {
  data: Province2025[];
}

// Upload result
export interface UploadResult {
  fileUrl: string;
  message: string;
}

// Submit payload - matches backend spiralFormModel
export interface InsertResultPayload {
  shopId: number;
  formDate: number;          // YYYYMMDD format
  publicKey: string;
  spiralData: string;        // JSON string of questions/answers
  fromTime?: string | null;  // TimeSpan as "HH:mm:ss" or null
  toTime?: string | null;    // TimeSpan as "HH:mm:ss" or null
}
// Submit API response
export interface InsertResultResponse {
  statusId: number;     // 200 = success
  messager: string;     // Message from server (note: API uses 'messager' not 'message')
  data: any | null;     // Response data (can be null)
  totalRow: number;     // Total row count
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
  id: number;                // formId
  accountId: number;
  status: string | null;
  title: string;             // Tên form
  subTitle: string | null;   // Mô tả
  banner: string | null;     // URL ảnh banner (nếu có)
  usedEmployees: boolean | null;
  usedStores: boolean | null;
  slogan: string | null;
  fromDate: number | null;   // YYYYMMDD
  toDate: number | null;     // YYYYMMDD
  fromTime: string | null;
  toTime: string | null;
  formData: string;          // JSON string của questions
  accessKey: string;         // formKey - dùng để fetch detail
  publicUrl: string | null;
  inApp: number;             // 0 = web only, 1 = in app
  createBy: number | null;
  createDate: string | null;
}

// Response wrapper
export interface FormListResponse {
  statusId: number;          // 200 = success
  messager: string;          // Note: API uses 'messager' not 'message'
  data: FormListItem[];
  totalRow?: number;         // Total count of forms
}
