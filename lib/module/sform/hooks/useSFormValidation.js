import { useCallback } from 'react';

// ============================================================
// useSFormValidation - Mirror logic validation từ handleOnSubmit web
// ============================================================

function parseDateToNum(d) {
  return parseInt(d.replace(/-/g, ''), 10);
}
export function useSFormValidation({
  formData,
  checkList,
  selectedEmployee,
  selectedShop,
  imageQuestion,
  onError
}) {
  const validate = useCallback(() => {
    if (!formData) return {
      isValid: false,
      enrichedFormData: null
    };
    const questions = JSON.parse(formData.formData);
    let isCheck = true;
    let questionEnd = 99999;
    for (const question of questions) {
      const noAnswer = question.anwserItem.filter(a => a.id < 100).length;
      let count = 0;
      let check = false;
      const required = question.required;
      for (const answers of question.anwserItem) {
        const clItem = checkList.find(c => c.questionId === question.questionId);
        if (answers.id < 100 && clItem?.isShow && required && question.questionId <= questionEnd) {
          switch (answers.anwserType) {
            case 3:
              {
                // Number
                const min = parseFloat(question.min ?? '');
                const max = parseFloat(question.max ?? '');
                if (!answers.anwserValue) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                const numVal = parseFloat(answers.anwserValue);
                if (!isNaN(numVal) && !isNaN(min) && !isNaN(max)) {
                  if (numVal > max || numVal < min) {
                    onError(`${question.questionName}: phải thuộc khoảng ${min} đến ${max}`);
                    isCheck = false;
                    return {
                      isValid: false,
                      enrichedFormData: null
                    };
                  }
                }
                if (isNaN(max) && !isNaN(min) && numVal < min) {
                  onError(`${question.questionName}: nhập thấp nhất là ${min}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                break;
              }
            case 4: // Checkbox
            case 5:
              // Radio
              if (answers.anwserValue === 'true' || answers.anwserValue === true) {
                if (answers.id === 99 && !answers.ortherValue) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                } else {
                  check = true;
                }
              } else {
                count++;
                if (noAnswer === count && !check) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
              }
              break;
            case 6:
              {
                // Date
                const hasRange = question.min && question.max && answers.anwserValue;
                if (hasRange) {
                  const minD = parseDateToNum(question.min);
                  const maxD = parseDateToNum(question.max);
                  const ansD = parseDateToNum(answers.anwserValue);
                  if (ansD > maxD || ansD < minD) {
                    onError(`${question.questionName}: phải thuộc khoảng ${question.min} đến ${question.max}`);
                    isCheck = false;
                    return {
                      isValid: false,
                      enrichedFormData: null
                    };
                  }
                }
                if (!answers.anwserValue) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                break;
              }
            case 7: // Image
            case 8:
              {
                // Camera
                // Gộp ảnh từ camera nếu có
                const camImages = imageQuestion.filter(img => img.questionId === question.questionId);
                // NOTE: camera answers được xử lý riêng trong submit, không update formData ở đây
                if ((answers.anwserValue === '' || answers.anwserValue === '[]') && camImages.length === 0) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                if (question.min && Number(question.min) > 0) {
                  let total = 0;
                  try {
                    total = JSON.parse(answers.anwserValue).length;
                  } catch {/* ignore */}
                  total += camImages.length;
                  if (total < Number(question.min)) {
                    onError(`Câu hỏi: ${question.questionName}. Yêu cầu số lượng hình tối thiểu là: ${question.min}`);
                    isCheck = false;
                    return {
                      isValid: false,
                      enrichedFormData: null
                    };
                  }
                }
                break;
              }
            case 10:
              {
                // Grid
                let gridValue = [];
                try {
                  gridValue = JSON.parse(question.anwserItem[0].anwserValue);
                } catch {
                  break;
                }
                let totalFilled = 0;
                gridValue.forEach(row => row.rowValue.forEach(col => {
                  if (col.colValue === true || col.colValue !== '') totalFilled++;
                }));
                if (totalFilled === 0) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                break;
              }
            case 12:
              {
                // Dropdown - check value is in options
                try {
                  const options = JSON.parse(question.anwserItem[0].anwserName);
                  const val = JSON.parse(question.anwserItem[0].anwserValue);
                  const valName = typeof val === 'object' ? val?.name : val;
                  if (!options.includes(valName)) {
                    onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                    isCheck = false;
                    return {
                      isValid: false,
                      enrichedFormData: null
                    };
                  }
                } catch {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                break;
              }
            default:
              {
                if (!answers.anwserValue) {
                  onError(`Chưa trả lời câu hỏi: ${question.questionName}`);
                  isCheck = false;
                  return {
                    isValid: false,
                    enrichedFormData: null
                  };
                }
                break;
              }
          }
        } else {
          // Không bắt buộc nhưng vẫn validate range nếu có giá trị
          if (answers.anwserType === 3 && question.min && question.max && answers.anwserValue) {
            const min = parseFloat(question.min);
            const max = parseFloat(question.max);
            const val = parseFloat(answers.anwserValue);
            if (!isNaN(val)) {
              if (val > max || val < min) {
                onError(`${question.questionName}: phải thuộc khoảng ${min} đến ${max}`);
                return {
                  isValid: false,
                  enrichedFormData: null
                };
              }
            }
          }
          if (answers.anwserType === 6 && question.min && question.max && answers.anwserValue) {
            const minD = parseDateToNum(question.min);
            const maxD = parseDateToNum(question.max);
            const ansD = parseDateToNum(answers.anwserValue);
            if (ansD > maxD || ansD < minD) {
              onError(`${question.questionName}: phải thuộc khoảng ${question.min} đến ${question.max}`);
              return {
                isValid: false,
                enrichedFormData: null
              };
            }
          }
        }
      }
    }

    // ---- Kiểm tra Employee ----
    if (formData.usedEmployees) {
      if (!selectedEmployee || selectedEmployee.Id <= 0) {
        onError('Bạn chưa chọn nhân viên');
        return {
          isValid: false,
          enrichedFormData: null
        };
      }
    }

    // ---- Kiểm tra Shop ----
    if (formData.usedStores) {
      if (!selectedShop || selectedShop.shopId <= 0) {
        onError('Bạn chưa chọn cửa hàng');
        return {
          isValid: false,
          enrichedFormData: null
        };
      }
    }

    // ---- Build enriched payload ----
    const enriched = {
      ...formData,
      formData: JSON.stringify(questions)
    };
    if (formData.usedEmployees && selectedEmployee) {
      enriched.employeeId = selectedEmployee.Id;
    }
    if (formData.usedStores && selectedShop) {
      enriched.shopId = selectedShop.shopId;
    }
    return {
      isValid: isCheck,
      enrichedFormData: enriched
    };
  }, [formData, checkList, selectedEmployee, selectedShop, imageQuestion, onError]);
  return {
    validate
  };
}
//# sourceMappingURL=useSFormValidation.js.map