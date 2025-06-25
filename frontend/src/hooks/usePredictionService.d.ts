import { Prediction, RiskProfile } from '../types/core';
export declare const usePredictionService: () => {
    getPredictions: (riskProfile: RiskProfile) => Promise<Prediction[]>;
    subscribeToUpdates: (onUpdate: (prediction: Prediction) => void, onError: (error: Error) => void) => () => void;
};
