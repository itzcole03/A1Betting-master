export interface PredictionInput {
    features: Record<string, number>;
    timestamp: number;
    source: string;
    context?: Record<string, any>;
}
export interface PredictionOutput {
    predictionId: string;
    propId: string;
    predictedValue: number;
    confidence: number;
    timestamp: number;
    factors: Array<{
        name: string;
        weight: number;
        impact: number;
    }>;
    uncertaintyBounds?: {
        lower: number;
        upper: number;
    };
    metadata?: {
        processingTime?: number;
        dataFreshness?: number;
        signalQuality?: number;
        modelVersion?: string;
    };
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metrics: {
        confidence: number;
        dataFreshness: number;
        signalQuality: number;
    };
    context?: Record<string, any>;
}
export interface ValidationRule {
    name: string;
    priority: number;
    validate: (input: PredictionInput, output: PredictionOutput) => ValidationRuleResult;
    cacheKey?: (input: PredictionInput, output: PredictionOutput) => string;
}
export interface ValidationRuleResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    context?: Record<string, any>;
}
export declare class PredictionValidator {
    private static instance;
    private readonly eventBus;
    private validationHistory;
    private readonly MAX_HISTORY_SIZE;
    private readonly MIN_CONFIDENCE;
    private readonly MIN_DATA_FRESHNESS;
    private readonly MIN_SIGNAL_QUALITY;
    private validationRules;
    private validationCache;
    private readonly CACHE_TTL;
    private constructor();
    static getInstance(): PredictionValidator;
    private initializeDefaultRules;
    addValidationRule(rule: ValidationRule): void;
    removeValidationRule(ruleName: string): void;
    validatePrediction(input: PredictionInput, output: PredictionOutput): ValidationResult;
    private validateTimestamp;
    private validateFactors;
    private validateUncertaintyBounds;
    private recordValidation;
    getValidationStats(): {
        totalValidations: number;
        validPredictions: number;
        invalidPredictions: number;
        validationRate: number;
        averageConfidence: number;
        averageDataFreshness: number;
        averageSignalQuality: number;
        ruleStats: Record<string, {
            total: number;
            passed: number;
            failed: number;
        }>;
    };
}
export declare const predictionValidator: PredictionValidator;
