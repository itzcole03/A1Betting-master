import { PredictionUpdate } from '@/types';
export interface PredictionRequestData {
    features: Record<string, number>;
    modelId?: string;
    context?: Record<string, unknown>;
}
export interface PredictionServiceResponse extends PredictionUpdate {
}
export interface GeneralInsight {
    id: string;
    text: string;
    source: string;
    confidence?: number;
    type?: 'opportunity' | 'risk' | 'observation';
    relatedEntities?: Array<{
        id: string;
        type: string;
    }>;
}
export interface PredictionFeatureInput {
    features: {
        [key: string]: number;
    };
}
export interface PredictionRequest {
    propId?: string;
    modelId?: string;
    context?: Record<string, unknown>;
    prediction_input: PredictionFeatureInput;
}
export interface PredictionResponse {
    propId?: string;
    predictedOutcome: string | number;
    confidence?: number;
    modelUsed?: string;
    insights?: {
        confidence: number;
        feature_contributions: {
            [key: string]: number;
        };
        model_metrics: {
            [key: string]: number | number[][];
        };
        prediction_timestamp: string;
    };
}
declare class PredictionService {
    private baseUrl;
    constructor();
    predict(request: PredictionRequest): Promise<PredictionResponse>;
    getGeneralInsights(): Promise<GeneralInsight[]>;
    createPredictionRequest(features: {
        [key: string]: number;
    }, propId?: string, context?: Record<string, unknown>): PredictionRequest;
    getPrediction(requestData: PredictionRequestData): Promise<PredictionServiceResponse>;
    getPredictionDetails(predictionId: string): Promise<Record<string, unknown>>;
    fetchGeneralInsights(): Promise<GeneralInsight[]>;
}
export declare const predictionService: PredictionService;
/**
 * Fetches ML-based predictions for a given set of inputs.
 * Calls backend POST /api/v1/predictions/predict.
 * Frontend PredictionRequestData is sent.
 * Backend expects PredictionRequest (see backend/app/api/v1/endpoints/prediction.py):
 * {
 *   "propId": "string" (optional),
 *   "modelId": "string" (optional),
 *   "context": {} (optional),
 *   "prediction_input": {
 *      "features": { "feature1": value1, ... } // Must match FEATURE_ORDER in backend
 *   }
 * }
 * Backend returns PredictionResponse (see backend/app/api/v1/endpoints/prediction.py):
 * {
 *   "propId": "string" (optional),
 *   "predictedOutcome": any, // string or number
 *   "confidence": number (optional),
 *   "modelUsed": "string" (optional)
 * }
 * This is mapped to frontend PredictionServiceResponse.
 */
export declare const getPrediction: (requestData: PredictionRequestData) => Promise<PredictionServiceResponse>;
/**
 * Fetches detailed analytics or explanations for a past prediction.
 * @param predictionId The ID of the prediction to get details for.
 */
export declare const getPredictionDetails: (predictionId: string) => Promise<Record<string, unknown>>;
/**
 * Fetches general ML insights not tied to a specific immediate prediction request.
 * Calls backend GET /api/v1/predictions/insights/general.
 * Expected backend response is a list of GeneralInsightResponse (see backend/app/api/v1/endpoints/prediction.py):
 * [
 *   {
 *     "id": "string",
 *     "text": "string",
 *     "source": "string",
 *     "confidence": number (optional),
 *     "type": "string (e.g., opportunity, risk)" (optional),
 *     "relatedEntities": [ { "id": "string", "type": "string" } ] (optional)
 *   },
 *   ...
 * ]
 * This is mapped to frontend GeneralInsight[].
 */
export declare const fetchGeneralInsights: () => Promise<GeneralInsight[]>;
export {};
