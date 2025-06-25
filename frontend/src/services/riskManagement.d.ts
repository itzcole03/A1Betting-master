import { EventEmitter } from 'events';
import { MLPrediction } from './mlPredictions';
interface Bet {
    id: string;
    recommendationId: string;
    amount: number;
    type: 'straight' | 'parlay' | 'teaser';
    odds: number;
    timestamp: number;
    status: 'pending' | 'won' | 'lost';
    payout?: number;
}
interface Bankroll {
    initial: number;
    current: number;
    totalBets: number;
    winningBets: number;
    totalProfit: number;
    roi: number;
    averageBetSize: number;
    largestBet: number;
    largestWin: number;
    largestLoss: number;
    currentStreak: number;
    currentStreakType: 'win' | 'loss';
    winStreak: number;
    lossStreak: number;
}
interface RiskMetrics {
    kellyCriterion: number;
    recommendedStake: number;
    maxStake: number;
    riskLevel: 'low' | 'medium' | 'high';
    edge: number;
    expectedValue: number;
    variance: number;
    sharpeRatio: number;
}
export declare class RiskManagementService extends EventEmitter {
    private static instance;
    private bankroll;
    private bets;
    private readonly MAX_BANKROLL_PERCENTAGE;
    private readonly MIN_BANKROLL_PERCENTAGE;
    private readonly KELLY_FRACTION;
    private constructor();
    static getInstance(): RiskManagementService;
    initialize(): Promise<void>;
    assessRisk(params: {
        prediction: any;
        bankroll: number;
        activeBets: any[];
    }): Promise<{
        riskLevel: 'low' | 'medium' | 'high';
        expectedValue: number;
        confidence: number;
        maxStake: number;
        recommendedStake: number;
    }>;
    getBankroll(): Bankroll;
    getBets(): Bet[];
    calculateRiskMetrics(prediction: MLPrediction): RiskMetrics;
    placeBet(params: {
        recommendationId: string;
        amount: number;
        type: Bet['type'];
        odds: number;
    }): void;
    resolveBet(betId: string, won: boolean): void;
    private calculateKellyCriterion;
    private calculateRecommendedStake;
    private calculateMaxStake;
    private determineRiskLevel;
    private calculateVariance;
    private calculateSharpeRatio;
    private updateBankrollMetrics;
    resetBankroll(initialAmount: number): void;
}
export declare const riskManagementService: RiskManagementService;
export {};
