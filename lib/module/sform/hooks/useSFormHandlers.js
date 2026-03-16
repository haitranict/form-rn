import { useCallback } from 'react';

// ============================================================
// useSFormHandlers - Mirror chính xác logic handleOnChange web
// ============================================================

/** Utility: show/hide các câu hỏi từ index trở đi */
function setShowFrom(checkList, fromQuestionId, isShow) {
  return checkList.map(item => item.questionId >= fromQuestionId ? {
    ...item,
    isShow
  } : item);
}

/** Utility: reset anwserValue của các câu hỏi bị ẩn */
function resetHiddenAnswers(questions, checkList) {
  return questions.map((q, idx) => {
    const cl = checkList.find(c => c.questionId === q.questionId);
    if (!cl || cl.isShow) return q;

    // Hidden → reset
    const updatedItems = q.anwserItem.map(ans => ({
      ...ans,
      anwserValue: ''
    }));
    if (q.questionType !== 0) {
      // Grid: reset rowValue
      try {
        const gridValue = JSON.parse(q.anwserItem[0].anwserValue);
        const reset = gridValue.map(row => ({
          ...row,
          rowValue: row.rowValue.map(col => ({
            ...col,
            colValue: ''
          }))
        }));
        updatedItems[0] = {
          ...updatedItems[0],
          anwserValue: JSON.stringify(reset)
        };
      } catch {
        // ignore malformed
      }
    }
    return {
      ...q,
      anwserItem: updatedItems
    };
  });
}

/** Utility: tìm questionEnd (câu hỏi isEnd đầu tiên đang hiển thị) */
function computeQuestionEnd(checkList) {
  for (const item of checkList) {
    if (item.isEnd && item.isShow) return item.questionId;
  }
  return 9999;
}

/** Ẩn tất cả câu hỏi sau questionEnd */
function applyQuestionEnd(checkList) {
  const questionEnd = computeQuestionEnd(checkList);
  if (questionEnd === 9999) return checkList;
  return checkList.map(item => item.questionId > questionEnd ? {
    ...item,
    isShow: false
  } : item);
}
export function useSFormHandlers({
  formData,
  checkList,
  onUpdate,
  onSetDistrict,
  onSetTown
}) {
  /**
   * handleOnChange - logic chính, mirror 1:1 từ web
   *
   * @param question   - câu hỏi đang thay đổi
   * @param value      - giá trị mới (đã được chuẩn hóa theo anwserType)
   * @param answerItem - chỉ dùng cho checkbox/radio "Khác" và address
   */
  const handleOnChange = useCallback((question, value, answerItem) => {
    if (!formData) return;
    try {
      let questions = JSON.parse(formData.formData);
      let cl = [...checkList];
      const qIdx = questions.findIndex(q => q.questionId === question.questionId);
      if (qIdx === -1) return;
      let q = {
        ...questions[qIdx],
        anwserItem: [...questions[qIdx].anwserItem]
      };
      const ansType = q.anwserItem[0].anwserType;

      // ---- Helper: show/hide từ questionId trở đi ----
      const hideFrom = fromId => {
        cl = cl.map(item => item.questionId >= fromId ? {
          ...item,
          isShow: false
        } : item);
      };
      const showFrom = fromId => {
        cl = cl.map(item => item.questionId >= fromId ? {
          ...item,
          isShow: true
        } : item);
      };
      const applyNextStep = nextStep => {
        if (nextStep === 9999) hideFrom(question.questionId);else showFrom(question.questionId);
      };
      switch (ansType) {
        // ---- 1: Text ----
        case 1:
        // ---- 2: Textarea ----
        case 2:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: String(value ?? '')
            };
            break;
          }

        // ---- 3: Number ----
        case 3:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            const numStr = String(value ?? '').replaceAll(',', '');
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: numStr
            };
            break;
          }

        // ---- 4: Checkbox (multi-choice) ----
        case 4:
          {
            if (answerItem) {
              // Đang nhập "Khác"
              const idx = q.anwserItem.findIndex(a => a.id === answerItem.id);
              if (idx !== -1) {
                q.anwserItem[idx] = {
                  ...q.anwserItem[idx],
                  ortherValue: answerItem.ortherValue || ''
                };
              }
            } else {
              // Toggle checkbox
              const toggled = value;
              const idx = q.anwserItem.findIndex(a => a.id === toggled.id);
              if (idx !== -1) {
                q.anwserItem[idx] = {
                  ...q.anwserItem[idx],
                  anwserValue: toggled.checked ? 'true' : '',
                  ortherValue: toggled.checked ? q.anwserItem[idx].ortherValue : ''
                };
              }
              // Tính goTo
              let goTo = question.questionId + 1;
              q.anwserItem.forEach(a => {
                if (a.anwserValue && a.nextStep > 0) goTo = a.nextStep;
              });
              if (question.questionId < cl.length) {
                cl = cl.map(item => {
                  if (item.questionId <= question.questionId) return item;
                  return {
                    ...item,
                    isShow: item.questionId >= goTo
                  };
                });
              }
            }
            break;
          }

        // ---- 5: Radio (single-choice) ----
        case 5:
          {
            if (answerItem) {
              // Đang nhập "Khác"
              const idx = q.anwserItem.findIndex(a => a.id === answerItem.id);
              if (idx !== -1) {
                q.anwserItem[idx] = {
                  ...q.anwserItem[idx],
                  ortherValue: answerItem.ortherValue || ''
                };
              }
            } else {
              // Chọn radio
              const selectedAns = value;
              let goTo = question.questionId + 1;
              let endQuestion = 0;
              q.anwserItem = q.anwserItem.map(a => {
                if (a.id === selectedAns.id) {
                  if (a.nextStep > 0 && a.nextStep < 9999) goTo = a.nextStep;
                  if (a.nextStep === 9999) endQuestion = question.questionId;
                  return {
                    ...a,
                    anwserValue: 'true'
                  };
                }
                return {
                  ...a,
                  anwserValue: ''
                };
              });
              if (question.questionId < cl.length) {
                cl = cl.map(item => {
                  if (item.questionId <= question.questionId) return item;
                  let isShow = item.questionId >= goTo;
                  if (endQuestion > 0 && item.questionId > endQuestion) isShow = false;
                  return {
                    ...item,
                    isShow
                  };
                });
              }

              // Special: form 17
              if (question.questionId === 1 && formData.id === 17) {
                q.anwserItem.forEach(a => {
                  if (a.anwserValue && a.anwserName === 'No') {
                    cl = cl.map(item => item.questionId >= 2 ? {
                      ...item,
                      isShow: false
                    } : item);
                  } else if (a.anwserValue && a.anwserName === 'Yes') {
                    cl = cl.map(item => item.questionId >= 2 ? {
                      ...item,
                      isShow: true
                    } : item);
                  }
                });
              }

              // Special: form 30
              if (question.questionId === 1 && formData.id === 30) {
                q.anwserItem.forEach(a => {
                  if (a.anwserValue && a.anwserName === 'A') {
                    cl = cl.map(item => item.questionId > 20 ? {
                      ...item,
                      isShow: false
                    } : item);
                  } else if (a.anwserValue && a.anwserName === 'B') {
                    cl = cl.map(item => item.questionId > 20 ? {
                      ...item,
                      isShow: true
                    } : item);
                  }
                });
              }
            }
            break;
          }

        // ---- 6: Date ----
        case 6:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            const dateVal = value;
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: dateVal ? dateVal.toISOString().slice(0, 10) : ''
            };
            break;
          }

        // ---- 7: Image, 8: Camera, 16: Audio ----
        case 7:
        case 8:
        case 16:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            const strValue = String(value ?? '');
            if (strValue === 'clear') {
              q.anwserItem[0] = {
                ...q.anwserItem[0],
                anwserValue: ''
              };
              break;
            }
            const max = q.max ? Number(q.max) : 0;
            const existing = q.anwserItem[0].anwserValue;
            let imageArr = [];
            try {
              const incoming = JSON.parse(strValue);
              let current = [];
              if (existing && existing !== '') {
                try {
                  current = JSON.parse(existing);
                } catch {/* ignore */}
              }
              console.log(`[useSFormHandlers case ${ansType}] Current: ${current.length} items, Incoming: ${incoming.length} items`);

              // Merge with duplicate detection
              incoming.forEach(url => {
                // Skip if already exists
                if (current.includes(url)) {
                  console.log(`[useSFormHandlers] Skipping duplicate: "${url}"`);
                  return;
                }
                // Check max limit
                if (max > 0 && current.length >= max) {
                  console.log(`[useSFormHandlers] Max limit (${max}) reached, skipping: "${url}"`);
                  return;
                }
                current.push(url);
                console.log(`[useSFormHandlers] Added: "${url}" (total: ${current.length})`);
              });
              console.log(`[useSFormHandlers case ${ansType}] Final array: ${current.length} items`);
              imageArr = current;
            } catch {
              imageArr = [];
            }
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: JSON.stringify(imageArr)
            };
            break;
          }

        // ---- 10: Grid ----
        case 10:
          {
            // value = { cellId: "rowId_colId", cellValue: string|boolean }
            const cell = value;
            const ids = cell.cellId.split('_');
            const rowId = parseInt(ids[0]);
            const colId = parseInt(ids[1]);
            let gridValue = [];
            try {
              gridValue = JSON.parse(q.anwserItem[0].anwserValue);
            } catch {
              break;
            }
            const rowIdx = gridValue.findIndex(r => r.rowId === rowId);
            if (rowIdx === -1) break;
            const colIdx = gridValue[rowIdx].rowValue.findIndex(c => c.colId === colId);
            if (colIdx === -1) break;
            const updatedGrid = gridValue.map((row, ri) => {
              if (ri !== rowIdx) return row;
              const updatedRow = row.rowValue.map((col, ci) => {
                if (question.questionType === 101) {
                  // Grid radio: only one true per row
                  return {
                    ...col,
                    colValue: col.colId === colId ? true : ''
                  };
                }
                if (ci !== colIdx) return col;
                if (question.questionType === 102) {
                  return {
                    ...col,
                    colValue: cell.cellValue ? true : ''
                  };
                }
                if (question.questionType === 104) {
                  return {
                    ...col,
                    colValue: String(cell.cellValue ?? '').replaceAll(',', '')
                  };
                }
                if (question.questionType === 105) {
                  const d = cell.cellValue;
                  return {
                    ...col,
                    colValue: d ? d.toISOString().slice(0, 10) : ''
                  };
                }
                return {
                  ...col,
                  colValue: cell.cellValue
                };
              });
              return {
                ...row,
                rowValue: updatedRow
              };
            });
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: JSON.stringify(updatedGrid)
            };
            break;
          }

        // ---- 11: Address ----
        case 11:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            if (!answerItem) break;
            const aIdx = q.anwserItem.findIndex(a => a.id === answerItem.id);
            if (aIdx === -1) break;
            if (answerItem.id === 1) {
              // Street address text
              q.anwserItem[aIdx] = {
                ...q.anwserItem[aIdx],
                anwserValue: String(value ?? '')
              };
            } else if (answerItem.id === 2) {
              // Province selected
              const province = value;
              onSetDistrict(province?.level2s ?? []);
              // Reset district + town
              q.anwserItem = q.anwserItem.map((a, i) => {
                if (a.id === 3 || a.id === 4) return {
                  ...a,
                  anwserValue: '',
                  selectedItem: null
                };
                if (i === aIdx) return {
                  ...a,
                  anwserValue: province?.name ?? '',
                  selectedItem: value
                };
                return a;
              });
            } else if (answerItem.id === 3) {
              // District selected
              const district = value;
              onSetTown(district?.level3s ?? []);
              q.anwserItem = q.anwserItem.map((a, i) => {
                if (a.id === 4) return {
                  ...a,
                  anwserValue: '',
                  selectedItem: null
                };
                if (i === aIdx) return {
                  ...a,
                  anwserValue: district?.name ?? '',
                  selectedItem: value
                };
                return a;
              });
            } else {
              // Town selected
              const town = value;
              q.anwserItem[aIdx] = {
                ...q.anwserItem[aIdx],
                anwserValue: town?.name ?? '',
                selectedItem: value
              };
            }
            break;
          }

        // ---- 12: Dropdown, 13: Multi-select ----
        case 12:
        case 13:
          {
            applyNextStep(q.anwserItem[0].nextStep);
            q.anwserItem[0] = {
              ...q.anwserItem[0],
              anwserValue: JSON.stringify(value)
            };
            break;
          }
        default:
          break;
      }
      questions[qIdx] = q;

      // Reset values của hidden questions
      questions = resetHiddenAnswers(questions, cl);

      // Apply questionEnd logic
      cl = applyQuestionEnd(cl);
      const nextFormData = {
        ...formData,
        formData: JSON.stringify(questions)
      };
      onUpdate(nextFormData, cl);
    } catch (err) {
      console.error('handleOnChange error:', err);
    }
  }, [formData, checkList, onUpdate, onSetDistrict, onSetTown]);
  return {
    handleOnChange
  };
}
//# sourceMappingURL=useSFormHandlers.js.map