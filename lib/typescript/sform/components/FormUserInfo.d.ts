import React from 'react';
import type { SFormData, Employee, Shop } from '../types/sform.types';
interface Props {
    formData: SFormData;
    employees: Employee[];
    shops: Shop[];
    selectedEmployee: Employee | null;
    selectedShop: Shop | null;
    onSelectEmployee: (emp: Employee) => void;
    onSelectShop: (shop: Shop) => void;
}
export declare function FormUserInfo({ formData, employees, shops, selectedEmployee, selectedShop, onSelectEmployee, onSelectShop, }: Props): React.JSX.Element | null;
export {};
//# sourceMappingURL=FormUserInfo.d.ts.map