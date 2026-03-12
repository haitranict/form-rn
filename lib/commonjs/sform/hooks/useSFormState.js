"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSFormState = useSFormState;
var _react = require("react");
// ============================================================
// useSFormState - Quản lý toàn bộ state của form
// ============================================================

const INITIAL_STATE = {
  formData: null,
  checkList: [],
  employees: [],
  shops: [],
  selectedEmployee: null,
  selectedShop: null,
  imageQuestion: [],
  dataDistrict: [],
  dataTown: [],
  sended: false,
  resultId: 0,
  loading: true,
  expired: false,
  isSubmitting: false
};
function useSFormState() {
  const [state, setState] = (0, _react.useState)(INITIAL_STATE);

  // ---- Setters nhỏ để các hook khác gọi ----

  const setLoading = (0, _react.useCallback)(loading => {
    setState(prev => ({
      ...prev,
      loading
    }));
  }, []);
  const setExpired = (0, _react.useCallback)(() => {
    setState(prev => ({
      ...prev,
      expired: true,
      loading: false
    }));
  }, []);
  const setSended = (0, _react.useCallback)(resultId => {
    setState(prev => ({
      ...prev,
      sended: true,
      resultId
    }));
  }, []);
  const setIsSubmitting = (0, _react.useCallback)(isSubmitting => {
    setState(prev => ({
      ...prev,
      isSubmitting
    }));
  }, []);

  /**
   * Khởi tạo formData và checkList sau khi load từ API
   */
  const initForm = (0, _react.useCallback)((raw, employees, shops) => {
    const questions = JSON.parse(raw.formData);
    const checkList = questions.map(q => ({
      questionId: q.questionId,
      isShow: true,
      isEnd: q.isEnd
    }));
    setState(prev => ({
      ...prev,
      formData: raw,
      checkList,
      employees,
      shops,
      loading: false
    }));
  }, []);

  /**
   * Cập nhật toàn bộ formData + checkList sau mỗi handleOnChange
   */
  const updateFormData = (0, _react.useCallback)((nextFormData, nextCheckList) => {
    setState(prev => ({
      ...prev,
      formData: nextFormData,
      checkList: nextCheckList
    }));
  }, []);
  const setShops = (0, _react.useCallback)(shops => {
    setState(prev => ({
      ...prev,
      shops
    }));
  }, []);
  const setSelectedEmployee = (0, _react.useCallback)(employee => {
    setState(prev => ({
      ...prev,
      selectedEmployee: employee,
      selectedShop: null // reset shop khi đổi NV
    }));
  }, []);
  const setSelectedShop = (0, _react.useCallback)(shop => {
    setState(prev => ({
      ...prev,
      selectedShop: shop
    }));
  }, []);
  const addCameraImage = (0, _react.useCallback)((questionId, imageData) => {
    setState(prev => {
      const images = [...prev.imageQuestion];
      images.push({
        index: images.length + 1,
        questionId,
        imageData
      });
      return {
        ...prev,
        imageQuestion: images
      };
    });
  }, []);
  const deleteCameraImage = (0, _react.useCallback)(index => {
    setState(prev => ({
      ...prev,
      imageQuestion: prev.imageQuestion.filter(img => img.index !== index)
    }));
  }, []);

  /**
   * Xoá ảnh đã upload (trong formData.formData JSON)
   */
  const deleteUploadedImage = (0, _react.useCallback)((questionId, imageUrl) => {
    setState(prev => {
      if (!prev.formData) return prev;
      const raw = {
        ...prev.formData
      };
      const questions = JSON.parse(raw.formData);
      const idx = questions.findIndex(q => q.questionId === questionId);
      if (idx === -1) return prev;
      const current = questions[idx].anwserItem[0].anwserValue;
      try {
        const arr = JSON.parse(current);
        questions[idx].anwserItem[0].anwserValue = JSON.stringify(arr.filter(url => url !== imageUrl));
      } catch {
        // ignore
      }
      raw.formData = JSON.stringify(questions);
      return {
        ...prev,
        formData: raw
      };
    });
  }, []);
  const setDataDistrict = (0, _react.useCallback)(dataDistrict => {
    setState(prev => ({
      ...prev,
      dataDistrict,
      dataTown: []
    }));
  }, []);
  const setDataTown = (0, _react.useCallback)(dataTown => {
    setState(prev => ({
      ...prev,
      dataTown
    }));
  }, []);
  return {
    state,
    // setters
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
  };
}
//# sourceMappingURL=useSFormState.js.map