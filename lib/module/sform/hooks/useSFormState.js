import { useState, useCallback } from 'react';
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
export function useSFormState() {
  const [state, setState] = useState(INITIAL_STATE);

  // ---- Setters nhỏ để các hook khác gọi ----

  const setLoading = useCallback(loading => {
    setState(prev => ({
      ...prev,
      loading
    }));
  }, []);
  const setExpired = useCallback(() => {
    setState(prev => ({
      ...prev,
      expired: true,
      loading: false
    }));
  }, []);
  const setSended = useCallback(resultId => {
    setState(prev => ({
      ...prev,
      sended: true,
      resultId
    }));
  }, []);
  const setIsSubmitting = useCallback(isSubmitting => {
    setState(prev => ({
      ...prev,
      isSubmitting
    }));
  }, []);

  /**
   * Khởi tạo formData và checkList sau khi load từ API
   */
  const initForm = useCallback((raw, employees, shops) => {
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
  const updateFormData = useCallback((nextFormData, nextCheckList) => {
    setState(prev => ({
      ...prev,
      formData: nextFormData,
      checkList: nextCheckList
    }));
  }, []);
  const setShops = useCallback(shops => {
    setState(prev => ({
      ...prev,
      shops
    }));
  }, []);
  const setSelectedEmployee = useCallback(employee => {
    setState(prev => ({
      ...prev,
      selectedEmployee: employee,
      selectedShop: null // reset shop khi đổi NV
    }));
  }, []);
  const setSelectedShop = useCallback(shop => {
    setState(prev => ({
      ...prev,
      selectedShop: shop
    }));
  }, []);
  const addCameraImage = useCallback((questionId, imageData) => {
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
  const deleteCameraImage = useCallback(index => {
    setState(prev => ({
      ...prev,
      imageQuestion: prev.imageQuestion.filter(img => img.index !== index)
    }));
  }, []);

  /**
   * Xoá ảnh đã upload (trong formData.formData JSON)
   */
  const deleteUploadedImage = useCallback((questionId, imageUrl) => {
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
  const setDataDistrict = useCallback(dataDistrict => {
    setState(prev => ({
      ...prev,
      dataDistrict,
      dataTown: []
    }));
  }, []);
  const setDataTown = useCallback(dataTown => {
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