import { EventEmitter } from 'events';
export interface SportsNewsArticle {
    id: string;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
}
interface ApiConfig {
    baseURL: string;
    timeout?: number;
}
/**
 * Modern ExternalApiService with proper async/await and error handling
 */
export declare class ExternalApiService extends EventEmitter {
    private config;
    constructor(config: ApiConfig);
    /**
     * @deprecated Use newsService.fetchHeadlines instead. This method will be removed in a future release.
     * Calls the unified newsService.fetchHeadlines for robust news fetching.
     */
    getSportsNews(): Promise<SportsNewsArticle[]>;
    getSchedule(): Promise<any[]>;
}
export declare const externalApiService: ExternalApiService;
export {};
