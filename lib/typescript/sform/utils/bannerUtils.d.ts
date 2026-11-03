/** Thiết lập base URL mặc định (lấy từ apiConfig.baseUrl của ứng dụng) */
export declare function setDefaultBaseUrl(url?: string | null): void;
/** Lấy base URL mặc định đã được cấu hình */
export declare function getDefaultBaseUrl(): string;
export interface ParsedBanner {
    url: string | null;
    height: number | null;
}
/**
 * Parse banner từ API → { url, height }
 */
export declare function parseBanner(banner: unknown, baseUrl?: string | null): ParsedBanner;
/** Shortcut chỉ lấy URL */
export declare function getBannerImageUrl(banner: unknown, baseUrl?: string | null): string | null;
//# sourceMappingURL=bannerUtils.d.ts.map