/**
 * Unified Enhanced Prediction Service
 * Orchestrates all enhanced mathematical prediction services
 */
export interface UnifiedPredictionRequest {
    event_id: string;
    sport: "basketball" | "football" | "baseball" | "hockey" | "soccer";
    player_id?: string;
    team_id?: string;
    features: Record<string, number>;
    historical_data?: Record<string, number[]>;
    contextual_features?: Record<string, any>;
    processing_level: "basic" | "advanced" | "research_grade" | "revolutionary";
    include_uncertainty_quantification: boolean;
    include_feature_engineering: boolean;
    include_risk_assessment: boolean;
    include_causal_analysis: boolean;
    include_topological_analysis: boolean;
    include_manifold_learning: boolean;
    use_gpu_acceleration: boolean;
    parallel_processing: boolean;
    cache_results: boolean;
    real_time_monitoring: boolean;
    numerical_precision: "float32" | "float64";
    convergence_tolerance: number;
    max_iterations: number;
    stability_threshold: number;
}
export interface UnifiedPredictionResponse {
    prediction_id: string;
    event_id: string;
    sport: string;
    timestamp: string;
    final_prediction: number;
    prediction_confidence: number;
    uncertainty_bounds: [number, number];
    confidence_intervals: {
        "90%": [number, number];
        "95%": [number, number];
        "99%": [number, number];
    };
    component_predictions: {
        base_prediction: number;
        neuromorphic_enhancement: number;
        mamba_temporal_refinement: number;
        causal_adjustment: number;
        topological_smoothing: number;
        riemannian_projection: number;
        ensemble_weighting: Record<string, number>;
    };
    mathematical_analysis: {
        rigor_score: number;
        stability_verified: boolean;
        convergence_achieved: boolean;
        theoretical_guarantees: Record<string, boolean>;
        numerical_stability: Record<string, boolean>;
        complexity_analysis: Record<string, any>;
    };
    feature_analysis: {
        original_features: Record<string, number>;
        engineered_features: Record<string, number>;
        feature_importance: Record<string, number>;
        feature_interactions: Record<string, number>;
        dimensionality_reduction: {
            original_dim: number;
            reduced_dim: number;
            explained_variance: number;
            intrinsic_dimension: number;
        };
    };
    risk_assessment: {
        prediction_risk: number;
        model_uncertainty: number;
        data_quality_score: number;
        outlier_detection: boolean;
        stress_test_results: Record<string, number>;
        worst_case_scenario: number;
        best_case_scenario: number;
    };
    performance_metrics: {
        total_processing_time: number;
        component_processing_times: Record<string, number>;
        memory_usage: Record<string, number>;
        gpu_utilization?: number;
        cache_hit_rate: number;
        accuracy_estimate: number;
    };
    validation_results: {
        input_validation: boolean;
        output_validation: boolean;
        mathematical_consistency: boolean;
        convergence_diagnostics: Record<string, any>;
        error_bounds: Record<string, number>;
        sensitivity_analysis: Record<string, number>;
    };
    explainability: {
        shap_values: Record<string, number>;
        feature_attributions: Record<string, number>;
        causal_explanations: Record<string, string>;
        topological_insights: Record<string, any>;
        decision_pathway: string[];
    };
    recommendations: {
        confidence_level: "high" | "medium" | "low";
        risk_level: "low" | "medium" | "high";
        suggested_actions: string[];
        alternative_scenarios: Array<{
            scenario: string;
            prediction: number;
            probability: number;
        }>;
        model_suggestions: string[];
    };
}
export interface ModelPerformanceMetrics {
    model_id: string;
    model_name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc: number;
    calibration_score: number;
    prediction_speed: number;
    memory_usage: number;
    last_update: string;
    training_data_size: number;
    feature_count: number;
    mathematical_properties: {
        convergence_verified: boolean;
        stability_guaranteed: boolean;
        theoretical_bounds_satisfied: boolean;
    };
}
export interface SystemHealthMetrics {
    overall_status: "healthy" | "degraded" | "critical";
    component_status: Record<string, "healthy" | "degraded" | "failed">;
    error_rate: number;
    average_response_time: number;
    throughput: number;
    cpu_usage: number;
    memory_usage: number;
    gpu_usage?: number;
    cache_efficiency: number;
    prediction_accuracy: number;
    mathematical_rigor_score: number;
}
declare class UnifiedEnhancedPredictionService {
    private static instance;
    private logger;
    private cache;
    private backendService;
    private constructor();
    static getInstance(): UnifiedEnhancedPredictionService;
    /**
     * Generate a unified enhanced prediction
     */
    generatePrediction(request: UnifiedPredictionRequest): Promise<UnifiedPredictionResponse>;
    /**
     * Get model performance metrics
     */
    getModelPerformance(): Promise<ModelPerformanceMetrics[]>;
    /**
     * Get system health metrics
     */
    getSystemHealth(): Promise<SystemHealthMetrics>;
    /**
     * Get batch predictions for multiple events
     */
    getBatchPredictions(requests: UnifiedPredictionRequest[]): Promise<UnifiedPredictionResponse[]>;
    /**
     * Get real-time prediction updates
     */
    getRealTimePredictionUpdates(predictionId: string): Promise<Partial<UnifiedPredictionResponse>>;
    private validatePredictionRequest;
    private performAdditionalAnalysis;
    private generateExplainability;
    private generateRecommendations;
    private validatePredictionResults;
}
export default UnifiedEnhancedPredictionService;
