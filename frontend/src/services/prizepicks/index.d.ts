import { PrizePicksProps, PrizePicksPlayer, PrizePicksLines } from '../../types/prizePicks';
interface Prop {
    id: string;
    playerName: string;
    propType: string;
    line: number;
    overOdds: number;
    underOdds: number;
    gameTime: Date;
    sport: string;
}
interface LineupRecommendation {
    playerName: string;
    propType: string;
    line: number;
    confidence: number;
    expectedValue: number;
    multiplier: number;
}
interface PrizePicksConfig {
    apiKey: string;
    baseUrl: string;
    cacheEnabled: boolean;
}
export declare class PrizePicksService {
    private static instance;
    private config;
    private mlService;
    private adapter;
    private constructor();
    static getInstance(config?: PrizePicksConfig): PrizePicksService;
    getAvailableProps(params: {
        sports: string[];
        timeWindow: string;
    }): Promise<Prop[]>;
    private fetchProps;
    generateOptimizedLineup(params: {
        predictions: any[];
        props: Prop[];
        investmentAmount: number;
        strategyMode: string;
        portfolioSize: number;
    }): Promise<LineupRecommendation[]>;
    private filterPropsByStrategy;
    private calculateOptimalPortfolio;
    private calculateMultiplier;
    fetchProjections(league?: string, statType?: string): Promise<PrizePicksProps[]>;
    fetchPlayerDetails(playerId: string): Promise<PrizePicksPlayer | undefined>;
    fetchLines(propId: string): Promise<PrizePicksLines | null>;
    private transformProjections;
    private transformPlayerDetails;
    private transformLines;
    private parseOdds;
}
export default PrizePicksService;
