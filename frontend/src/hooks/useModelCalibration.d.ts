interface CalibrationPoint {
    prob_pred: number;
    prob_true: number;
    count: number;
}
interface ModelCalibration {
    model: string;
    calibration_curve: CalibrationPoint[];
    brier_score: number;
    timestamp: string;
}
export declare const useModelCalibration: () => {
    calibration: ModelCalibration[];
    loading: boolean;
    error: string | null;
    fetchCalibration: () => Promise<void>;
    getLatestCalibration: () => ModelCalibration | null;
    getCalibrationHistory: (model: string) => ModelCalibration[];
    getCalibrationTrend: (model: string) => {
        timestamp: string;
        brier_score: number;
    }[];
    getCalibrationError: (model: string) => number | null;
    getCalibrationReliability: (model: string) => number | null;
};
export {};
