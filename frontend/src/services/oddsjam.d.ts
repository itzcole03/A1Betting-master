interface OddsData {
    eventId: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    startTime: string;
    markets: {
        marketId: string;
        name: string;
        books: {
            bookId: string;
            name: string;
            odds: {
                over: number;
                under: number;
                spread?: number;
                moneyline?: number;
            };
            lastUpdated: string;
        }[];
    }[];
}
interface MarketAnalysis {
    marketId: string;
    name: string;
    bestOdds: {
        over: {
            book: string;
            odds: number;
            edge: number;
        };
        under: {
            book: string;
            odds: number;
            edge: number;
        };
    };
    movement: {
        over: {
            direction: 'up' | 'down' | 'stable';
            percentage: number;
        };
        under: {
            direction: 'up' | 'down' | 'stable';
            percentage: number;
        };
    };
    volume: {
        over: number;
        under: number;
    };
}
declare class OddsJamService {
    private config;
    constructor();
    getOdds(sport: string, date?: string): Promise<OddsData[]>;
    getMarketAnalysis(marketId: string): Promise<MarketAnalysis>;
    getBookmakers(): Promise<string[]>;
    getHistoricalOdds(marketId: string, days: number): Promise<any>;
    getArbitrageOpportunities(sport: string): Promise<any[]>;
}
export declare const oddsjamService: OddsJamService;
export {};
