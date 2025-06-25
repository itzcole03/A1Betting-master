interface PsychologicalData {
    pressureHandling: number;
    clutchPerformance: number;
    consistency: number;
    focus: number;
    competitiveDrive: number;
}
interface PsychologicalAnalysisRequest {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    timestamp: string;
}
export declare class PsychologicalAnalyticsService {
    analyzePsychologicalFactors(request: PsychologicalAnalysisRequest): Promise<PsychologicalData>;
    private calculatePressureHandling;
    private calculateClutchPerformance;
    private calculateConsistency;
    private calculateFocus;
    private calculateCompetitiveDrive;
}
export {};
