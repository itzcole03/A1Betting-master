interface UseVirtualListOptions {
    itemHeight: number;
    overscan?: number;
    containerHeight?: number;
}
interface VirtualItem {
    index: number;
    start: number;
}
interface UseVirtualListResult<T> {
    virtualItems: VirtualItem[];
    totalHeight: number;
    containerRef: React.RefObject<HTMLDivElement>;
    scrollTo: (index: number) => void;
    visibleItems: T[];
}
export declare function useVirtualList<T>(items: T[], { itemHeight, overscan, containerHeight }: UseVirtualListOptions): UseVirtualListResult<T>;
export {};
