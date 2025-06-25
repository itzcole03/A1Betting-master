export declare const formatDate: (date: string | Date, format?: string) => string;
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const formatPercentage: (value: number, decimals?: number) => string;
export declare const formatOdds: (odds: number) => string;
export declare const formatDateTime: (date: string | Date) => string;
export interface ToastNotification {
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
}
