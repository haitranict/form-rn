import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import moment from 'moment';
import { useSFormState } from './hooks/useSFormState';
import { useSFormHandlers } from './hooks/useSFormHandlers';
import { useSFormValidation } from './hooks/useSFormValidation';
import { apiGetFormById, apiGetShops, apiInsertResult, apiUploadImages, apiUploadAudio } from './hooks/useSFormApi';
import { QuestionItem } from './components/QuestionItem';
import { FormBanner } from './components/FormBanner';
import { FormTitle } from './components/FormTitle';
import { FormUserInfo } from './components/FormUserInfo';
import { FormExpired } from './components/FormExpired';
import { FormSuccess } from './components/FormSuccess';
import { StepNavigation } from './components/StepNavigation';

// Địa phương (tỉnh/huyện/xã) - cần file dvhcvn.json trong project
// import dvhcvn from '../../asset/filedata/dvhcvn.json';
// const provinceData = dvhcvn?.data || [];
// Placeholder - thay bằng import thực tế
const provinceData = [];

// ============================================================
// Props
// ============================================================

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
  displayMode = 'all',
  style
}) {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Ưu tiên dùng formKey nếu có, ko thì dùng formId
  const queryKey = formKey || formId;
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
    setDataTown
  } = useSFormState();

  // ---- Handlers (handleOnChange) ----
  const {
    handleOnChange
  } = useSFormHandlers({
    formData: state.formData,
    checkList: state.checkList,
    onUpdate: updateFormData,
    onSetDistrict: setDataDistrict,
    onSetTown: setDataTown
  });

  // ---- Error toast (dùng Alert trên RN) ----
  const showError = useCallback(msg => {
    Alert.alert('Thông báo lỗi', msg);
    onSubmitError?.(msg);
  }, [onSubmitError]);
  const showSuccess = useCallback(msg => {
    Alert.alert('Thành công', msg);
  }, []);

  // ---- Validation ----
  const {
    validate
  } = useSFormValidation({
    formData: state.formData,
    checkList: state.checkList,
    selectedEmployee: state.selectedEmployee,
    selectedShop: state.selectedShop,
    imageQuestion: state.imageQuestion,
    onError: showError
  });

  // ============================================================
  // componentDidMount - Load form data
  // ============================================================
  useEffect(() => {
    if (mode === 'view' && dataInput) {
      const questions = JSON.parse(dataInput.formData);
      const checkList = questions.map(q => ({
        questionId: q.questionId,
        isShow: true,
        isEnd: q.isEnd
      }));
      updateFormData(dataInput, checkList);
      setLoading(false);
      return;
    }

    // Fill mode: load từ API
    apiGetFormById(apiConfig, queryKey).then(result => {
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

      // Parse employees
      let employees = [];
      try {
        employees = JSON.parse(result.employees);
      } catch {/* ignore */}
      initForm(result, employees, []);

      // Load shops nếu cần
      if (result.usedStores) {
        const empId = result.createBy > 0 ? result.createBy : 0;
        apiGetShops(apiConfig, {
          accountId: result.accountId,
          employeeId: empId
        }).then(shops => setShops(shops)).catch(() => {/* ignore */});
      }
    }).catch(err => {
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
      const shop = state.shops.find(s => s.shopId === shopId);
      if (shop) {
        setSelectedShop(shop);
      }
    }
  }, [shopId, state.shops, state.selectedShop, setSelectedShop]);

  // ============================================================
  // handleOnChangeEmployee
  // ============================================================
  const handleSelectEmployee = useCallback(employee => {
    setSelectedEmployee(employee);
    if (employee.Id > 0 && state.formData) {
      apiGetShops(apiConfig, {
        accountId: state.formData.accountId,
        employeeId: employee.Id
      }).then(shops => setShops(shops)).catch(() => {/* ignore */});
    }
  }, [apiConfig, setSelectedEmployee, setShops, state.formData]);

  // ============================================================
  // Upload Images
  // ============================================================
  const handleUploadImages = useCallback(async (files, question) => {
    if (files.length === 0) return;
    try {
      const results = await apiUploadImages(apiConfig, files);
      const urls = results.filter(r => r.message === 'Successful').map(r => r.fileUrl);
      if (urls.length > 0) {
        handleOnChange(question, JSON.stringify(urls));
      }
    } catch {
      showError('Upload ảnh thất bại. Vui lòng thử lại.');
    }
  }, [apiConfig, handleOnChange, showError]);

  // ============================================================
  // Upload Audio
  // ============================================================
  const handleUploadAudio = useCallback(async (files, question) => {
    if (files.length === 0) return;
    try {
      const results = await apiUploadAudio(apiConfig, files);
      const urls = results.filter(r => r.message === 'Successful').map(r => r.fileUrl);
      if (urls.length > 0) {
        handleOnChange(question, JSON.stringify(urls));
      }
    } catch {
      showError('Upload audio thất bại. Vui lòng thử lại.');
    }
  }, [apiConfig, handleOnChange, showError]);

  // ============================================================
  // Camera - Inject từ parent hoặc fallback
  // ============================================================
  const handleCapture = useCallback(question => {
    if (onCameraCapture) {
      // Dùng camera handler từ parent app (đã có sẵn camera)
      onCameraCapture(question.questionId, imageUri => {
        addCameraImage(question.questionId, imageUri);
      });
    } else {
      // Fallback: hướng dẫn setup camera
      Alert.alert('Camera chưa được cấu hình', 'Vui lòng truyền prop "onCameraCapture" vào component SFormResult để sử dụng camera có sẵn trong app của bạn.\n\nVí dụ:\n<SFormResult\n  onCameraCapture={(qId, callback) => {\n    // Dùng camera của bạn\n    launchCamera({...}, (res) => {\n      callback(res.uri);\n    });\n  }}\n/>');
    }
  }, [addCameraImage, onCameraCapture]);

  // ============================================================
  // handleOnSubmit
  // ============================================================
  const handleSubmit = useCallback(async () => {
    if (!state.formData) return;
    const {
      isValid,
      enrichedFormData
    } = validate();
    if (!isValid || !enrichedFormData) return;
    setIsSubmitting(true);
    try {
      const response = await apiInsertResult(apiConfig, {
        dataByDomain: queryKey,
        formData: enrichedFormData
      });
      if (response.result === 1) {
        const resultId = parseInt(response.error, 10);
        setSended(resultId);
        showSuccess(response.messenger);
        onSubmitSuccess?.(resultId);
      } else {
        showError(response.messenger || 'Gửi thất bại');
      }
    } catch {
      showError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [apiConfig, queryKey, onSubmitSuccess, setIsSubmitting, setSended, showError, showSuccess, state.formData, validate]);

  // ============================================================
  // Render states
  // ============================================================
  if (state.loading) {
    return /*#__PURE__*/React.createElement(View, {
      style: styles.center
    }, /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: "large",
      color: "#4285F4"
    }), /*#__PURE__*/React.createElement(Text, {
      style: styles.loadingText
    }, "\u0110ang t\u1EA3i form..."));
  }
  if (state.expired) {
    return /*#__PURE__*/React.createElement(FormExpired, null);
  }
  if (state.sended) {
    return /*#__PURE__*/React.createElement(FormSuccess, null);
  }
  if (!state.formData) {
    return /*#__PURE__*/React.createElement(View, {
      style: styles.center
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.emptyText
    }, "Kh\xF4ng t\xECm th\u1EA5y form."));
  }

  // ============================================================
  // Parse questions + filter visible
  // ============================================================
  let questions = [];
  try {
    questions = JSON.parse(state.formData.formData);
  } catch {/* ignore */}

  // Tìm questionEnd (câu isEnd đầu tiên đang hiện)
  let questionEndId = 9999;
  for (const cl of state.checkList) {
    if (cl.isEnd && cl.isShow) {
      questionEndId = cl.questionId;
      break;
    }
  }
  const visibleQuestions = questions.filter(q => {
    const cl = state.checkList.find(c => c.questionId === q.questionId);
    if (!cl?.isShow) return false;
    if (q.questionId > questionEndId) return false;
    if (q.anwserItem.length === 0) return false;
    return true;
  });

  // ============================================================
  // Step mode logic
  // ============================================================
  const questionsToDisplay = displayMode === 'step' ? [visibleQuestions[currentStep]].filter(Boolean) : visibleQuestions;
  const isStepMode = displayMode === 'step';
  const totalSteps = visibleQuestions.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Validate current question before allowing next
  const canGoNext = React.useMemo(() => {
    if (!isStepMode) return true;
    const currentQ = visibleQuestions[currentStep];
    if (!currentQ || !currentQ.required) return true;
    const ansType = currentQ.anwserItem[0]?.anwserType;

    // Check based on answer type
    switch (ansType) {
      case 1: // Text
      case 2: // Textarea
      case 12:
        // Dropdown
        return !!currentQ.anwserItem[0]?.anwserValue;
      case 3:
        // Number
        return !!currentQ.anwserItem[0]?.anwserValue;
      case 4: // Checkbox
      case 5:
        // Radio
        return currentQ.anwserItem.some(a => String(a.anwserValue) === 'true');
      case 6:
        // Date
        return !!currentQ.anwserItem[0]?.anwserValue;
      case 7: // Image
      case 8:
        // Camera
        const imgs = state.imageQuestion.filter(img => img.questionId === currentQ.questionId);
        try {
          const uploaded = JSON.parse(currentQ.anwserItem[0]?.anwserValue || '[]');
          return uploaded.length > 0 || imgs.length > 0;
        } catch {
          return imgs.length > 0;
        }
      case 10:
        // Grid
        try {
          const grid = JSON.parse(currentQ.anwserItem[0]?.anwserValue || '[]');
          return grid.some(row => row.rowValue?.some(col => col.colValue !== '' && col.colValue !== false));
        } catch {
          return false;
        }
      default:
        return true;
    }
  }, [isStepMode, currentStep, visibleQuestions, state.imageQuestion]);
  const handleNext = React.useCallback(() => {
    if (!isLastStep && canGoNext) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, canGoNext, totalSteps]);
  const handlePrevious = React.useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  }, [isFirstStep]);

  // ============================================================
  // Render Form
  // ============================================================
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, style]
  }, /*#__PURE__*/React.createElement(ScrollView, {
    style: styles.scroll,
    contentContainerStyle: styles.scrollContent,
    keyboardShouldPersistTaps: "handled"
  }, /*#__PURE__*/React.createElement(FormBanner, {
    banner: state.formData.banner
  }), /*#__PURE__*/React.createElement(FormTitle, {
    formData: state.formData
  }), /*#__PURE__*/React.createElement(FormUserInfo, {
    formData: state.formData,
    employees: state.employees,
    shops: state.shops,
    selectedEmployee: state.selectedEmployee,
    selectedShop: state.selectedShop,
    onSelectEmployee: handleSelectEmployee,
    onSelectShop: setSelectedShop
  }), questionsToDisplay.map(question => {
    const clItem = state.checkList.find(c => c.questionId === question.questionId);
    return /*#__PURE__*/React.createElement(QuestionItem, {
      key: question.questionId,
      question: question,
      checkItem: clItem,
      provinces: provinceData,
      districts: state.dataDistrict,
      towns: state.dataTown,
      cameraImages: state.imageQuestion,
      onCapture: handleCapture,
      onDeleteCameraImage: deleteCameraImage,
      onDeleteUploadedImage: deleteUploadedImage,
      onUploadImages: handleUploadImages,
      onUploadAudio: handleUploadAudio,
      onChange: (q, v, ans) => handleOnChange(q, v, ans)
    });
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      height: 80
    }
  })), mode !== 'view' && (isStepMode ? /*#__PURE__*/React.createElement(StepNavigation, {
    currentStep: currentStep,
    totalSteps: totalSteps,
    onPrevious: handlePrevious,
    onNext: handleNext,
    onSubmit: handleSubmit,
    isFirstStep: isFirstStep,
    isLastStep: isLastStep,
    canGoNext: canGoNext,
    isSubmitting: state.isSubmitting
  }) : /*#__PURE__*/React.createElement(View, {
    style: styles.footer
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.submitBtn, state.isSubmitting && styles.submitBtnDisabled],
    onPress: handleSubmit,
    disabled: state.isSubmitting,
    activeOpacity: 0.8
  }, state.isSubmitting ? /*#__PURE__*/React.createElement(ActivityIndicator, {
    color: "#fff"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.submitIcon
  }, "\u2601"), /*#__PURE__*/React.createElement(Text, {
    style: styles.submitText
  }, "G\u1EEDi"))))));
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5F6368',
    fontWeight: '500'
  },
  emptyText: {
    fontSize: 16,
    color: '#5F6368'
  },
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
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
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
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  submitBtnDisabled: {
    opacity: 0.5
  },
  submitIcon: {
    fontSize: 20,
    marginRight: 8
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});
//# sourceMappingURL=SFormResult.js.map