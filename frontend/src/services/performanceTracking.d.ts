import { BettingOpportunity } from './bettingStrategy';
export interface BetRecord {
    id: string;
    sportId: string;
    gameId: string;
    market: string;
    placedOdds: number;
    closingOdds: number;
    stake: number;
    result: 'WIN' | 'LOSS' | 'PUSH' | 'PENDING';
    timestamp: number;
    book: string;
    metadata: {
        line?: number;
        closingLine?: number;
        predictionConfidence?: number;
        tags?: string[];
    };
}
export interface BetResult {
    id: string;
    opportunityId: string;
    market: string;
    placedOdds: number;
    closingOdds: number;
    stake: number;
    result: 'WIN' | 'LOSS' | 'PUSH';
    payout: number;
    timestamp: number;
    metadata: {
        type: BettingOpportunity['type'];
        books: string[];
        clv?: number;
        edgeRetention?: number;
    };
}
export interface PerformanceMetrics {
    totalBets: number;
    winRate: number;
    roi: number;
    clvAverage: number;
    edgeRetention: number;
    kellyMultiplier: number;
    marketEfficiencyScore: number;
    profitByStrategy: Record<BettingOpportunity['type'], number>;
    variance: number;
    sharpeRatio: number;
    averageClv: number;
    sharpnessScore: number;
}
export interface ClvAnalysis {
    clvValue: number;
    edgeRetained: number;
    marketEfficiency: number;
    timeValue: number;
    factors: {
        name: string;
        impact: number;
        description: string;
    }[];
}
export declare class PerformanceTrackingService {
    private static instance;
    private betHistory;
    private readonly RISK_FREE_RATE;
    private readonly CACHE_DURATION;
    private metricsCache;
    private readonly MAX_HISTORY_SIZE;
    private constructor();
    static getInstance(): PerformanceTrackingService;
    addBetResult(result: BetResult): void;
    getPerformanceMetrics(timeframe?: {
        start: number;
        end: number;
    }): PerformanceMetrics;
    private calculateWinRate;
    private calculateROI;
    private calculateAverageEdgeRetention;
    private calculateOptimalKellyMultiplier;
    private getEmptyMetrics;
    private calculateProfitByStrategy;
    private calculateVariance;
    private calculateSharpeRatio;
    private calculateAverageClv;
    private calculateMarketEfficiencyScore;
    private calculateSharpnessScore;
    getBetHistory(filters?: {
        type?: BettingOpportunity['type'];
        market?: string;
        timeframe?: {
            start: number;
            end: number;
        };
    }): BetResult[];
    calculateCLV(placedOdds: number, closingOdds: number): number;
    private americanToDecimal;
    static calculateMetrics(bets: BetRecord[]): PerformanceMetrics;
    private static calculatePayout;
    private static calculateAverageClv;
    private static calculateSingleBetClv;
    private static oddsToProb;
    private static calculateAverageOdds;
    private static calculateKellyMultiplier;
    private static calculateSharpnessScore;
    static analyzeClv(bet: BetRecord): ClvAnalysis;
    private static calculateEdgeRetention;
    private static calculateTheoreticalEdge;
    private static calculateMarketEfficiency;
    private static calculateTimeValue;
    private static calculateTimingImpact;
}
