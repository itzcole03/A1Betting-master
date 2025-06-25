import { ESPNHeadline } from '../types.js';
/**
 * Strict, production-ready NewsService for Ultimate Sports Betting App.
 * No mocks, simulation, or fallback logic. Strict typing, ESM imports, UnifiedConfig, EventBus, real API only.
 */
declare class NewsService {
    private readonly config;
    private readonly client;
    private readonly eventBus;
    constructor();
    /**
     * Fetch strictly typed news headlines from backend API only.
     * Emits 'news:update' event with timestamped payload.
     * @param source - News source (default: 'espn')
     * @param limit - Max number of headlines (default: 10)
     * @returns Array of ESPNHeadline objects
     */
    fetchHeadlines(source?: string, limit?: number): Promise<ESPNHeadline[]>;
    getBreakingNews(): Promise<ESPNHeadline[]>;
}
export declare const newsService: NewsService;
export {};
