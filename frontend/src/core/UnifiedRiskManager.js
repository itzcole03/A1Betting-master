import { AlertType } from '../types/common';
import { EventBus } from './EventBus.ts';
import { UnifiedConfigManager } from './UnifiedConfigManager.ts';
import { UnifiedMonitor } from './UnifiedMonitor.ts';
export class UnifiedRiskManager {
    constructor() {
        this.eventBus = EventBus.getInstance();
        this.configManager = UnifiedConfigManager.getInstance();
        this.monitor = UnifiedMonitor.getInstance();
        this.riskProfiles = new Map();
        this.riskMetrics = new Map();
        this.activeRiskChecks = new Set();
        this.setupEventListeners();
        this.initializeDefaultProfiles();
    }
    static getInstance() {
        if (!UnifiedRiskManager.instance) {
            UnifiedRiskManager.instance = new UnifiedRiskManager();
        }
        return UnifiedRiskManager.instance;
    }
    setupEventListeners() {
        this.eventBus.on('market:update', (update) => {
            this.checkMarketRisk(update);
        });
        this.eventBus.on('prediction:update', (update) => {
            this.checkPredictionRisk(update);
        });
    }
    initializeDefaultProfiles() {
        const defaultProfiles = [
            {
                id: 'conservative',
                name: 'Conservative',
                maxExposure: 0.1,
                maxDrawdown: 0.05,
                stopLoss: 0.02,
                takeProfit: 0.05,
                riskToleranceLevel: 'low',
                hedgingEnabled: true,
                diversificationRules: {
                    maxPositionsPerMarket: 2,
                    maxPositionsTotal: 10,
                    minDiversificationScore: 0.8
                },
                customRules: []
            },
            {
                id: 'moderate',
                name: 'Moderate',
                maxExposure: 0.2,
                maxDrawdown: 0.1,
                stopLoss: 0.05,
                takeProfit: 0.1,
                riskToleranceLevel: 'medium',
                hedgingEnabled: true,
                diversificationRules: {
                    maxPositionsPerMarket: 3,
                    maxPositionsTotal: 15,
                    minDiversificationScore: 0.6
                },
                customRules: []
            },
            {
                id: 'aggressive',
                name: 'Aggressive',
                maxExposure: 0.3,
                maxDrawdown: 0.15,
                stopLoss: 0.1,
                takeProfit: 0.2,
                riskToleranceLevel: 'high',
                hedgingEnabled: false,
                diversificationRules: {
                    maxPositionsPerMarket: 5,
                    maxPositionsTotal: 25,
                    minDiversificationScore: 0.4
                },
                customRules: []
            }
        ];
        defaultProfiles.forEach(profile => {
            this.riskProfiles.set(profile.id, profile);
        });
    }
    createRiskProfile(profile) {
        if (this.riskProfiles.has(profile.id)) {
            throw new Error(`Risk profile with ID ${profile.id} already exists`);
        }
        this.riskProfiles.set(profile.id, profile);
        this.eventBus.emit('risk:profile:created', { profileId: profile.id });
    }
    updateRiskProfile(profileId, updates) {
        const profile = this.riskProfiles.get(profileId);
        if (!profile) {
            throw new Error(`Risk profile with ID ${profileId} not found`);
        }
        const updatedProfile = { ...profile, ...updates };
        this.riskProfiles.set(profileId, updatedProfile);
        this.eventBus.emit('risk:profile:updated', { profileId });
    }
    deleteRiskProfile(profileId) {
        if (!this.riskProfiles.has(profileId)) {
            throw new Error(`Risk profile with ID ${profileId} not found`);
        }
        this.riskProfiles.delete(profileId);
        this.eventBus.emit('risk:profile:deleted', { profileId });
    }
    getRiskProfile(profileId) {
        const profile = this.riskProfiles.get(profileId);
        if (!profile) {
            throw new Error(`Risk profile with ID ${profileId} not found`);
        }
        return profile;
    }
    getAllRiskProfiles() {
        return Array.from(this.riskProfiles.values());
    }
    getRiskMetrics(profileId) {
        const metrics = this.riskMetrics.get(profileId);
        if (!metrics) {
            throw new Error(`Risk metrics for profile ${profileId} not found`);
        }
        return metrics;
    }
    checkMarketRisk(update) {
        const checkId = `market_${update.id}_${Date.now()}`;
        if (this.activeRiskChecks.has(checkId)) {
            return; // Prevent duplicate checks
        }
        this.activeRiskChecks.add(checkId);
        try {
            this.riskProfiles.forEach((profile, profileId) => {
                const metrics = this.calculateRiskMetrics(profile, update);
                this.riskMetrics.set(profileId, metrics);
                if (metrics.violatedRules.length > 0) {
                    this.handleRiskViolation(profile, metrics);
                }
                if (metrics.currentExposure > profile.maxExposure) {
                    this.monitor.logError('risk', new Error('Maximum exposure exceeded'), {
                        profileId,
                        currentExposure: metrics.currentExposure,
                        maxExposure: profile.maxExposure
                    });
                }
                if (metrics.currentDrawdown > profile.maxDrawdown) {
                    this.monitor.logError('risk', new Error('Maximum drawdown exceeded'), {
                        profileId,
                        currentDrawdown: metrics.currentDrawdown,
                        maxDrawdown: profile.maxDrawdown
                    });
                }
            });
        }
        finally {
            this.activeRiskChecks.delete(checkId);
        }
    }
    checkPredictionRisk(update) {
        const checkId = `prediction_${update.id}_${Date.now()}`;
        if (this.activeRiskChecks.has(checkId)) {
            return;
        }
        this.activeRiskChecks.add(checkId);
        try {
            this.riskProfiles.forEach((profile, profileId) => {
                if (update.confidence < 0.5) {
                    this.monitor.logError('risk', new Error('Low prediction confidence'), {
                        profileId,
                        predictionId: update.id,
                        confidence: update.confidence
                    });
                }
                if (update.volatility > 0.3) {
                    this.monitor.logError('risk', new Error('High market volatility'), {
                        profileId,
                        predictionId: update.id,
                        volatility: update.volatility
                    });
                }
            });
        }
        finally {
            this.activeRiskChecks.delete(checkId);
        }
    }
    calculateRiskMetrics(profile, marketUpdate) {
        // This is a simplified implementation
        // In a real system, this would involve complex calculations
        return {
            currentExposure: 0,
            currentDrawdown: 0,
            openPositions: 0,
            totalRisk: 0,
            riskByMarket: new Map(),
            diversificationScore: 1,
            hedgeEffectiveness: 1,
            violatedRules: []
        };
    }
    handleRiskViolation(profile, metrics) {
        const alert = {
            type: AlertType.SYSTEM,
            severity: 'high',
            title: 'Risk Rules Violated',
            message: `Risk rules violated for profile ${profile.name}: ${metrics.violatedRules.join(', ')}`,
            metadata: {
                profileId: profile.id,
                violatedRules: metrics.violatedRules,
                metrics
            }
        };
        this.eventBus.emit('risk:violation', alert);
    }
    addCustomRule(profileId, rule) {
        const profile = this.getRiskProfile(profileId);
        const newRule = {
            id: `rule_${Date.now()}`,
            name: rule.name,
            condition: rule.condition,
            action: rule.action,
            enabled: true
        };
        profile.customRules.push(newRule);
        this.riskProfiles.set(profileId, profile);
        this.eventBus.emit('risk:rule:added', { profileId, ruleId: newRule.id });
    }
    updateCustomRule(profileId, ruleId, updates) {
        const profile = this.getRiskProfile(profileId);
        const ruleIndex = profile.customRules.findIndex(r => r.id === ruleId);
        if (ruleIndex === -1) {
            throw new Error(`Rule ${ruleId} not found in profile ${profileId}`);
        }
        profile.customRules[ruleIndex] = {
            ...profile.customRules[ruleIndex],
            ...updates
        };
        this.riskProfiles.set(profileId, profile);
        this.eventBus.emit('risk:rule:updated', { profileId, ruleId });
    }
    deleteCustomRule(profileId, ruleId) {
        const profile = this.getRiskProfile(profileId);
        profile.customRules = profile.customRules.filter(r => r.id !== ruleId);
        this.riskProfiles.set(profileId, profile);
        this.eventBus.emit('risk:rule:deleted', { profileId, ruleId });
    }
    evaluateCustomRules(profileId, context) {
        const profile = this.getRiskProfile(profileId);
        profile.customRules
            .filter(rule => rule.enabled)
            .forEach(rule => {
            try {
                // In a real implementation, this would use a proper rule engine
                // This is just a simplified example
                const condition = new Function('context', `return ${rule.condition}`);
                if (condition(context)) {
                    const action = new Function('context', rule.action);
                    action(context);
                    this.eventBus.emit('risk:rule:executed', {
                        profileId,
                        ruleId: rule.id,
                        context
                    });
                }
            }
            catch (error) {
                this.monitor.logError('risk', error, {
                    profileId,
                    ruleId: rule.id,
                    context
                });
            }
        });
    }
}
