import { BookOdds, BettingOpportunity, TeaserLeg, TeaserStrategy } from '@/types/betting';
export declare class BettingStrategyService {
    private static instance;
    private historicalData;
    private activeAlerts;
    private constructor();
    static getInstance(): BettingStrategyService;
    private validateMarket;
    detectArbitrage(markets: Map<string, BookOdds[]>): BettingOpportunity[];
    findMiddleOpportunities(markets: Map<string, BookOdds[]>): BettingOpportunity[];
    optimizeTeaserStrategy(legs: TeaserLeg[], points: number): TeaserStrategy;
    private validateCorrelation;
    private findBestOdds;
    private calculateTotalImpliedProbability;
    private americanToDecimal;
    private oddsToSpread;
    private calculateMiddleEV;
    private adjustOddsForTeaser;
    private calculateTotalTeaserOdds;
    private calculateTeaserEV;
    private calculatePayout;
    addHistoricalData(market: string, odds: BookOdds): void;
    getHistoricalData(market: string): BookOdds[];
    private createOpportunity;
}
export default BettingStrategyService;
