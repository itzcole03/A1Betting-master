import { EventBus } from '@core/EventBus';
export interface PrizePicksAPIConfig {
    apiKey?: string;
    baseUrl?: string;
    eventBus?: EventBus;
}
export interface RawPrizePicksProjection {
    id: string;
    type: 'projection';
    attributes: {
        description: string;
        display_stat: string;
        flash_sale_line_score?: number;
        is_promo: boolean;
        line_score: number;
        odds_type: string;
        promotion_id?: string | null;
        projection_type: string;
        pt_old?: string | null;
        rank: number;
        refundable: boolean;
        source: string;
        start_time: string;
        stat_type: string;
        status: string;
        custom_image_url?: string | null;
        updated_at: string;
    };
    relationships: {
        league: {
            data: {
                id: string;
                type: 'league';
            };
        };
        new_player: {
            data: {
                id: string;
                type: 'new_player';
            };
        };
        stat_type: {
            data: {
                id: string;
                type: 'stat_type';
            };
        };
    };
}
export interface RawPrizePicksIncludedPlayer {
    id: string;
    type: 'new_player';
    attributes: {
        name: string;
        display_name: string;
        short_name: string;
        position: string;
        team_name: string;
        team_nickname: string;
        image_url: string;
    };
}
export interface RawPrizePicksIncludedLeague {
    id: string;
    type: 'league';
    attributes: {
        name: string;
        sport: string;
        abbreviation: string;
        active: boolean;
    };
}
export interface RawPrizePicksIncludedStatType {
    id: string;
    type: 'stat_type';
    attributes: {
        name: string;
        display_name: string;
        abbreviation: string;
    };
}
export type PrizePicksIncludedResource = RawPrizePicksIncludedPlayer | RawPrizePicksIncludedLeague | RawPrizePicksIncludedStatType;
export interface PrizePicksAPIResponse<T> {
    data: T[];
    included?: PrizePicksIncludedResource[];
    links?: {
        first?: string;
        last?: string;
        next?: string | null;
        prev?: string | null;
    };
    meta?: Record<string, unknown>;
}
export declare class PrizePicksAPI {
    private apiKey?;
    private baseUrl;
    constructor(config: PrizePicksAPIConfig);
    private request;
    fetchProjections(leagueId?: string, queryParams?: Record<string, string>): Promise<PrizePicksAPIResponse<RawPrizePicksProjection>>;
    fetchProjectionById(projectionId: string): Promise<PrizePicksAPIResponse<RawPrizePicksProjection>>;
    fetchLeagues(): Promise<PrizePicksAPIResponse<RawPrizePicksIncludedLeague>>;
    fetchStatTypes(): Promise<PrizePicksAPIResponse<RawPrizePicksIncludedStatType>>;
    fetchPlayerById(playerId: string): Promise<{
        data: RawPrizePicksIncludedPlayer;
    }>;
}
