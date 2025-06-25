interface UseClipboardOptions {
    timeout?: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}
interface UseClipboardResult {
    copied: boolean;
    copy: (text: string) => Promise<void>;
    reset: () => void;
}
export declare function useClipboard({ timeout, onSuccess, onError }?: UseClipboardOptions): UseClipboardResult;
export {};
