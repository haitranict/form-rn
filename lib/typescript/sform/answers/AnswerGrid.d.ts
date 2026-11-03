import React from 'react';
import type { Question } from '../types/sform.types';
interface Props {
    question: Question;
    onChange: (question: Question, value: {
        cellId: string;
        cellValue: unknown;
    }) => void;
    /** Chỉ xem (form bị khoá) → không sửa được dữ liệu nhưng vẫn đổi cách hiển thị và cuộn xem được */
    readOnly?: boolean;
}
export declare function AnswerGrid({ question, onChange, readOnly }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerGrid.d.ts.map