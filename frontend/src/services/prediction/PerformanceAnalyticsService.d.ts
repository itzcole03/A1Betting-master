interface PerformanceData {
    recentForm: number;
    historicalPerformance: number;
    matchupAdvantage: number;
    restDays: number;
    travelDistance: number;
}
interface PerformanceAnalysisRequest {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    timestamp: string;
}
export declare class PerformanceAnalyticsService {
    analyzePerformance(request: PerformanceAnalysisRequest): Promise<PerformanceData>;
    private calculateRecentForm;
    private calculateHistoricalPerformance;
    private calculateMatchupAdvantage;
    private calculateRestDays;
    private calculateTravelDistance;
}
export {};
