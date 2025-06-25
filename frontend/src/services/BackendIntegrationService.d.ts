export interface BackendPredictionRequest {
    player_id: string;
    metric: string;
    timeframe: string;
    model_type?: string;
    include_shap?: boolean;
}
export interface BackendPredictionResponse {
    prediction: {
        value: number;
        confidence: number;
        timestamp: string;
    };
    analysis: {
        historical_trends: string[];
        market_signals: string[];
        risk_factors: string[];
        model_breakdown: Record<string, number>;
    };
    shap_values?: {
        feature: string;
        value: number;
        impact: number;
    }[];
    meta: {
        model_version: string;
        feature_count: number;
        prediction_id: string;
    };
}
export interface BackendBettingOpportunity {
    id: string;
    player_name: string;
    stat_type: string;
    line: number;
    over_odds: number;
    under_odds: number;
    confidence: number;
    expected_value: number;
    kelly_fraction: number;
    risk_level: "low" | "medium" | "high";
    time_remaining: string;
    analysis: {
        historical_trends: string[];
        market_signals: string[];
        risk_factors: string[];
    };
}
export interface BackendArbitrageOpportunity {
    id: string;
    sport: string;
    event: string;
    market: string;
    bookmaker1: {
        name: string;
        odds: number;
        stake: number;
    };
    bookmaker2: {
        name: string;
        odds: number;
        stake: number;
    };
    profit: number;
    profit_percentage: number;
    expires_at: string;
}
declare class BackendIntegrationService {
    private static instance;
    private logger;
    private cache;
    private baseURL;
    private constructor();
    static getInstance(): BackendIntegrationService;
    getPrediction(request: BackendPredictionRequest): Promise<BackendPredictionResponse>;
    getBettingOpportunities(params: {
        sports: string[];
        confidence_threshold: number;
        time_window: string;
        strategy_mode: string;
    }): Promise<BackendBettingOpportunity[]>;
    getArbitrageOpportunities(params: {
        sports: string[];
        min_profit: number;
        time_window: string;
    }): Promise<BackendArbitrageOpportunity[]>;
    placeBet(request: {
        opportunity_id: string;
        amount: number;
        bet_type: string;
        selection: string;
    }): Promise<{
        success: boolean;
        bet_id?: string;
        error?: string;
    }>;
    getShapExplanation(predictionId: string): Promise<any>;
    getModelStatus(): Promise<{
        models: Array<{
            id: string;
            name: string;
            status: "active" | "training" | "error";
            accuracy: number;
            last_update: string;
        }>;
    }>;
    private getFallbackPrediction;
    private getFallbackOpportunities;
    healthCheck(): Promise<boolean>;
    startBackend(): Promise<void>;
}
export default BackendIntegrationService;
