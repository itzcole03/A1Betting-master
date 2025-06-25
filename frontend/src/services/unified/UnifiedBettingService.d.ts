import { BettingContext, MarketContext } from '@/types';
import { BaseService } from './BaseService';
import { UnifiedServiceRegistry } from './UnifiedServiceRegistry';
import { Bet, BettingConfig, BettingStats, BettingOpportunity, BettingValidation } from '../../types/betting';
import { Event, Market, Selection, Odds } from '../../types/sports';
import { ModelOutput } from '../../types/prediction';
import { BettingPreview, BettingPreviewRequest, BettingValidationRequest, BettingPlaceRequest } from '../../types/betting';
export interface Bet {
    id: string;
    event: string;
    amount: number;
    odds: number;
    timestamp: number;
    status: 'active' | 'won' | 'lost' | 'cancelled';
    type: 'single' | 'multiple' | 'system';
    selections: BetSelection[];
}
export interface BetSelection {
    event: string;
    market: string;
    selection: string;
    odds: number;
    status: 'active' | 'won' | 'lost' | 'cancelled';
}
export interface BettingOpportunity {
    id: string;
    event: string;
    market: string;
    selection: string;
    odds: number;
    prediction: {
        confidence: number;
        expectedValue: number;
    };
    timestamp: number;
}
export declare class UnifiedBettingService extends BaseService {
    private static instance;
    private readonly predictionService;
    private readonly config;
    private readonly logger;
    private readonly cache;
    private errorService;
    private bets;
    private state;
    private constructor();
    static getInstance(registry: UnifiedServiceRegistry): UnifiedBettingService;
    analyzeOpportunity(marketContext: MarketContext, bettingContext: BettingContext): Promise<BettingOpportunity | null>;
    private calculateExpectedValue;
    private meetsBettingCriteria;
    getOpportunities(): Promise<BettingOpportunity[]>;
    private isValidStake;
    private calculateMaxStake;
    getBets(timeRange?: 'day' | 'week' | 'month' | 'year'): Promise<Bet[]>;
    getRecentBets(limit?: number): Promise<Bet[]>;
    updateBetStatus(betId: string, status: 'won' | 'lost' | 'cancelled'): Promise<Bet>;
    private generateId;
    private getTimeRangeInMs;
    getBettingHistory(eventId: string, marketId: string, selectionId: string): Promise<Bet[]>;
    getActiveBets(): Promise<Bet[]>;
    getBettingStats(eventId: string, marketId: string, selectionId: string): Promise<BettingStats>;
    getBalance(): Promise<number>;
    updateOdds(odds: Odds): Promise<void>;
    calculateKellyFraction(odds: Odds, probability: number): Promise<number>;
    getBettingOpportunities(event: Event, market: Market, selection: Selection, modelOutput: ModelOutput): Promise<{
        opportunities: BettingOpportunity[];
    }>;
    getBettingConfig(): Promise<BettingConfig>;
    updateBettingConfig(config: Partial<BettingConfig>): Promise<BettingConfig>;
    previewBet(request: BettingPreviewRequest): Promise<BettingPreview | null>;
    validateBet(request: BettingValidationRequest): Promise<BettingValidation>;
    placeBet(request: BettingPlaceRequest): Promise<Bet | null>;
}
