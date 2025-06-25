// Shared PrizePicks types and utilities

export interface PrizePicksProps {
    playerId: string;
    playerName: string;
    league: string;
    player_name: string;
    stat_type: string;
    line: number;
    description: string;
    image_url?: string;
    overOdds?: number;
    underOdds?: number;
}

export interface PrizePicksResponse {
    success: boolean;
    data: PrizePicksProps[];
    timestamp: number;
}

export interface PrizePicksEntry {
    id: string;
    status?: string;
}
