import { ApiBase } from './apiBase';
export declare class InjuryApi extends ApiBase {
    constructor();
    getInjuries(params?: Record<string, any>): Promise<unknown>;
}
