interface WindowSize {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}
interface UseWindowSizeOptions {
    debounceMs?: number;
    mobileBreakpoint?: number;
    tabletBreakpoint?: number;
}
export declare function useWindowSize({ debounceMs, mobileBreakpoint, tabletBreakpoint }?: UseWindowSizeOptions): WindowSize;
export declare const BREAKPOINTS: {
    readonly MOBILE: 640;
    readonly TABLET: 1024;
    readonly DESKTOP: 1280;
    readonly WIDE: 1536;
};
export declare function useMediaQuery(query: string): boolean;
export declare function useIsMobile(): boolean;
export declare function useIsTablet(): boolean;
export declare function useIsDesktop(): boolean;
export {};
