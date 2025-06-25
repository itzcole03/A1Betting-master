interface SocialData {
    teamCohesion: number;
    homeAdvantage: number;
    crowdImpact: number;
    rivalryFactor: number;
    mediaPressure: number;
}
interface SocialAnalysisRequest {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    venue: string;
    timestamp: string;
}
export declare class SocialDynamicsService {
    analyzeSocialFactors(_request: SocialAnalysisRequest): Promise<SocialData>;
    private calculateTeamCohesion;
    private calculateHomeAdvantage;
    private calculateCrowdImpact;
    private calculateRivalryFactor;
    private calculateMediaPressure;
}
export {};
