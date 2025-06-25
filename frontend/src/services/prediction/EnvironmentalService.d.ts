interface EnvironmentalData {
    weatherImpact: number;
    venueAdvantage: number;
    surfaceCondition: number;
    timeOfDay: number;
    seasonality: number;
}
interface EnvironmentalAnalysisRequest {
    eventId: string;
    sport: string;
    venue: string;
    timestamp: string;
}
export declare class EnvironmentalService {
    analyzeEnvironmentalFactors(request: EnvironmentalAnalysisRequest): Promise<EnvironmentalData>;
    private calculateWeatherImpact;
    private calculateVenueAdvantage;
    private calculateSurfaceCondition;
    private calculateTimeOfDayImpact;
    private calculateSeasonalityImpact;
}
export {};
