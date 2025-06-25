/**
 * Complete Frontend-Backend Integration Test
 * Tests all enhanced mathematical services end-to-end
 */
declare const mockPredictionRequest: {
    event_id: string;
    sport: string;
    features: {
        player_performance: number;
        team_strength: number;
        matchup_difficulty: number;
        historical_performance: number;
        injury_impact: number;
        weather_effect: number;
        venue_advantage: number;
        rest_factor: number;
        momentum: number;
        public_sentiment: number;
    };
    enable_neuromorphic: boolean;
    neuromorphic_timesteps: number;
    enable_mamba: boolean;
    mamba_sequence_length: number;
    enable_causal_inference: boolean;
    causal_significance_level: number;
    enable_topological: boolean;
    topological_max_dimension: number;
    enable_riemannian: boolean;
    riemannian_manifold_dim: number;
    use_gpu: boolean;
    numerical_precision: "float32";
    convergence_tolerance: number;
    context: {};
};
declare const mockPredictionResponse: {
    event_id: string;
    strategy_used: string;
    base_prediction: number;
    neuromorphic_enhancement: number;
    mamba_temporal_refinement: number;
    causal_adjustment: number;
    topological_smoothing: number;
    riemannian_projection: number;
    final_prediction: number;
    neuromorphic_metrics: {
        spike_rate: number;
        isi_statistics: {
            mean_isi: number;
            cv_isi: number;
        };
        network_criticality: number;
    };
    mamba_metrics: {
        eigenvalue_spectrum: number[];
        spectral_radius: number;
        temporal_coherence: number;
    };
    causal_metrics: {
        causal_strength: number;
        causal_graph: {
            X1: string[];
            X2: string[];
        };
        pc_algorithm_applied: boolean;
    };
    topological_metrics: {
        betti_numbers: {
            H0: number;
            H1: number;
            H2: number;
        };
        persistence_barcode: number[][];
    };
    riemannian_metrics: {
        curvature: number;
        manifold_dimension: number;
        geodesic_computations: boolean;
    };
    riemannian_curvature: number;
    persistent_betti_numbers: {
        H0: number;
        H1: number;
        H2: number;
    };
    causal_graph_structure: {
        X1: string[];
        X2: string[];
    };
    mamba_eigenvalue_spectrum: number[];
    neuromorphic_spike_statistics: {
        mean_isi: number;
        cv_isi: number;
    };
    topological_persistence_barcode: number[][];
    convergence_rate: number;
    stability_margin: number;
    lyapunov_exponent: number;
    mathematical_guarantees: {
        neuromorphic_stability: boolean;
        mamba_convergence: boolean;
        causal_identifiability: boolean;
        topological_persistence: boolean;
        riemannian_completeness: boolean;
    };
    actual_complexity: {
        neuromorphic: string;
        mamba: string;
        causal: string;
        topological: string;
        riemannian: string;
    };
    runtime_analysis: {
        neuromorphic: number;
        mamba: number;
        causal: number;
        topological: number;
        riemannian: number;
    };
    memory_usage: {
        neuromorphic: number;
        mamba: number;
        causal: number;
        topological: number;
        riemannian: number;
    };
    prediction_confidence: number;
    uncertainty_bounds: number[];
    confidence_intervals: {
        "90%": number[];
        "95%": number[];
        "99%": number[];
    };
    total_processing_time: number;
    component_processing_times: {
        neuromorphic: number;
        mamba: number;
        causal: number;
        topological: number;
        riemannian: number;
        total_prediction: number;
    };
    timestamp: string;
    numerical_stability: {
        no_nan_values: boolean;
        no_infinite_values: boolean;
        bounded_outputs: boolean;
        convergence_achieved: boolean;
        eigenvalues_stable: boolean;
    };
    convergence_diagnostics: {
        convergence_rate: number;
        lyapunov_exponent: number;
        stability_margin: number;
        iterations_to_convergence: number;
        convergence_tolerance_met: boolean;
    };
    theoretical_bounds_satisfied: boolean;
};
declare const mockSystemHealth: {
    overall_status: "healthy";
    component_status: {
        prediction_engine: string;
        feature_engineering: string;
        risk_management: string;
        data_pipeline: string;
        neuromorphic_engine: string;
        mamba_engine: string;
        causal_engine: string;
        topological_engine: string;
        riemannian_engine: string;
    };
    error_rate: number;
    average_response_time: number;
    throughput: number;
    cpu_usage: number;
    memory_usage: number;
    gpu_usage: number;
    cache_efficiency: number;
    prediction_accuracy: number;
    mathematical_rigor_score: number;
};
declare const mockModelMetrics: {
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
}[];
export { mockPredictionRequest, mockPredictionResponse, mockSystemHealth, mockModelMetrics, };
