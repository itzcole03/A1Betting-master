import { AxiosInstance } from 'axios';
import { BaseApiService, ApiResponse } from './ApiService';
export interface PrizePicksProp {
    id: string;
    type: string;
    value: number;
    player: {
        name: string;
        team: string;
        position: string;
    };
    game: {
        startTime: string;
        homeTeam: string;
        awayTeam: string;
    };
}
export declare class PrizePicksApiService extends BaseApiService {
    protected initializeClient(): AxiosInstance;
    protected handleError(error: Error): void;
    protected handleResponse<T>(response: ApiResponse<T>): void;
    get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T>;
    post<T>(endpoint: string, data: unknown): Promise<T>;
    getAvailableProps(): Promise<PrizePicksProp[]>;
    getPlayerStats(playerId: string): Promise<any>;
    getGameDetails(gameId: string): Promise<any>;
}
