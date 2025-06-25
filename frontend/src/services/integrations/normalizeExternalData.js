// Utility to normalize external API data to Alpha1 internal schema
export function normalizePlayerProp(raw) {
    // Map raw API fields to PlayerProp
    if (!raw || typeof raw !== 'object')
        return undefined;
    const obj = raw;
    return {
        id: String(obj.id ?? obj.prop_id),
        player: obj.player ?? obj.athlete,
        type: (typeof obj.market === 'string' ? obj.market : typeof obj.type === 'string' ? obj.type : 'unknown'),
        line: Number(obj.value),
        odds: Number(obj.odds),
        confidence: typeof obj.confidence === 'number' ? obj.confidence : 1,
        timestamp: typeof obj.timestamp === 'number' ? obj.timestamp : Date.now(),
    };
}
export function normalizeGameState(raw) {
    if (!raw || typeof raw !== 'object')
        return undefined;
    const obj = raw;
    return {
        id: String(obj.id ?? obj.game_id),
        homeTeam: String(obj.home_team ?? obj.home),
        awayTeam: String(obj.away_team ?? obj.away),
        score: obj.score,
        status: String(obj.status ?? ''),
        startTime: (typeof obj.start_time === 'string' || typeof obj.start_time === 'number')
            ? obj.start_time
            : (typeof obj.startTime === 'string' || typeof obj.startTime === 'number')
                ? obj.startTime
                : Date.now(),
        league: String(obj.league ?? ''),
        updated: typeof obj.updated === 'number' ? obj.updated : Date.now(),
    };
}
export function normalizeSentiment(raw) {
    if (!raw || typeof raw !== 'object')
        return undefined;
    const obj = raw;
    return {
        id: String(obj.id ?? ''),
        entity: String(obj.entity ?? ''),
        score: Number(obj.score ?? 0),
        volume: Number(obj.volume ?? 0),
        source: String(obj.source ?? ''),
        timestamp: typeof obj.timestamp === 'number' ? obj.timestamp : Date.now(),
    };
}
// Add more normalization utilities as needed
