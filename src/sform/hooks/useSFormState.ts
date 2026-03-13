import { useState, useCallback } from 'react';
import type {
  SFormData,
  SFormState,
  CheckListItem,
  Employee,
  Shop,
  Question,
} from '../types/sform.types';

// ============================================================
// useSFormState - Quản lý toàn bộ state của form
// ============================================================

const INITIAL_STATE: SFormState = {
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
  isSubmitting: false,
};

export function useSFormState() {
  const [state, setState] = useState<SFormState>(INITIAL_STATE);

  // ---- Setters nhỏ để các hook khác gọi ----

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setExpired = useCallback(() => {
    setState((prev) => ({ ...prev, expired: true, loading: false }));
  }, []);

  const setSended = useCallback((resultId: number) => {
    setState((prev) => ({ ...prev, sended: true, resultId }));
  }, []);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  }, []);

  /**
   * Khởi tạo formData và checkList sau khi load từ API
   */
  const initForm = useCallback(
    (raw: SFormData, employees: Employee[], shops: Shop[]) => {
      const questions: Question[] = JSON.parse(raw.formData);
      const checkList: CheckListItem[] = questions.map((q) => ({
        questionId: q.questionId,
        isShow: true,
        isEnd: q.isEnd,
      }));
      setState((prev) => ({
        ...prev,
        formData: raw,
        checkList,
        employees,
        shops,
        loading: false,
      }));
    },
    []
  );

  /**
   * Cập nhật toàn bộ formData + checkList sau mỗi handleOnChange
   */
  const updateFormData = useCallback(
    (nextFormData: SFormData, nextCheckList: CheckListItem[]) => {
      setState((prev) => ({
        ...prev,
        formData: nextFormData,
        checkList: nextCheckList,
      }));
    },
    []
  );

  const setShops = useCallback((shops: Shop[]) => {
    setState((prev) => ({ ...prev, shops }));
  }, []);

  const setSelectedEmployee = useCallback((employee: Employee | null) => {
    setState((prev) => ({
      ...prev,
      selectedEmployee: employee,
      selectedShop: null,  // reset shop khi đổi NV
    }));
  }, []);

  const setSelectedShop = useCallback((shop: Shop | null) => {
    setState((prev) => ({ ...prev, selectedShop: shop }));
  }, []);

  const addCameraImage = useCallback(
    (questionId: number, imageData: string) => {
      setState((prev) => {
        const images = [...prev.imageQuestion];
        images.push({ index: images.length + 1, questionId, imageData });
        return { ...prev, imageQuestion: images };
      });
    },
    []
  );

  const deleteCameraImage = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      imageQuestion: prev.imageQuestion.filter((img) => img.index !== index),
    }));
  }, []);

  /**
   * Xoá ảnh đã upload (trong formData.formData JSON)
   */
  const deleteUploadedImage = useCallback(
    (questionId: number, imageUrl: string) => {
      setState((prev) => {
        if (!prev.formData) return prev;
        const raw = { ...prev.formData };
        const questions: Question[] = JSON.parse(raw.formData);
        const idx = questions.findIndex((q) => q.questionId === questionId);
        if (idx === -1) return prev;
        const current = questions[idx].anwserItem[0].anwserValue;
        try {
          const arr: string[] = JSON.parse(current);
          questions[idx].anwserItem[0].anwserValue = JSON.stringify(
            arr.filter((url) => url !== imageUrl)
          );
        } catch {
          // ignore
        }
        raw.formData = JSON.stringify(questions);
        return { ...prev, formData: raw };
      });
    },
    []
  );

  const setDataDistrict = useCallback(
    (dataDistrict: import('../types/sform.types').District[]) => {
      setState((prev) => ({ ...prev, dataDistrict, dataTown: [] }));
    },
    []
  );

  const setDataTown = useCallback(
    (dataTown: import('../types/sform.types').Town[]) => {
      setState((prev) => ({ ...prev, dataTown }));
    },
    []
  );

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
    setDataTown,
  };
}
