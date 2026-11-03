import React from 'react';
interface Props {
    banner: string | null | undefined;
    /** Banner dự phòng (vd: từ item trong SFormList) */
    fallbackBanner?: string | null;
    /** Base URL để ghép với đường dẫn ảnh tương đối */
    baseUrl?: string | null;
}
export declare function FormBanner({ banner, fallbackBanner, baseUrl }: Props): React.JSX.Element | null;
export {};
//# sourceMappingURL=FormBanner.d.ts.map