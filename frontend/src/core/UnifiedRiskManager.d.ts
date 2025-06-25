interface RiskProfile {
    id: string;
    name: string;
    maxExposure: number;
    maxDrawdown: number;
    stopLoss: number;
    takeProfit: number;
    riskToleranceLevel: 'low' | 'medium' | 'high';
    hedgingEnabled: boolean;
    diversificationRules: {
        maxPositionsPerMarket: number;
        maxPositionsTotal: number;
        minDiversificationScore: number;
    };
    customRules: Array<{
        id: string;
        name: string;
        condition: string;
        action: string;
        enabled: boolean;
    }>;
}
interface RiskMetrics {
    currentExposure: number;
    currentDrawdown: number;
    openPositions: number;
    totalRisk: number;
    riskByMarket: Map<string, number>;
    diversificationScore: number;
    hedgeEffectiveness: number;
    violatedRules: string[];
}
export declare class UnifiedRiskManager {
    private static instance;
    private readonly eventBus;
    private readonly configManager;
    private readonly monitor;
    private readonly riskProfiles;
    private readonly riskMetrics;
    private readonly activeRiskChecks;
    private constructor();
    static getInstance(): UnifiedRiskManager;
    private setupEventListeners;
    private initializeDefaultProfiles;
    createRiskProfile(profile: RiskProfile): void;
    updateRiskProfile(profileId: string, updates: Partial<RiskProfile>): void;
    deleteRiskProfile(profileId: string): void;
    getRiskProfile(profileId: string): RiskProfile;
    getAllRiskProfiles(): RiskProfile[];
    getRiskMetrics(profileId: string): RiskMetrics;
    private checkMarketRisk;
    private checkPredictionRisk;
    private calculateRiskMetrics;
    private handleRiskViolation;
    addCustomRule(profileId: string, rule: {
        name: string;
        condition: string;
        action: string;
    }): void;
    updateCustomRule(profileId: string, ruleId: string, updates: Partial<{
        name: string;
        condition: string;
        action: string;
        enabled: boolean;
    }>): void;
    deleteCustomRule(profileId: string, ruleId: string): void;
    evaluateCustomRules(profileId: string, context: Record<string, any>): void;
}
export {};
