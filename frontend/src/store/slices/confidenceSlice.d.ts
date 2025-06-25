import type { ConfidenceBand, WinProbability, PredictionWithConfidence } from '../../types/confidence';
interface ConfidenceState {
    prediction: PredictionWithConfidence | null;
    setPrediction: (prediction: PredictionWithConfidence) => void;
    confidenceBand: ConfidenceBand | null;
    setConfidenceBand: (band: ConfidenceBand) => void;
    winProbability: WinProbability | null;
    setWinProbability: (prob: WinProbability) => void;
    clear: () => void;
}
export declare const useConfidenceStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ConfidenceState>>;
export {};
