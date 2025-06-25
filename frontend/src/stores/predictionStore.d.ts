interface PredictionData {
    confidence?: number;
    recommended_stake?: number;
    risk_level?: string;
    shap_values?: any;
    timestamp?: string;
    analytics?: any;
    [key: string]: any;
}
interface PredictionState {
    predictionsByEvent: Record<string, PredictionData>;
    updatePrediction: (eventId: string, data: PredictionData) => void;
    getPredictionForEvent: (eventId: string) => PredictionData | undefined;
    getLatestPredictions: () => PredictionData[];
}
export declare const usePredictionStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PredictionState>, "setState" | "devtools"> & {
    setState(partial: PredictionState | Partial<PredictionState> | ((state: PredictionState) => PredictionState | Partial<PredictionState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: PredictionState | ((state: PredictionState) => PredictionState), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}>;
export {};
