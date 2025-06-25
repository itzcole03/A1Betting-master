export interface PrizePicksBase {
    id: string;
    league: string;
    player_name: string;
    stat_type: string;
    line_score: number;
    description: string;
    start_time?: string;
    status?: string;
}
export interface PrizePicksProps extends PrizePicksBase {
    playerId: string;
    player?: PrizePicksPlayer;
    image_url?: string;
    projection_type?: 'over_under' | 'total' | 'spread';
    overOdds?: number;
    underOdds?: number;
}
export interface PrizePicksPlayer {
    id: string;
    name: string;
    team: string;
    position: string;
    league?: string;
    image_url?: string;
}
export interface PrizePicksLines {
    prop_id: string;
    over_odds?: number;
    under_odds?: number;
    push_odds?: number;
    line_score?: number;
}
export interface PrizePicksEntry {
    id: string;
    user_id: string;
    legs: PrizePicksProps[];
    stake: number;
    payout: number;
    status: 'pending' | 'active' | 'won' | 'lost' | 'canceled';
    created_at: string;
    updated_at: string;
}
export interface PrizePicksLeague {
    id: string;
    name: string;
    sport: string;
}
export interface PrizePicksProjection {
    id: string;
    playerId: string;
    player?: PrizePicksPlayer;
    statType: string;
    line: number;
    description: string;
    startTime: string;
}
export interface PrizePicksData {
    projections: PrizePicksProjection[];
    players: PrizePicksPlayer[];
    leagues: PrizePicksLeague[];
    lastUpdated: string;
}
export interface User {
    id: string;
    username: string;
    email: string;
}
export interface SocialSentimentData {
    topic: string;
    sentimentScore: number;
    positiveMentions: number;
    negativeMentions: number;
    neutralMentions: number;
    source: string;
    lastUpdatedAt: string;
}
export interface ESPNHeadline {
    id: string;
    title: string;
    summary: string;
    link: string;
    publishedAt: string;
    source: string;
    imageUrl?: string;
    category?: string;
}
export interface DailyFantasyProjection {
    playerId: string;
    playerName: string;
    team: string;
    opponent?: string;
    projection: number;
    statType: string;
    salary?: number;
    source: string;
    lastUpdatedAt: string;
}
export interface OddsData {
    propId: string;
    sportsbook: string;
    overOdds?: number;
    underOdds?: number;
    lastUpdatedAt: string;
}
