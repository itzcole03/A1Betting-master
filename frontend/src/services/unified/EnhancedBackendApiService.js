/**
 * Enhanced Backend API Integration Service
 * Complete integration with enhanced mathematical backend services
 */
import axios from "axios";
import { UnifiedLogger } from "./UnifiedLogger";
import { UnifiedCache } from "./UnifiedCache";
import { UnifiedErrorService } from "./UnifiedErrorService";
class EnhancedBackendApiService {
    constructor() {
        this.logger = UnifiedLogger.getInstance();
        this.cache = UnifiedCache.getInstance();
        this.errorService = UnifiedErrorService.getInstance();
        this.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000, // Increased for mathematical computations
            headers: {
                "Content-Type": "application/json",
            },
        });
        this.setupInterceptors();
    }
    static getInstance() {
        if (!EnhancedBackendApiService.instance) {
            EnhancedBackendApiService.instance = new EnhancedBackendApiService();
        }
        return EnhancedBackendApiService.instance;
    }
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            this.logger.info("Enhanced Backend API Request", {
                url: config.url,
                method: config.method,
                timestamp: new Date().toISOString(),
            });
            return config;
        }, (error) => {
            this.errorService.handleError(error, "API_REQUEST_ERROR");
            return Promise.reject(error);
        });
        // Response interceptor
        this.client.interceptors.response.use((response) => {
            this.logger.info("Enhanced Backend API Response", {
                url: response.config.url,
                status: response.status,
                responseTime: response.headers["x-response-time"],
                timestamp: new Date().toISOString(),
            });
            return response;
        }, (error) => {
            this.errorService.handleError(error, "API_RESPONSE_ERROR");
            return Promise.reject(error);
        });
    }
    // Enhanced Revolutionary Prediction
    async getEnhancedRevolutionaryPrediction(request) {
        const cacheKey = `enhanced_revolutionary:${request.event_id}:${JSON.stringify(request)}`;
        try {
            // Check cache first
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                this.logger.info("Returning cached enhanced revolutionary prediction", {
                    eventId: request.event_id,
                });
                return cached;
            }
            const response = await this.client.post("/api/enhanced-revolutionary/predict/enhanced", request);
            const result = response.data;
            // Cache for 2 minutes (mathematical computations are expensive)
            await this.cache.set(cacheKey, result, 120);
            this.logger.info("Generated enhanced revolutionary prediction", {
                eventId: request.event_id,
                finalPrediction: result.final_prediction,
                confidence: result.prediction_confidence,
                mathematicalGuarantees: Object.values(result.mathematical_guarantees).filter(Boolean).length,
                processingTime: result.total_processing_time,
            });
            return result;
        }
        catch (error) {
            this.logger.error("Enhanced revolutionary prediction failed", {
                error: error.message,
                request,
            });
            throw error;
        }
    }
    // Enhanced Feature Engineering
    async getEnhancedFeatureEngineering(request) {
        try {
            const response = await this.client.post("/api/enhanced-features/engineer", request);
            this.logger.info("Enhanced feature engineering completed", {
                originalDim: response.data.dimensionality_reduction.original_dim,
                reducedDim: response.data.dimensionality_reduction.reduced_dim,
                explainedVariance: response.data.dimensionality_reduction.explained_variance,
                processingTime: response.data.processing_time,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error("Enhanced feature engineering failed", {
                error: error.message,
                request,
            });
            throw error;
        }
    }
    // Enhanced Risk Assessment
    async getEnhancedRiskAssessment(request) {
        try {
            const response = await this.client.post("/api/enhanced-risk/assess", request);
            this.logger.info("Enhanced risk assessment completed", {
                valueAtRisk: response.data.portfolio_risk.value_at_risk,
                expectedShortfall: response.data.portfolio_risk.expected_shortfall,
                tailIndex: response.data.extreme_value_analysis.tail_index,
                processingTime: response.data.processing_time,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error("Enhanced risk assessment failed", {
                error: error.message,
                request,
            });
            throw error;
        }
    }
    // Mathematical Analysis and Validation
    async getMathematicalAnalysis(request) {
        try {
            const response = await this.client.post("/api/enhanced-revolutionary/analyze/mathematical-rigor", request);
            this.logger.info("Mathematical analysis completed", {
                analysisDepth: response.data.analysis_depth,
                rigorScore: response.data.mathematical_rigor_score,
                samplesProcessed: response.data.data_dimensions.num_samples,
                analysisTime: response.data.computational_performance.analysis_time,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error("Mathematical analysis failed", {
                error: error.message,
                request,
            });
            throw error;
        }
    }
    // Get Mathematical Foundations
    async getMathematicalFoundations() {
        const cacheKey = "mathematical_foundations";
        try {
            const cached = await this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const response = await this.client.get("/api/enhanced-revolutionary/research/mathematical-foundations");
            const result = response.data;
            // Cache for 1 hour (foundations don't change often)
            await this.cache.set(cacheKey, result, 3600);
            this.logger.info("Retrieved mathematical foundations");
            return result;
        }
        catch (error) {
            this.logger.error("Failed to get mathematical foundations", {
                error: error.message,
            });
            throw error;
        }
    }
    // Enhanced Model Status
    async getEnhancedModelStatus() {
        try {
            const response = await this.client.get("/api/enhanced-models/status");
            this.logger.info("Retrieved enhanced model status", {
                totalModels: response.data.models.length,
                activeModels: response.data.models.filter((m) => m.status === "active")
                    .length,
                overallStatus: response.data.system_health.overall_status,
                errorRate: response.data.system_health.error_rate,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error("Failed to get enhanced model status", {
                error: error.message,
            });
            throw error;
        }
    }
    // Unified Prediction (orchestrates all services)
    async getUnifiedPrediction(request) {
        try {
            const startTime = Date.now();
            // Parallel processing for efficiency
            const [enhancedPrediction, featureEngineering, riskAssessment] = await Promise.all([
                // Enhanced revolutionary prediction
                this.getEnhancedRevolutionaryPrediction({
                    event_id: request.event_id,
                    sport: request.sport,
                    features: request.features,
                    enable_neuromorphic: request.processing_level !== "basic",
                    neuromorphic_timesteps: request.processing_level === "revolutionary" ? 200 : 100,
                    enable_mamba: request.processing_level !== "basic",
                    mamba_sequence_length: request.processing_level === "revolutionary" ? 100 : 50,
                    enable_causal_inference: request.processing_level === "advanced" ||
                        request.processing_level === "revolutionary",
                    causal_significance_level: 0.05,
                    enable_topological: request.processing_level === "research_grade" ||
                        request.processing_level === "revolutionary",
                    topological_max_dimension: 2,
                    enable_riemannian: request.processing_level === "research_grade" ||
                        request.processing_level === "revolutionary",
                    riemannian_manifold_dim: 16,
                    use_gpu: request.processing_level === "revolutionary",
                    numerical_precision: request.processing_level === "revolutionary"
                        ? "float64"
                        : "float32",
                    convergence_tolerance: 1e-6,
                    context: {
                        processing_level: request.processing_level,
                        include_all_enhancements: request.include_all_enhancements,
                    },
                }),
                // Feature engineering
                this.getEnhancedFeatureEngineering({
                    data: { features: Object.values(request.features) },
                    feature_types: ["numerical", "temporal", "categorical"],
                    enable_wavelet_transforms: request.processing_level !== "basic",
                    enable_manifold_learning: request.processing_level === "advanced" ||
                        request.processing_level === "research_grade" ||
                        request.processing_level === "revolutionary",
                    enable_information_theory: request.processing_level !== "basic",
                    enable_graph_features: request.processing_level === "research_grade" ||
                        request.processing_level === "revolutionary",
                    target_dimensionality: request.processing_level === "revolutionary" ? 32 : 16,
                }),
                // Risk assessment
                this.getEnhancedRiskAssessment({
                    portfolio: { prediction: 1.0 },
                    market_data: { features: Object.values(request.features) },
                    risk_metrics: ["var", "es", "maximum_drawdown"],
                    confidence_level: 0.95,
                    time_horizon: 1,
                }),
            ]);
            // Mathematical analysis (after other computations)
            const mathematicalAnalysis = await this.getMathematicalAnalysis({
                prediction_data: [
                    {
                        features: request.features,
                        prediction: enhancedPrediction.final_prediction,
                        confidence: enhancedPrediction.prediction_confidence,
                    },
                ],
                analysis_depth: request.processing_level === "revolutionary"
                    ? "research"
                    : "comprehensive",
                include_stability_analysis: true,
                include_convergence_analysis: true,
                include_sensitivity_analysis: request.processing_level !== "basic",
                include_robustness_analysis: request.processing_level === "research_grade" ||
                    request.processing_level === "revolutionary",
                verify_theoretical_guarantees: request.processing_level !== "basic",
                check_mathematical_consistency: true,
            });
            // Calculate unified confidence
            const confidenceComponents = [
                enhancedPrediction.prediction_confidence,
                featureEngineering.dimensionality_reduction.explained_variance,
                1.0 - riskAssessment.portfolio_risk.value_at_risk,
                mathematicalAnalysis.mathematical_rigor_score / 100,
            ];
            const unifiedConfidence = confidenceComponents.reduce((a, b) => a + b, 0) /
                confidenceComponents.length;
            const totalTime = Date.now() - startTime;
            const result = {
                predictions: {
                    enhanced_revolutionary: enhancedPrediction.final_prediction,
                    base_prediction: enhancedPrediction.base_prediction,
                    neuromorphic_enhancement: enhancedPrediction.neuromorphic_enhancement,
                    mamba_refinement: enhancedPrediction.mamba_temporal_refinement,
                    causal_adjustment: enhancedPrediction.causal_adjustment,
                    topological_smoothing: enhancedPrediction.topological_smoothing,
                    riemannian_projection: enhancedPrediction.riemannian_projection,
                },
                enhanced_revolutionary: enhancedPrediction,
                feature_engineering: featureEngineering,
                risk_assessment: riskAssessment,
                mathematical_analysis: mathematicalAnalysis,
                unified_confidence: unifiedConfidence,
                processing_summary: {
                    total_time_ms: totalTime,
                    processing_level: request.processing_level,
                    mathematical_guarantees_met: Object.values(enhancedPrediction.mathematical_guarantees).filter(Boolean).length,
                    rigor_score: mathematicalAnalysis.mathematical_rigor_score,
                    stability_verified: mathematicalAnalysis.mathematical_analysis.theoretical_guarantees
                        ?.asymptotic_stability || false,
                    convergence_achieved: enhancedPrediction.convergence_rate > 0.8,
                    numerical_stability: Object.values(enhancedPrediction.numerical_stability).every(Boolean),
                },
            };
            this.logger.info("Unified prediction completed", {
                eventId: request.event_id,
                processingLevel: request.processing_level,
                unifiedConfidence,
                totalTime,
                guaranteesMet: result.processing_summary.mathematical_guarantees_met,
            });
            return result;
        }
        catch (error) {
            this.logger.error("Unified prediction failed", {
                error: error.message,
                request,
            });
            throw error;
        }
    }
    // Health check
    async healthCheck() {
        const startTime = Date.now();
        try {
            const response = await this.client.get("/health");
            const responseTime = Date.now() - startTime;
            return {
                status: "healthy",
                services: response.data.services || {},
                mathematical_engines: response.data.mathematical_engines || {},
                response_time: responseTime,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            this.logger.error("Backend health check failed", {
                error: error.message,
                responseTime,
            });
            return {
                status: "unhealthy",
                services: {},
                mathematical_engines: {},
                response_time: responseTime,
            };
        }
    }
}
export default EnhancedBackendApiService;
