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