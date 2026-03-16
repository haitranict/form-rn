export type AnswerType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 11 | 12 | 13 | 16;
export type QuestionType = 0 | 101 | 102 | 103 | 104 | 105 | 106;
export interface AnswerImage {
    imageURL: string;
}
export interface AnswerItem {
    id: number;
    anwserType: AnswerType;
    anwserName: string;
    anwserValue: string;
    ortherValue?: string;
    nextStep: number;
    selectedItem?: unknown;
    images?: AnswerImage[];
    dropdown?: string[];
}
export interface GridCol {
    colId: number;
    colName: string;
}
export interface GridRow {
    rowId: number;
    rowName: string;
}
export interface GridSchema {
    row: GridRow[];
    column: GridCol[];
}
export interface GridColValue {
    colId: number;
    colValue: string | boolean;
}
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
    images?: AnswerImage[];
}
export interface CheckListItem {
    questionId: number;
    isShow: boolean;
    isEnd: boolean;
}
export interface BannerConfig {
    imageURL: string;
    imageHeight: number;
}
export interface SFormData {
    id: number;
    title: string;
    subTitle: string;
    accessKey: string;
    banner: string | null;
    formData: string;
    usedEmployees: boolean | null;
    usedStores: boolean | null;
    toDate: number | null;
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
export interface UploadResult {
    fileUrl: string;
    message: string;
}
export interface InsertResultPayload {
    shopId: number;
    formDate: number;
    publicKey: string;
    spiralData: string;
    fromTime?: string | null;
    toTime?: string | null;
}
export interface InsertResultResponse {
    statusId: number;
    messager: string;
    data: any | null;
    totalRow: number;
}
export interface SFormState {
    formData: SFormData | null;
    checkList: CheckListItem[];
    employees: Employee[];
    shops: Shop[];
    selectedEmployee: Employee | null;
    selectedShop: Shop | null;
    imageQuestion: {
        index: number;
        questionId: number;
        imageData: string;
    }[];
    dataDistrict: District[];
    dataTown: Town[];
    sended: boolean;
    resultId: number;
    loading: boolean;
    expired: boolean;
    isSubmitting: boolean;
}
export interface FormListItem {
    id: number;
    accountId: number;
    status: string | null;
    title: string;
    subTitle: string | null;
    banner: string | null;
    usedEmployees: boolean | null;
    usedStores: boolean | null;
    slogan: string | null;
    fromDate: number | null;
    toDate: number | null;
    fromTime: string | null;
    toTime: string | null;
    formData: string;
    accessKey: string;
    publicUrl: string | null;
    inApp: number;
    createBy: number | null;
    createDate: string | null;
}
export interface FormListResponse {
    statusId: number;
    messager: string;
    data: FormListItem[];
    totalRow?: number;
}
//# sourceMappingURL=sform.types.d.ts.map