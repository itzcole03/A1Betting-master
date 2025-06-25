export declare const usePredictionService: () => {
    generateEnsemblePrediction: (request: import("./predictionService").PredictionRequest) => Promise<import("./predictionService").PredictionResponse>;
    getPredictionHistory: () => Promise<import("./predictionService").GeneralInsight[]>;
    getModelPerformance: undefined;
};
