import { BettingStrategyRequest, // { propositions: FrontendProposition[], bankroll: number, riskLevel: string }
BettingStrategyResponse, // { propId, marketKey, outcome, odds, playerId, gameId?, description? }
FrontendBetPlacementRequest, // { bets: BettingOpportunity[] } 
BetPlacementResponse } from '../../../shared/betting';
/**
 * Calculates a betting strategy based on selected props, bankroll, and risk level.
 * Calls the backend's /api/betting/calculate-strategy endpoint (currently mocked).
 * Expected frontend request (BettingStrategyRequest) is mapped to backend's StrategyCalculationRequest.
 * Backend StrategyCalculationRequest (from backend/routes/betting_route.py) looks like:
 * {
 *   "propositions": [
 *     { "prop_id": "string", "line": number, "over_odds": number (optional), "under_odds": number (optional),
 *       "player_name": "string" (optional), "stat_type": "string" (optional) ... }
 *   ],
 *   "bankroll": number,
 *   "risk_level": "string"
 * }
 * Expected backend mock response is a list of BackendStrategyBet (defined in this file), which gets mapped to BettingOpportunity[].
 * BackendStrategyBet example (from backend/routes/betting_route.py StrategyBet Pydantic model):
 * {
 *    "bet_id": "string",
 *    "legs": [ { "prop_id": "string", "market_key": "string", "outcome": "string", "odds": number, ... } ],
 *    "stake": number,
 *    "potential_payout": number,
 *    "status": "string",
 *    "created_at": "datetime_string",
 *    "type": "string" (optional)
 * }
 */
export declare const calculateBettingStrategy: (request: BettingStrategyRequest) => Promise<BettingStrategyResponse>;
/**
 * Places bets based on the provided opportunities.
 * Calls the backend's /api/betting/place-bet endpoint (currently mocked).
 * Frontend FrontendBetPlacementRequest ({ bets: BettingOpportunity[] }) is mapped to a list of backend StrategyBet models.
 * Expected backend mock response is a list of BackendBetPlacementResult (defined in this file), mapped to BetPlacementResponse[].
 * BackendBetPlacementResult example (from backend/routes/betting_route.py BetPlacementResult Pydantic model):
 * {
 *   "bet_id": "string",
 *   "status": "string (e.g., placed, failed)",
 *   "message": "string (optional)",
 *   "transaction_id": "string (optional)"
 * }
 */
export declare const placeBets: (request: FrontendBetPlacementRequest) => Promise<BetPlacementResponse[]>;
export declare const bettingStrategyService: {
    calculateBettingStrategy: (request: BettingStrategyRequest) => Promise<BettingStrategyResponse>;
    placeBets: (request: FrontendBetPlacementRequest) => Promise<BetPlacementResponse[]>;
};
