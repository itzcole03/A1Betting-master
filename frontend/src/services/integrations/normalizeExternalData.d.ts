import type { PlayerProp } from '../../types/core.js';
interface GameState {
    id: string;
    homeTeam: string;
    awayTeam: string;
    score: unknown;
    status: string;
    startTime: number | string;
    league: string;
    updated: number;
}
interface SentimentSnapshot {
    id: string;
    entity: string;
    score: number;
    volume: number;
    source: string;
    timestamp: number;
}
export declare function normalizePlayerProp(raw: unknown): PlayerProp | undefined;
export declare function normalizeGameState(raw: unknown): GameState | undefined;
export declare function normalizeSentiment(raw: unknown): SentimentSnapshot | undefined;
export {};
