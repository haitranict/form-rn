import type { SFormData, SFormState, CheckListItem, Employee, Shop } from '../types/sform.types';
export declare function useSFormState(): {
    state: SFormState;
    setLoading: (loading: boolean) => void;
    setExpired: () => void;
    setSended: (resultId: number) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    initForm: (raw: SFormData, employees: Employee[], shops: Shop[]) => void;
    updateFormData: (nextFormData: SFormData, nextCheckList: CheckListItem[]) => void;
    setShops: (shops: Shop[]) => void;
    setSelectedEmployee: (employee: Employee | null) => void;
    setSelectedShop: (shop: Shop | null) => void;
    addCameraImage: (questionId: number, imageData: string) => void;
    deleteCameraImage: (index: number) => void;
    deleteUploadedImage: (questionId: number, imageUrl: string) => void;
    setDataDistrict: (dataDistrict: import("../types/sform.types").District[]) => void;
    setDataTown: (dataTown: import("../types/sform.types").Town[]) => void;
};
//# sourceMappingURL=useSFormState.d.ts.map