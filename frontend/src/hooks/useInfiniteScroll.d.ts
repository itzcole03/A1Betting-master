interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
    root?: Element | null;
}
interface UseInfiniteScrollResult {
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    containerRef: React.RefObject<HTMLElement>;
}
export declare function useInfiniteScroll<T>(fetchMore: () => Promise<T[]>, options?: UseInfiniteScrollOptions): UseInfiniteScrollResult;
export {};
