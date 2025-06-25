export type DataSourceType = 'sentiment' | 'line_movement' | 'weather' | 'injury' | 'news' | 'odds';
export interface LiveDataSource {
    name: string;
    type: DataSourceType;
    priority: number;
    lastUpdated: Date;
    confidence: number;
    enrichment: string[];
}
export interface LiveDataRecord {
    source: LiveDataSource;
    value: any;
    receivedAt: Date;
    freshness: number;
    qualityScore: number;
}
export declare class LiveDataOrchestrator {
    private sources;
    private records;
    registerSource(source: LiveDataSource): void;
    ingestData(sourceName: string, value: any): LiveDataRecord;
    getBestRecord(type: DataSourceType): LiveDataRecord | null;
    simulateFallback(type: DataSourceType): LiveDataRecord | null;
    logSources(): {
        name: string;
        type: DataSourceType;
        lastUpdated: string;
        confidence: number;
        priority: number;
        enrichment: string[];
    }[];
    logRecords(): {
        source: string;
        value: any;
        receivedAt: string;
        freshness: number;
        qualityScore: number;
    }[];
}
