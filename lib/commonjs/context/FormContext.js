"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormContext = void 0;
exports.useFormContext = useFormContext;
var _react = require("react");
const FormContext = exports.FormContext = /*#__PURE__*/(0, _react.createContext)(null);
function useFormContext() {
  const ctx = (0, _react.useContext)(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used inside a <Form> component');
  }
  return ctx;
}
//# sourceMappingURL=FormContext.js.map