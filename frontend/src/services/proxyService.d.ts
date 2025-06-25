/**
 * Fetches data from a third-party API via your backend proxy.
 * @param targetUrl The actual URL of the third-party API.
 * @param params Optional query parameters for the target URL.
 * @param options Optional request options (e.g., headers for the proxy to forward).
 */
export declare const fetchViaProxy: <T>(targetUrl: string, params?: Record<string, any>, options?: RequestInit) => Promise<T>;
export declare const proxyService: {
    fetchViaProxy: <T>(targetUrl: string, params?: Record<string, any>, options?: RequestInit) => Promise<T>;
};
