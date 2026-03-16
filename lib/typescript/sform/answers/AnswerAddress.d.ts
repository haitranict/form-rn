import React from 'react';
import type { Question, AnswerItem, Province, District, Town, Province2025 } from '../types/sform.types';
interface Props {
    question: Question;
    provinces: Province[];
    districts: District[];
    towns: Town[];
    onChange: (question: Question, value: unknown, answerItem: AnswerItem) => void;
    /** DVHC 2025 data - if provided, will use this instead of provinces/districts/towns */
    dvhc2025?: Province2025[];
}
export declare function AnswerAddress({ question, provinces, districts, towns, onChange, dvhc2025 }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerAddress.d.ts.map