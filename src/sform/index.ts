// SForm module exports
export { SFormResult } from './SFormResult';
export type { SFormResultProps } from './SFormResult';
export { SFormList } from './SFormList';
export type { SFormListProps, SFormListRef } from './SFormList';

// Types
export type {
  SFormData,
  SFormState,
  Question,
  AnswerItem,
  CheckListItem,
  Employee,
  Shop,
  Province,
  District,
  Town,
  Province2025,
  Ward2025,
  DVHC2025Data,
  BannerConfig,
  GridSchema,
  GridRow,
  GridCol,
  FormListItem,
  FormListResponse,
  GridRowValue,
  GridColValue,
  UploadResult,
  InsertResultPayload,
  InsertResultResponse,
  AnswerType,
  QuestionType,
} from './types/sform.types';

// Hooks (để customise nếu cần)
export { useSFormState } from './hooks/useSFormState';
export { useSFormHandlers } from './hooks/useSFormHandlers';
export { useSFormValidation } from './hooks/useSFormValidation';
export type { SFormApiConfig } from './hooks/useSFormApi';
export {
  apiGetFormById,
  apiGetShops,
  apiInsertResult,
  apiUploadImages,
  apiUploadAudio,
} from './hooks/useSFormApi';

// Components
export { QuestionItem } from './components/QuestionItem';
export { FormBanner } from './components/FormBanner';
export { FormTitle } from './components/FormTitle';
export { FormUserInfo } from './components/FormUserInfo';
export { FormExpired } from './components/FormExpired';
export { FormSuccess } from './components/FormSuccess';

// Answer components (standalone)
export { AnswerRenderer } from './answers/AnswerRenderer';
export { AnswerInput } from './answers/AnswerInput';
export { AnswerTextArea } from './answers/AnswerTextArea';
export { AnswerNumber } from './answers/AnswerNumber';
export { AnswerCheckbox } from './answers/AnswerCheckbox';
export { AnswerRadio } from './answers/AnswerRadio';
export { AnswerDate } from './answers/AnswerDate';
export { AnswerImage } from './answers/AnswerImage';
export { AnswerCamera } from './answers/AnswerCamera';
export { AnswerAudio } from './answers/AnswerAudio';
export { AnswerGrid } from './answers/AnswerGrid';
export { AnswerAddress } from './answers/AnswerAddress';
export { AnswerDropdown } from './answers/AnswerDropdown';
export { AnswerMultiSelect } from './answers/AnswerMultiSelect';
