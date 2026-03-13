import React from 'react';
interface FormIntroProps {
    title: string;
    subTitle: string;
    banner: string | null;
    fromDate: number | null;
    toDate: number | null;
    fromTime: string | null;
    toTime: string | null;
    onStart: () => void;
}
export declare function FormIntro({ title, subTitle, banner, fromDate, toDate, fromTime, toTime, onStart, }: FormIntroProps): React.JSX.Element;
export {};
//# sourceMappingURL=FormIntro.d.ts.map