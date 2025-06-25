import { ApiBase } from './apiBase';
export declare class SentimentApi extends ApiBase {
    constructor();
    getSentimentSnapshot(params?: Record<string, any>): Promise<unknown>;
}
