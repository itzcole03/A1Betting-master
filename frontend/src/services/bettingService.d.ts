import type { Bet, Event, Sport, Odds } from "../types/betting";
export declare const useSports: () => import("@tanstack/react-query").UseQueryResult<Sport[], Error>;
export declare const useEvents: (sportId: string) => import("@tanstack/react-query").UseQueryResult<Event[], Error>;
export declare const useOdds: (eventId: string) => import("@tanstack/react-query").UseQueryResult<Odds, Error>;
export declare const useActiveBets: () => import("@tanstack/react-query").UseQueryResult<Bet[], Error>;
export declare const usePlaceBet: () => import("@tanstack/react-query").UseMutationResult<Bet, Error, Omit<Bet, "id" | "status" | "timestamp">, unknown>;
export declare const useCancelBet: () => import("@tanstack/react-query").UseMutationResult<Bet, Error, string, unknown>;
export declare const connectToOddsWebSocket: (eventId: string, onUpdate: (odds: Odds) => void) => () => void;
