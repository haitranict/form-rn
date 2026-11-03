import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import moment from 'moment';

import type { Question, Employee, Shop, AnswerItem, Province2025 } from './types/sform.types';
import { useSFormState } from './hooks/useSFormState';
import { useSFormHandlers } from './hooks/useSFormHandlers';
import { useSFormValidation } from './hooks/useSFormValidation';
import {
  apiGetFormById,
  apiGetShops,
  apiInsertResult,
  apiUploadImages,
  apiUploadAudio,
  type SFormApiConfig,
} from './hooks/useSFormApi';
import { QuestionItem } from './components/QuestionItem';
import { FormBanner } from './components/FormBanner';
import { FormTitle } from './components/FormTitle';
import { FormUserInfo } from './components/FormUserInfo';
import { FormExpired } from './components/FormExpired';
import { FormSuccess } from './components/FormSuccess';
import { StepNavigation } from './components/StepNavigation';
import { FormIntro } from './components/FormIntro';
import { FormTimer } from './components/FormTimer';
import { getCachedFormItem } from './utils/formCache';
import { setDefaultBaseUrl, getDefaultBaseUrl } from './utils/bannerUtils';
import { dvhcvnData } from '../data';

// Địa phương (tỉnh/huyện/xã) - Old structure: Province → District → Town
const provinceData = dvhcvnData?.data || [];

// ============================================================
// Props
// ============================================================

export interface SFormResultProps {
  /** String sau dấu ? trên URL, ví dụ "abc123" hoặc "formId=123&..." */
  formId: string;
  /** Cấu hình API */
  apiConfig: SFormApiConfig;
  /** FormKey từ list (ưu tiên dùng thay vì formId) */
  formKey?: string;
  /** ShopId từ list */
  shopId?: number;
  /** Callback sau khi submit thành công - trả về resultId và formKey để update list */
  onSubmitSuccess?: (resultId: number, formKey: string) => void;
  /** Callback khi submit thất bại */
  onSubmitError?: (message: string) => void;
  /** View mode - chỉ xem, không submit */
  mode?: 'fill' | 'view';
  /** Dữ liệu trực tiếp (khi mode='view') */
  dataInput?: import('./types/sform.types').SFormData;
  /** Custom camera handler - inject từ parent app nếu đã có camera */
  onCameraCapture?: (questionId: number, callback: (imageUri: string) => void) => void;
  /** Image: Pick from gallery handler */
  onPickImageFromGallery?: (questionId: number, callback: (imageUri: string) => void) => void;
  /** Image: Capture from camera handler */
  onCaptureImageFromCamera?: (questionId: number, callback: (imageUri: string) => void) => void;
  /** Audio: Record audio handler */
  onRecordAudio?: (questionId: number, callback: (audioUri: string) => void) => void;
  /** Audio: Pick audio file from document handler */
  onPickAudioFromFiles?: (questionId: number, callback: (audioUri: string) => void) => void;
  /** Base path for files directory (e.g., from ReactNativeFS.DocumentDirectoryPath) */
  filesBasePath?: string;
  /** DVHC 2025 data (Province → Ward directly, no District) */
  dvhc2025?: Province2025[];
  /** Display mode: 'all' (hiện tất cả) hoặc 'step' (từng câu một) */
  displayMode?: 'all' | 'step';
  /** Callback để lấy token mới nhất trước khi submit (tránh token hết hạn) */
  onGetLatestToken?: () => string | Promise<string>;
  /**
   * Khoá form (ưu tiên giá trị từ API `locked`/`Locked`).
   * Nếu > 0 → không cho làm: ẩn nút Gửi, nút "Bắt đầu khảo sát" đổi thành "Xem lại".
   * Có thể truyền từ item của SFormList (item.locked).
   */
  locked?: number | boolean | null;
  /** Banner dự phòng (vd: item.banner từ SFormList) nếu API chi tiết không trả banner */
  fallbackBanner?: string | null;
  style?: ViewStyle;
}

// ============================================================
// Main Component
// ============================================================

export function SFormResult({
  formId,
  apiConfig,
  formKey,
  shopId,
  onSubmitSuccess,
  onSubmitError,
  mode = 'fill',
  dataInput,
  onCameraCapture,
  onPickImageFromGallery,
  onCaptureImageFromCamera,
  onRecordAudio,
  onPickAudioFromFiles,
  filesBasePath,
  dvhc2025,
  displayMode = 'all',
  onGetLatestToken,
  locked,
  fallbackBanner,
  style,
}: SFormResultProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showIntro, setShowIntro] = React.useState(mode === 'fill'); // Show intro for fill mode
  const [startTime, setStartTime] = React.useState<Date | null>(null);

  // Ưu tiên dùng formKey nếu có, ko thì dùng formId
  const queryKey = formKey || formId;

  // Đồng bộ apiConfig.baseUrl vào bannerUtils
  if (apiConfig?.baseUrl) {
    setDefaultBaseUrl(apiConfig.baseUrl);
  }

  // Lấy metadata được cache từ SFormList (nếu có)
  const cachedItem =
    getCachedFormItem(queryKey) ||
    getCachedFormItem(formKey) ||
    getCachedFormItem(formId);

  // Banner dự phòng: ưu tiên fallbackBanner từ props, nếu không thì lấy từ cachedItem
  const effectiveFallbackBanner = fallbackBanner || cachedItem?.banner || null;

  const {
    state,
    setLoading,
    setExpired,
    setSended,
    setIsSubmitting,
    initForm,
    updateFormData,
    setShops,
    setSelectedEmployee,
    setSelectedShop,
    addCameraImage,
    deleteCameraImage,
    deleteUploadedImage,
    setDataDistrict,
    setDataTown,
  } = useSFormState();

  // Base URL: ưu tiên webUrl từ formData -> apiConfig.baseUrl -> getDefaultBaseUrl()
  const resolvedBaseUrl =
    (state.formData?.webUrl && state.formData.webUrl.trim()) ||
    apiConfig?.baseUrl ||
    getDefaultBaseUrl() ||
    undefined;

  // ---- Locked: > 0 → không cho làm, chỉ xem lại ----
  const isLocked = React.useMemo(() => {
    const fd = state.formData as (typeof state.formData & Record<string, unknown>) | null;
    const candidates = [
      locked, // from props
      fd?.Locked,
      fd?.locked,
      fd?.isLocked,
      fd?.IsLocked,
      fd?.isLock,
      fd?.IsLock,
      fd?.lock,
      fd?.Lock,
      cachedItem?.locked,
      cachedItem?.Locked,
      (cachedItem as any)?.isLocked,
      (cachedItem as any)?.IsLocked,
      (cachedItem as any)?.lock,
      (cachedItem as any)?.Lock,
    ];

    for (const c of candidates) {
      if (c === true) return true;
      if (typeof c === 'number' && c > 0) return true;
      if (typeof c === 'string') {
        const lower = c.trim().toLowerCase();
        if (lower === 'true' || lower === 'yes' || lower === 'locked') return true;
        const n = Number(lower);
        if (!isNaN(n) && n > 0) return true;
      }
    }
    return false;
  }, [state.formData, locked, cachedItem]);

  // ---- Done: > 0 → đã làm rồi ----
  const isDone = React.useMemo(() => {
    const fd = state.formData as (typeof state.formData & Record<string, unknown>) | null;
    const candidates = [
      fd?.Done,
      fd?.done,
      (fd as any)?.isDone,
      (fd as any)?.IsDone,
      cachedItem?.done,
      (cachedItem as any)?.Done,
      (cachedItem as any)?.isDone,
      (cachedItem as any)?.IsDone,
    ];

    for (const c of candidates) {
      if (c === true) return true;
      if (typeof c === 'number' && c > 0) return true;
      if (typeof c === 'string') {
        const lower = c.trim().toLowerCase();
        if (lower === 'true' || lower === 'yes' || lower === 'done') return true;
        const n = Number(lower);
        if (!isNaN(n) && n > 0) return true;
      }
    }
    return false;
  }, [state.formData, cachedItem]);

  // ---- Handlers (handleOnChange) ----
  const { handleOnChange: rawHandleOnChange } = useSFormHandlers({
    formData: state.formData,
    checkList: state.checkList,
    onUpdate: updateFormData,
    onSetDistrict: setDataDistrict,
    onSetTown: setDataTown,
  });

  // Chặn mọi thay đổi khi form bị khoá
  const handleOnChange = useCallback(
    (...args: Parameters<typeof rawHandleOnChange>) => {
      if (isLocked) return;
      rawHandleOnChange(...args);
    },
    [isLocked, rawHandleOnChange]
  );

  // ---- Error toast (dùng Alert trên RN) ----
  const showError = useCallback((msg: string) => {
    Alert.alert('Thông báo lỗi', msg);
    onSubmitError?.(msg);
  }, [onSubmitError]);

  const showSuccess = useCallback((msg: string) => {
    Alert.alert('Thành công', msg);
  }, []);

  // ---- Validation ----
  const { validate } = useSFormValidation({
    formData: state.formData,
    checkList: state.checkList,
    selectedEmployee: state.selectedEmployee,
    selectedShop: state.selectedShop,
    imageQuestion: state.imageQuestion,
    onError: showError,
    shopId,
  });

  // ============================================================
  // componentDidMount - Load form data
  // ============================================================
  useEffect(() => {
    if (mode === 'view' && dataInput) {
      const questions: Question[] = JSON.parse(dataInput.formData);
      const checkList = questions.map((q) => ({
        questionId: q.questionId,
        isShow: true,
        isEnd: q.isEnd,
      }));
      updateFormData(dataInput, checkList);
      setLoading(false);
      return;
    }

    // Fill mode: load từ API
    apiGetFormById(apiConfig, queryKey, shopId || 0)
      .then((result) => {
        console.log('SFormResult - GetById result:', result);

        // Check if API returned error data (id=0 means error)
        if (result.id === 0) {
          showError(result.title || 'Không thể tải form');
          setLoading(false);
          return;
        }

        // Kiểm tra form hết hạn
        if (result.toDate !== null) {
          const today = parseInt(moment(new Date()).format('YYYYMMDD'), 10);
          if (result.toDate < today) {
            setExpired();
            return;
          }
        }

        // API không trả về employees trong response này
        // Employees list sẽ là empty array
        const employees: Employee[] = [];

        initForm(result, employees, []);

        // Load shops: chỉ load khi KHÔNG có shopId từ props và form có cấu hình useshop / usedStores
        const hasPropShopId = typeof shopId === 'number' && shopId > 0;
        const isUseShop = Boolean(result.usedStores ?? (result as any).useshop ?? (result as any).useShop);
        if (!hasPropShopId && isUseShop) {
          const empId = result.createBy && result.createBy > 0 ? result.createBy : 0;
          apiGetShops(apiConfig, {
            accountId: result.accountId,
            employeeId: empId,
          })
            .then((shops) => setShops(shops))
            .catch(() => { /* ignore */ });
        }
      })
      .catch((err) => {
        console.error('SFormResult - Load form error:', err);
        const errorMsg = err?.message || 'Không thể tải form. Vui lòng thử lại.';
        showError(errorMsg);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  // ============================================================
  // Auto-select shop nếu shopId được truyền từ list
  // ============================================================
  useEffect(() => {
    if (shopId && state.shops.length > 0 && !state.selectedShop) {
      const shop = state.shops.find((s) => s.shopId === shopId);
      if (shop) {
        setSelectedShop(shop);
      }
    }
  }, [shopId, state.shops, state.selectedShop, setSelectedShop]);

  // ============================================================
  // handleOnChangeEmployee
  // ============================================================
  const handleSelectEmployee = useCallback(
    (employee: Employee) => {
      setSelectedEmployee(employee);
      const hasPropShopId = typeof shopId === 'number' && shopId > 0;
      const isUseShop = Boolean(state.formData?.usedStores ?? (state.formData as any)?.useshop ?? (state.formData as any)?.useShop);
      if (!hasPropShopId && isUseShop && employee.Id > 0 && state.formData) {
        apiGetShops(apiConfig, {
          accountId: state.formData.accountId,
          employeeId: employee.Id,
        })
          .then((shops) => setShops(shops))
          .catch(() => { /* ignore */ });
      }
    },
    [apiConfig, setSelectedEmployee, setShops, state.formData, shopId]
  );

  // ============================================================
  // Helper: Normalize Upload URL
  // Fix URL thiếu dấu / giữa uploaded và thư mục ngày
  // Từ: https://xxx.com/uploaded20260417/file.jpg
  // Thành: https://xxx.com/uploaded/20260417/file.jpg
  // ============================================================
  const normalizeUploadUrl = useCallback((url: string): string => {
    // Pattern: /uploadedYYYYMMDD/ → /uploaded/YYYYMMDD/
    const match = url.match(/\/uploaded(\d{8})\//);
    if (match) {
      const fixed = url.replace(/\/uploaded(\d{8})\//, '/uploaded/$1/');
      if (fixed !== url) {
        console.log('[URL Fix]', url, '→', fixed);
      }
      return fixed;
    }
    return url;
  }, []);

  // ============================================================
  // Upload Images
  // ============================================================
  const handleUploadImages = useCallback(
    async (
      files: Array<{ uri: string; name: string; type: string }>,
      question: Question
    ) => {
      if (files.length === 0) return;
      try {
        const results = await apiUploadImages(apiConfig, files);
        const urls = results
          .filter((r) => r.message === 'Successful')
          .map((r) => normalizeUploadUrl(r.fileUrl));
        if (urls.length > 0) {
          handleOnChange(question, JSON.stringify(urls));
        }
      } catch {
        showError('Upload ảnh thất bại. Vui lòng thử lại.');
      }
    },
    [apiConfig, handleOnChange, showError, normalizeUploadUrl]
  );

  // ============================================================
  // Upload Audio
  // ============================================================
  const handleUploadAudio = useCallback(
    async (
      files: Array<{ uri: string; name: string; type: string }>,
      question: Question
    ) => {
      if (files.length === 0) return;
      try {
        const results = await apiUploadAudio(apiConfig, files);
        const urls = results
          .filter((r) => r.message === 'Successful')
          .map((r) => normalizeUploadUrl(r.fileUrl));
        if (urls.length > 0) {
          handleOnChange(question, JSON.stringify(urls));
        }
      } catch {
        showError('Upload audio thất bại. Vui lòng thử lại.');
      }
    },
    [apiConfig, handleOnChange, showError, normalizeUploadUrl]
  );

  // ============================================================
  // Camera - Inject từ parent hoặc fallback
  // ============================================================
  const handleCapture = useCallback(
    (question: Question) => {
      if (onCameraCapture) {
        // Dùng camera handler từ parent app (đã có sẵn camera)
        onCameraCapture(question.questionId, (imageUri: string) => {
          addCameraImage(question.questionId, imageUri);
        });
      } else {
        // Fallback: hướng dẫn setup camera
        Alert.alert(
          'Camera chưa được cấu hình',
          'Vui lòng truyền prop "onCameraCapture" vào component SFormResult để sử dụng camera có sẵn trong app của bạn.\n\nVí dụ:\n<SFormResult\n  onCameraCapture={(qId, callback) => {\n    // Dùng camera của bạn\n    launchCamera({...}, (res) => {\n      callback(res.uri);\n    });\n  }}\n/>'
        );
      }
    },
    [addCameraImage, onCameraCapture]
  );

  // ============================================================
  // Image Handlers - Gallery & Camera
  // ============================================================
  const handlePickImageFromGallery = useCallback(
    (question: Question) => {
      if (onPickImageFromGallery) {
        onPickImageFromGallery(question.questionId, (imageUri: string) => {
          console.log(`[handlePickImageFromGallery] Received new image: "${imageUri}"`);
          const normalizedUri = normalizeUploadUrl(imageUri);
          handleOnChange(question, JSON.stringify([normalizedUri]));
        });
      }
    },
    [onPickImageFromGallery, handleOnChange, normalizeUploadUrl]
  );

  const handleCaptureImageFromCamera = useCallback(
    (question: Question) => {
      if (onCaptureImageFromCamera) {
        onCaptureImageFromCamera(question.questionId, (imageUri: string) => {
          console.log(`[handleCaptureImageFromCamera] Received new image: "${imageUri}"`);
          const normalizedUri = normalizeUploadUrl(imageUri);
          handleOnChange(question, JSON.stringify([normalizedUri]));
        });
      }
    },
    [onCaptureImageFromCamera, handleOnChange, normalizeUploadUrl]
  );

  // ============================================================
  // Audio Handlers - Record & File Picker
  // ============================================================
  const handleRecordAudio = useCallback(
    (question: Question) => {
      if (onRecordAudio) {
        onRecordAudio(question.questionId, (audioUri: string) => {
          console.log(`[handleRecordAudio] Received new audio: "${audioUri}"`);
          const normalizedUri = normalizeUploadUrl(audioUri);
          handleOnChange(question, JSON.stringify([normalizedUri]));
        });
      }
    },
    [onRecordAudio, handleOnChange, normalizeUploadUrl]
  );

  const handlePickAudioFromFiles = useCallback(
    (question: Question) => {
      if (onPickAudioFromFiles) {
        onPickAudioFromFiles(question.questionId, (audioUri: string) => {
          console.log(`[handlePickAudioFromFiles] Received new audio: "${audioUri}"`);
          const normalizedUri = normalizeUploadUrl(audioUri);
          handleOnChange(question, JSON.stringify([normalizedUri]));
        });
      }
    },
    [onPickAudioFromFiles, handleOnChange, normalizeUploadUrl]
  );

  // ============================================================
  // handleOnSubmit
  // ============================================================
  const handleSubmit = useCallback(async () => {
    if (!state.formData) return;
    if (isLocked) {
      Alert.alert('Thông báo', 'Khảo sát đã bị khoá, không thể gửi.');
      return;
    }

    const { isValid, payload } = validate();
    if (!isValid || !payload) return;

    setIsSubmitting(true);
    try {
      // Get latest token before submitting (avoid token expiration)
      let currentApiConfig = apiConfig;
      if (onGetLatestToken) {
        const latestToken = await onGetLatestToken();
        console.log('[Submit] Refreshed token before submit');
        currentApiConfig = {
          ...apiConfig,
          token: latestToken,
        };
      }

      const response = await apiInsertResult(currentApiConfig, payload);
      console.log('Submit response:', JSON.stringify(response, null, 2));

      if (response.statusId === 200) {
        // Success - data có thể null, dùng formData.id làm resultId
        const resultId = state.formData?.id || 0;
        setSended(resultId);
        showSuccess(response.messager);
        onSubmitSuccess?.(resultId, queryKey);
      } else {
        console.log('Submit failed - statusId:', response.statusId);
        showError(response.messager || 'Gửi thất bại');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    apiConfig,
    isLocked,
    onGetLatestToken,
    onSubmitSuccess,
    queryKey,
    setIsSubmitting,
    setSended,
    showError,
    showSuccess,
    state.formData,
    validate,
  ]);

  // ============================================================
  // Parse questions + filter visible (must be before early returns to satisfy hooks rules)
  // ============================================================
  const { visibleQuestions, questionsToDisplay, isStepMode, totalSteps, isFirstStep, isLastStep } = React.useMemo(() => {
    let questions: Question[] = [];
    try {
      if (state.formData?.formData) {
        questions = JSON.parse(state.formData.formData);
      }
    } catch { /* ignore */ }

    // Tìm questionEnd (câu isEnd đầu tiên đang hiện)
    let questionEndId = 9999;
    for (const cl of state.checkList) {
      if (cl.isEnd && cl.isShow) {
        questionEndId = cl.questionId;
        break;
      }
    }

    const visible = questions.filter((q) => {
      const cl = state.checkList.find((c) => c.questionId === q.questionId);
      if (!cl?.isShow) return false;
      if (q.questionId > questionEndId) return false;
      if (q.anwserItem.length === 0) return false;
      return true;
    });

    const isStep = displayMode === 'step';
    const display = isStep ? [visible[currentStep]].filter(Boolean) : visible;
    const total = visible.length;
    const isFirst = currentStep === 0;
    const isLast = currentStep === total - 1;

    return {
      visibleQuestions: visible,
      questionsToDisplay: display,
      isStepMode: isStep,
      totalSteps: total,
      isFirstStep: isFirst,
      isLastStep: isLast,
    };
  }, [state.formData, state.checkList, displayMode, currentStep]);

  // Validate current question before allowing next
  const canGoNext = React.useMemo(() => {
    if (!isStepMode) return true;
    if (isLocked) return true; // Xem lại: cho chuyển câu tự do
    const currentQ = visibleQuestions[currentStep];
    if (!currentQ || !currentQ.required) return true;

    const ansType = currentQ.anwserItem[0]?.anwserType;

    // Check based on answer type
    switch (ansType) {
      case 1: // Text
      case 2: // Textarea
      case 12: // Dropdown
        return !!currentQ.anwserItem[0]?.anwserValue;

      case 13: // MultiSelect
        try {
          const multiValue = currentQ.anwserItem[0]?.anwserValue;
          if (!multiValue) return false;
          const arr = JSON.parse(multiValue);
          return Array.isArray(arr) && arr.length > 0;
        } catch {
          return false;
        }

      case 3: // Number
        const numValue = currentQ.anwserItem[0]?.anwserValue;
        return numValue !== null && numValue !== undefined && numValue !== '';

      case 4: // Checkbox
      case 5: // Radio
        const hasChecked = currentQ.anwserItem.some((a) => String(a.anwserValue) === 'true');
        if (!hasChecked) return false;

        // If "Other" option (id=99) is selected, must have ortherValue
        const otherAnswer = currentQ.anwserItem.find((a) => a.id === 99 && String(a.anwserValue) === 'true');
        if (otherAnswer) {
          return !!otherAnswer.ortherValue && otherAnswer.ortherValue.trim() !== '';
        }

        return true;

      case 6: // Date
        return !!currentQ.anwserItem[0]?.anwserValue;

      case 7: // Image upload
        try {
          const uploadedStr = currentQ.anwserItem[0]?.anwserValue;
          if (!uploadedStr) return false;
          const uploaded = JSON.parse(uploadedStr);
          return Array.isArray(uploaded) && uploaded.length > 0;
        } catch {
          return false;
        }

      case 8: // Camera
        // Check both uploaded images and pending camera images
        const cameraImgs = state.imageQuestion.filter((img) => img.questionId === currentQ.questionId);
        if (cameraImgs.length > 0) return true;

        try {
          const uploadedStr = currentQ.anwserItem[0]?.anwserValue;
          if (!uploadedStr) return false;
          const uploaded = JSON.parse(uploadedStr);
          return Array.isArray(uploaded) && uploaded.length > 0;
        } catch {
          return false;
        }

      case 10: // Grid
        try {
          const grid = JSON.parse(currentQ.anwserItem[0]?.anwserValue || '[]');
          return grid.some((row: any) =>
            row.rowValue?.some((col: any) => col.colValue !== '' && col.colValue !== false)
          );
        } catch {
          return false;
        }

      case 16: // Audio
        try {
          const audioStr = currentQ.anwserItem[0]?.anwserValue;
          if (!audioStr) return false;
          const audioArray = JSON.parse(audioStr);
          return Array.isArray(audioArray) && audioArray.length > 0;
        } catch {
          return false;
        }

      default:
        return true;
    }
  }, [isStepMode, isLocked, currentStep, visibleQuestions, state.imageQuestion]);

  const handleNext = React.useCallback(() => {
    if (!isLastStep && canGoNext) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, canGoNext, totalSteps]);

  const handlePrevious = React.useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  }, [isFirstStep]);

  // ============================================================
  // Render states (after all hooks)
  // ============================================================
  if (state.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Đang tải form...</Text>
      </View>
    );
  }

  if (state.expired) {
    return <FormExpired />;
  }

  if (state.sended) {
    return <FormSuccess />;
  }

  if (!state.formData) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Không tìm thấy form.</Text>
      </View>
    );
  }

  // ============================================================
  // Show Intro Screen (before starting the survey)
  // ============================================================
  if (showIntro && mode === 'fill') {
    return (
      <FormIntro
        title={state.formData.title}
        subTitle={state.formData.subTitle}
        banner={state.formData.banner}
        fallbackBanner={effectiveFallbackBanner}
        baseUrl={resolvedBaseUrl}
        fromDate={state.formData.fromDate}
        toDate={state.formData.toDate}
        fromTime={state.formData.fromTime}
        toTime={state.formData.toTime}
        locked={isLocked}
        isDone={isDone}
        onStart={() => {
          setShowIntro(false);
          // Xem lại thì không cần đếm giờ
          if (!isLocked && !isDone) setStartTime(new Date());
        }}
      />
    );
  }

  // ============================================================
  // Render Form
  // ============================================================
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Timer - only show after started and in fill mode */}
        {startTime && mode === 'fill' && !isLocked && (
          <View style={styles.timerContainer}>
            <FormTimer startTime={startTime} />
          </View>
        )}

        {/* Lock notice */}
        {isLocked && mode === 'fill' && (
          <View style={styles.lockedBar}>
            <Text style={styles.lockedBarText}>🔒 Khảo sát đã bị khoá - chỉ xem lại</Text>
          </View>
        )}

        {/* Show banner and title only in 'all' mode, not in step mode */}
        {displayMode === 'all' && (
          <>
            <FormBanner
              banner={state.formData.banner}
              fallbackBanner={effectiveFallbackBanner}
              baseUrl={resolvedBaseUrl}
            />
            <FormTitle formData={state.formData} />
          </>
        )}

        <FormUserInfo
          formData={state.formData}
          employees={state.employees}
          shops={state.shops}
          selectedEmployee={state.selectedEmployee}
          selectedShop={state.selectedShop}
          onSelectEmployee={handleSelectEmployee}
          onSelectShop={setSelectedShop}
          hasPropShopId={typeof shopId === 'number' && shopId > 0}
          readOnly={isLocked}
        />

        {questionsToDisplay.map((question) => {
          const clItem = state.checkList.find(
            (c) => c.questionId === question.questionId
          );
          return (
            <QuestionItem
              key={question.questionId}
              question={question}
              checkItem={clItem}
              provinces={provinceData}
              districts={state.dataDistrict}
              towns={state.dataTown}
              cameraImages={state.imageQuestion}
              onCapture={handleCapture}
              onDeleteCameraImage={deleteCameraImage}
              onDeleteUploadedImage={deleteUploadedImage}
              onUploadImages={handleUploadImages}
              onUploadAudio={handleUploadAudio}
              onPickImageFromGallery={handlePickImageFromGallery}
              onCaptureImageFromCamera={handleCaptureImageFromCamera}
              onRecordAudio={handleRecordAudio}
              onPickAudioFromFiles={handlePickAudioFromFiles}
              filesBasePath={filesBasePath}
              dvhc2025={dvhc2025}
              baseUrl={resolvedBaseUrl}
              readOnly={isLocked}
              onChange={(q, v, ans) => handleOnChange(q, v, ans as AnswerItem | undefined)}
            />
          );
        })}

        {/* Bottom padding để không bị footer che */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Footer - Step mode hoặc Submit button */}
      {mode !== 'view' && (
        isStepMode ? (
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            canGoNext={canGoNext}
            isSubmitting={state.isSubmitting}
            readOnly={isLocked}
          />
        ) : isLocked ? null : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, state.isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={state.isSubmitting}
              activeOpacity={0.8}
            >
              {state.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitIcon}>☁</Text>
                  <Text style={styles.submitText}>Gửi</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedBar: {
    backgroundColor: '#FDECEA',
    borderLeftWidth: 4,
    borderLeftColor: '#EA4335',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  lockedBarText: { color: '#C5221F', fontWeight: '600', fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#5F6368', fontWeight: '500' },
  emptyText: { fontSize: 16, color: '#5F6368' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DADCE0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 32,
    minWidth: 180,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
