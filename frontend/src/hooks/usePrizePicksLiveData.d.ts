export interface PrizePicksEdgeLiveData {
    id: string;
    playerName: string;
    statType: string;
    line: number;
    overOdds: number;
    underOdds: number;
    confidence: number;
    expectedValue: number;
    kellyFraction: number;
    modelBreakdown?: Record<string, number>;
    riskReasoning?: string[];
    traceId?: string;
}
export declare function usePrizePicksLiveData(): PrizePicksEdgeLiveData[];
