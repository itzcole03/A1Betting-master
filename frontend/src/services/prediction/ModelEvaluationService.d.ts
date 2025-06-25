/**
 * Service for evaluating model performance and tracking metrics.
 */
export interface ModelEvaluation {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc?: number;
    confusionMatrix?: {
        truePositives: number;
        falsePositives: number;
        trueNegatives: number;
        falseNegatives: number;
    };
    metadata?: Record<string, unknown>;
}
export interface EvaluationResult {
    modelId: string;
    evaluation: ModelEvaluation;
    timestamp: string;
    metadata?: Record<string, unknown>;
}
export interface EvaluationRequest {
    modelId: string;
    startDate: string;
    endDate: string;
    metrics: Array<keyof ModelEvaluation>;
    metadata?: Record<string, unknown>;
}
export interface EvaluationError extends Error {
    code: string;
    details?: Record<string, unknown>;
    timestamp: string;
}
export type EvaluationResponse = {
    success: true;
    data: EvaluationResult;
} | {
    success: false;
    error: EvaluationError;
};
export declare class ModelEvaluationService {
    private evaluations;
    evaluateModel(request: EvaluationRequest): Promise<EvaluationResponse>;
    getModelEvaluations(modelId: string): Promise<EvaluationResult[]>;
    getLatestEvaluation(modelId: string): Promise<EvaluationResult | null>;
    getEvaluationTrends(modelId: string, metric: keyof ModelEvaluation): Promise<number[]>;
}
