import { RiskProfileType, BettingMetrics, BettingHistoryEntry, BettingOpportunity, BetRecommendation } from '../../types/betting';
interface BettingConfig {
    minConfidence: number;
    maxStakePercentage: number;
    riskProfile: RiskProfileType;
    autoRefresh: boolean;
    refreshInterval: number;
}
declare class UnifiedBettingService {
    private static instance;
    private readonly wsService;
    private config;
    private readonly apiUrl;
    protected constructor();
    static getInstance(): UnifiedBettingService;
    private initializeWebSocketHandlers;
    private handleOddsUpdate;
    private handleBettingOpportunities;
    private handleBetResult;
    private validateBettingOpportunities;
    private calculateOpportunityConfidence;
    private updateBettingMetrics;
    private calculateMetrics;
    private calculateWinRate;
    private calculateAverageOdds;
    private calculateROI;
    getBettingOpportunities(): Promise<BettingOpportunity[]>;
    placeBet(bet: BetRecommendation): Promise<boolean>;
    getBettingMetrics(): Promise<BettingMetrics>;
    getBetHistory(): Promise<BettingHistoryEntry[]>;
    setConfig(newConfig: Partial<BettingConfig>): void;
    getConfig(): BettingConfig;
    private emit;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: unknown): Promise<T>;
}
export default UnifiedBettingService;
