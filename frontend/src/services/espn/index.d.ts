import { Headline, GameSummary, PlayerNews } from '@/types';
declare class ESPNService {
    private adapter;
    constructor();
    fetchHeadlines(): Promise<Headline[]>;
    fetchGameSummary(gameId: string): Promise<GameSummary>;
    fetchPlayerNews(playerId: string): Promise<PlayerNews[]>;
    private transformHeadlines;
    private transformGameSummary;
    private transformPlayerNews;
}
export declare const espnService: ESPNService;
export {};
