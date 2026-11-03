import React from 'react';
interface FormIntroProps {
    title: string;
    subTitle: string;
    banner: string | null;
    /** Banner dự phòng (vd: banner từ item trong SFormList) nếu banner chính rỗng/lỗi */
    fallbackBanner?: string | null;
    /** Base URL để ghép với đường dẫn ảnh tương đối */
    baseUrl?: string | null;
    fromDate: number | null;
    toDate: number | null;
    fromTime: string | null;
    toTime: string | null;
    /** Form bị khoá (Locked > 0) → chỉ cho xem lại */
    locked?: boolean;
    /** Form đã hoàn thành (done > 0) → nút hiển thị "Xem lại" */
    isDone?: boolean;
    onStart: () => void;
}
export declare function FormIntro({ title, subTitle, banner, fallbackBanner, baseUrl, fromDate, toDate, fromTime, toTime, locked, isDone, onStart, }: FormIntroProps): React.JSX.Element;
export {};
//# sourceMappingURL=FormIntro.d.ts.map