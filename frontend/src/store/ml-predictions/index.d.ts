import { ModelOutput, PredictionState } from '../../types/prediction';
interface MLPredictionsState extends PredictionState {
    setPredictions: (predictions: Map<string, ModelOutput>) => void;
    addPrediction: (id: string, prediction: ModelOutput) => void;
    removePrediction: (id: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}
export declare const useMLPredictionsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<MLPredictionsState>, "setState" | "devtools"> & {
    setState(partial: MLPredictionsState | Partial<MLPredictionsState> | ((state: MLPredictionsState) => MLPredictionsState | Partial<MLPredictionsState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: MLPredictionsState | ((state: MLPredictionsState) => MLPredictionsState), replace: true, action?: (string | {
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
