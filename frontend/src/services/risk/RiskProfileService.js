import { EventBus } from '../../unified/EventBus';
import { ErrorHandler } from '../../core/ErrorHandler';
import { PerformanceMonitor } from '../../unified/PerformanceMonitor';
import { UnifiedConfig } from '../../unified/UnifiedConfig';
export class RiskProfileService {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.config = UnifiedConfig.getInstance();
        this.profiles = new Map();
        this.initializeDefaultProfiles();
        this.setupEventListeners();
    }
    static getInstance() {
        if (!RiskProfileService.instance) {
            RiskProfileService.instance = new RiskProfileService();
        }
        return RiskProfileService.instance;
    }
    initializeDefaultProfiles() {
        const defaultProfiles = [
            {
                id: 'conservative',
                name: 'Conservative',
                maxStake: 100,
                minStake: 10,
                maxExposure: 1000,
                confidenceThreshold: 0.8,
                volatilityThreshold: 0.2,
                stopLossPercentage: 0.05,
                takeProfitPercentage: 0.1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: 'moderate',
                name: 'Moderate',
                maxStake: 250,
                minStake: 25,
                maxExposure: 2500,
                confidenceThreshold: 0.7,
                volatilityThreshold: 0.3,
                stopLossPercentage: 0.1,
                takeProfitPercentage: 0.2,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
            {
                id: 'aggressive',
                name: 'Aggressive',
                maxStake: 500,
                minStake: 50,
                maxExposure: 5000,
                confidenceThreshold: 0.6,
                volatilityThreshold: 0.4,
                stopLossPercentage: 0.15,
                takeProfitPercentage: 0.3,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        ];
        defaultProfiles.forEach(profile => {
            this.profiles.set(profile.id, profile);
        });
        // Set default active profile
        this.activeProfile = defaultProfiles[0];
    }
    setupEventListeners() {
        this.eventBus.on('prediction:update', (prediction) => {
            this.handlePredictionUpdate(prediction);
        });
        this.eventBus.on('risk:update', (data) => {
            const profile = this.profiles.get(data.profileId);
            if (!profile) {
                this.errorHandler.handleError(new Error(`Risk profile with ID ${data.profileId} not found`), 'risk_profile_update');
                return;
            }
            this.handleRiskProfileUpdate(profile);
        });
    }
    handlePredictionUpdate(prediction) {
        try {
            const riskAssessment = this.assessPredictionRisk(prediction);
            this.eventBus.emit('risk:assessment', riskAssessment);
        }
        catch (error) {
            this.errorHandler.handleError(error, 'prediction_risk_assessment');
        }
    }
    handleRiskProfileUpdate(profile) {
        try {
            this.updateProfile(profile);
            this.eventBus.emit('risk:profile:updated', { profileId: profile.id });
        }
        catch (error) {
            this.errorHandler.handleError(error, 'risk_profile_update');
        }
    }
    assessPredictionRisk(prediction) {
        const startTime = Date.now();
        try {
            const riskAssessment = {
                predictionId: prediction.id,
                confidence: prediction.confidence,
                riskLevel: this.calculateRiskLevel(prediction),
                maxStake: this.calculateMaxStake(prediction),
                timestamp: Date.now(),
            };
            const duration = Date.now() - startTime;
            this.performanceMonitor.trackMetric('risk_assessment_duration', duration);
            return riskAssessment;
        }
        catch (error) {
            this.errorHandler.handleError(error, 'risk_assessment');
            throw error;
        }
    }
    calculateRiskLevel(prediction) {
        const { confidence } = prediction;
        const { confidenceThreshold } = this.activeProfile;
        if (confidence >= confidenceThreshold) {
            return 'low';
        }
        else if (confidence >= confidenceThreshold * 0.8) {
            return 'medium';
        }
        else {
            return 'high';
        }
    }
    calculateMaxStake(prediction) {
        const { confidence } = prediction;
        const { maxStake, minStake } = this.activeProfile;
        // Calculate stake based on confidence and risk profile
        const stake = Math.floor(maxStake * confidence);
        return Math.max(minStake, Math.min(stake, maxStake));
    }
    getActiveProfile() {
        return this.activeProfile;
    }
    getProfile(id) {
        return this.profiles.get(id);
    }
    getAllProfiles() {
        return Array.from(this.profiles.values());
    }
    updateProfile(profile) {
        if (!this.profiles.has(profile.id)) {
            throw new Error(`Risk profile with ID ${profile.id} not found`);
        }
        // Validate profile updates
        if (profile.maxStake < profile.minStake) {
            throw new Error('Maximum stake cannot be less than minimum stake');
        }
        profile.updatedAt = Date.now();
        this.profiles.set(profile.id, profile);
        if (profile.id === this.activeProfile.id) {
            this.activeProfile = profile;
        }
    }
    setActiveProfile(id) {
        const profile = this.profiles.get(id);
        if (!profile) {
            throw new Error(`Risk profile with ID ${id} not found`);
        }
        this.activeProfile = profile;
        this.eventBus.emit('risk:profile:activated', { profileId: id });
    }
}
