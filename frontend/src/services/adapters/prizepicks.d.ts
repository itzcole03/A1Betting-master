import { PrizePicksProps, PrizePicksPlayer, PrizePicksLines } from "../../types/prizePicks";
export declare class PrizePicksAdapterImpl {
    private static instance;
    private baseUrl;
    private apiKey;
    private constructor();
    static getInstance(): PrizePicksAdapterImpl;
    fetchProps(params: {
        sports: string[];
        timeWindow: string;
    }): Promise<PrizePicksProps[]>;
    fetchPlayers(params: {
        sports: string[];
    }): Promise<PrizePicksPlayer[]>;
    fetchLines(params: {
        propIds: string[];
    }): Promise<PrizePicksLines[]>;
}
export declare const prizePicksAdapter: PrizePicksAdapterImpl;
export default prizePicksAdapter;
