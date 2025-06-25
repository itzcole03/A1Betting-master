/**
 * Service for comparing model predictions and performance.
 */
import type { ModelEvaluation } from './ModelEvaluationService';
import type { ModelComparisonResult } from '@/types';
export interface ModelPredictionInput {
    name: string;
    prediction: number;
    confidence: number;
    performance?: ModelEvaluation;
}
export interface ComparisonRequest {
    predictions: ModelPredictionInput[];
    timestamp: string;
    metadata?: Record<string, unknown>;
}
export interface ComparisonError extends Error {
    code: string;
    details?: Record<string, unknown>;
    timestamp: string;
}
export type ComparisonResponse = {
    success: true;
    data: ModelComparisonResult;
} | {
    success: false;
    error: ComparisonError;
};
export declare class ModelComparisonService {
    private comparisons;
    compareModels(request: ComparisonRequest): Promise<ComparisonResponse>;
    private calculateModelAgreement;
    private calculateConsensusConfidence;
    getComparisonHistory(timestamp: string): Promise<ModelComparisonResult[]>;
    getLatestComparison(): Promise<ModelComparisonResult | null>;
}
