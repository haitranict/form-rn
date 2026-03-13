import { createContext, useContext } from 'react';
export const FormContext = /*#__PURE__*/createContext(null);
export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used inside a <Form> component');
  }
  return ctx;
}
//# sourceMappingURL=FormContext.js.map