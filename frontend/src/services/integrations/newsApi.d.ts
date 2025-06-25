import { ApiBase } from './apiBase';
export declare class NewsApi extends ApiBase {
    constructor();
    getHeadlines(params?: Record<string, any>): Promise<unknown>;
}
