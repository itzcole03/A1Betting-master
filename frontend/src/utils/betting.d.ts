export interface FrontendProposition {
    propId: string;
    line: number;
    overOdds?: number;
    underOdds?: number;
    playerName?: string;
    statType?: string;
}
export interface BettingStrategyRequest {
    propositions: FrontendProposition[];
    bankroll: number;
    riskLevel: string;
}
export interface FrontendBetLeg {
    propId: string;
    marketKey: string;
    outcome: string;
    odds: number;
    playerId?: string;
    gameId?: string;
    description?: string;
    line?: number;
    statType?: string;
    playerName?: string;
}
export interface BettingOpportunity {
    id: string;
    description: string;
    expectedValue?: number;
    confidence?: number;
    type: string;
    legs: FrontendBetLeg[];
    stakeSuggestion?: number;
    potentialPayout?: number;
    status?: string;
}
export type BettingStrategyResponse = BettingOpportunity[];
export interface FrontendBetPlacementRequest {
    bets: BettingOpportunity[];
}
export interface BetPlacementResponse {
    betId: string;
    success: boolean;
    message?: string;
    transactionId?: string;
}
export interface ParlayLeg {
    propId: string;
    pick: 'over' | 'under';
    line: number;
    odds: number;
    statType: string;
    playerName: string;
}
