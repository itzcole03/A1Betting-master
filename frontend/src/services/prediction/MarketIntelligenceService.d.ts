interface MarketData {
    lineMovement: number;
    marketEfficiency: number;
    valueOpportunity: number;
    riskExposure: number;
    liquidityDepth: number;
}
interface MarketAnalysisRequest {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    timestamp: string;
}
export declare class MarketIntelligenceService {
    analyzeMarketData(request: MarketAnalysisRequest): Promise<MarketData>;
    private calculateLineMovement;
    private calculateMarketEfficiency;
    private calculateValueOpportunity;
    private calculateRiskExposure;
    private calculateLiquidityDepth;
}
export {};
