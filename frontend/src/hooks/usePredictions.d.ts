export interface PredictionModelOutput {
    confidenceScore: number;
    confidenceColor: 'success' | 'warning' | 'danger';
    topFeatures: Array<{
        name: string;
        value: number;
        impact: number;
    }>;
    modelMeta: {
        type: string;
        version: string;
        lastUpdated: number;
    };
}
export interface PredictionState {
    predictions: Array<{
        id: string;
        event: string;
        market: string;
        selection: string;
        modelOutput: PredictionModelOutput;
        timestamp: number;
    }>;
    loading: boolean;
    error: string | null;
}
export declare const usePredictions: () => {
    loadPredictions: () => Promise<void>;
    getPredictionById: (id: string) => {
        id: string;
        event: string;
        market: string;
        selection: string;
        modelOutput: PredictionModelOutput;
        timestamp: number;
    } | undefined;
    getRecentPredictions: (limit?: number) => {
        id: string;
        event: string;
        market: string;
        selection: string;
        modelOutput: PredictionModelOutput;
        timestamp: number;
    }[];
    predictions: Array<{
        id: string;
        event: string;
        market: string;
        selection: string;
        modelOutput: PredictionModelOutput;
        timestamp: number;
    }>;
    loading: boolean;
    error: string | null;
};
