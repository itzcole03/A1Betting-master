import { Observable } from 'rxjs';
import type { ESPNHeadline } from '../types/index';
type DataStreamType = 'news';
interface DataStream<T> {
    type: DataStreamType;
    data: T;
    timestamp: number;
}
declare class DataIntegrationService {
    private dataStreams;
    private cache;
    private updateIntervals;
    private readonly DEFAULT_CACHE_TTL;
    constructor();
    private initializeStreams;
    startAllStreams(): void;
    private startPeriodicUpdate;
    private fetchAndUpdateData;
    private updateCache;
    getCachedData(key: string): ESPNHeadline[] | null;
    getStream(type: 'news'): Observable<DataStream<ESPNHeadline[]>>;
    private emitUpdate;
    stopAllStreams(): void;
}
export declare const dataIntegrationService: DataIntegrationService;
export {};
