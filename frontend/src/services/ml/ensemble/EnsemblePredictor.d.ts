interface EnsembleConfig {
    models: {
        name: string;
        type: string;
        weight: number;
        hyperparameters?: Record<string, any>;
        features: string[];
        target: string;
    }[];
    metaLearner?: {
        type: string;
        hyperparameters?: Record<string, any>;
        features: string[];
        target: string;
    };
    marketIntelligence?: {
        enabled: boolean;
        weight: number;
        features: string[];
    };
    temporalPatterns?: {
        enabled: boolean;
        weight: number;
        features: string[];
    };
    alternativeData?: {
        enabled: boolean;
        weight: number;
        features: string[];
    };
    gameTheory?: {
        enabled: boolean;
        weight: number;
        features: string[];
    };
    quantumProbability?: {
        enabled: boolean;
        weight: number;
        features: string[];
    };
    stackedGeneralization?: {
        enabled: boolean;
        metaModelType: string;
        crossValidationFolds: number;
        hyperparameters?: Record<string, any>;
    };
    bayesianInference?: {
        enabled: boolean;
        priorStrength: number;
        mcmcSamples: number;
        hyperparameters?: Record<string, any>;
    };
}
interface ModelBreakdown {
    modelName: string;
    probability: number;
    confidence: number;
    weight: number;
    factors?: string[];
}
interface FeatureAttribution {
    feature: string;
    value: number;
    impact: number;
}
interface EnsemblePrediction {
    probability: number;
    confidence: number;
    modelBreakdown: ModelBreakdown[];
    factors: string[];
    historicalAccuracy: number;
    expectedValue: number;
    riskLevel: number;
    recommendedStake: number;
    edge: number;
    uncertainty?: {
        variance: number;
        credibleInterval: [number, number];
    };
    featureAttribution?: FeatureAttribution[];
    marketIntelligence?: {
        sharpAction: number;
        bookmakerVulnerability: number;
        goblinTrapAnalysis: number;
    };
    temporalPatterns?: {
        microTrends: number;
        macroTrends: number;
        cyclicalPatterns: number;
        circadianFactors: number;
    };
    alternativeData?: {
        socialMediaSentiment: number;
        weatherImpact: number;
        injuryImpact: number;
        travelImpact: number;
        venueImpact: number;
    };
    gameTheory?: {
        strategicAdvantage: number;
        psychologicalEdge: number;
        momentumFactor: number;
        pressureHandling: number;
        adaptationScore: number;
    };
    quantumProbability?: {
        superpositionScore: number;
        entanglementFactor: number;
        interferencePattern: number;
        tunnelingProbability: number;
        decoherenceRate: number;
    };
}
export declare class EnsemblePredictor {
    private models;
    private marketIntelligence?;
    private temporalPatterns?;
    private alternativeData?;
    private gameTheory?;
    private quantumProbability?;
    private historicalPredictions;
    private config;
    constructor(config: EnsembleConfig);
    private initializeModels;
    predict(features: Record<string, any>): Promise<EnsemblePrediction>;
    private getAdvancedPredictions;
    private calculateWeightedPrediction;
    private calculateMarketIntelligenceScore;
    private calculateTemporalPatternsScore;
    private calculateAlternativeDataScore;
    private calculateGameTheoryScore;
    private calculateQuantumProbabilityScore;
    private calculateConfidenceAndRisk;
    private calculateHistoricalAccuracy;
    private calculateExpectedValueAndEdge;
    private calculateRecommendedStake;
    private generateFactors;
    update(newData: any[]): Promise<void>;
    evaluate(testData: any[]): Promise<Record<string, number>>;
    private calculateMSE;
    private calculateMAE;
    private calculateMAPE;
    private getBayesianPrediction;
    private performMCMCSampling;
    private calculateLikelihood;
    private computeFeatureAttribution;
    private shuffleValue;
    private predictSingle;
    /**
     * Update ensemble configuration at runtime (e.g., weights, enabled models, meta-learning, risk profile)
     */
    updateConfig(newConfig: Partial<EnsembleConfig>): void;
    /**
     * Update model weights at runtime
     */
    updateModelWeights(weights: {
        [modelName: string]: number;
    }): void;
    /**
     * Update risk profile parameters at runtime
     */
    updateRiskProfile(riskParams: {
        [key: string]: any;
    }): void;
    /**
     * Enable or disable meta-learning (stacked generalization) at runtime
     */
    setMetaLearning(enabled: boolean, metaModelType?: string): void;
    /**
     * Enable or disable Bayesian inference at runtime
     */
    setBayesianInference(enabled: boolean, priorStrength?: number, mcmcSamples?: number): void;
    private getMetaModel;
}
export {};
