import React from 'react';
import type { Question, AnswerItem, Province, District, Town } from '../types/sform.types';
interface Props {
    question: Question;
    provinces: Province[];
    districts: District[];
    towns: Town[];
    onChange: (question: Question, value: unknown, answerItem: AnswerItem) => void;
}
export declare function AnswerAddress({ question, provinces, districts, towns, onChange }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=AnswerAddress.d.ts.map