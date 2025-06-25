import { EventBus } from '../core/EventBus';
import { PerformanceMonitor } from '../core/PerformanceMonitor';
export class ESPNAdapter {
    constructor() {
        this.id = 'espn';
        this.type = 'sports-news';
        this.eventBus = EventBus.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.cache = {
            data: null,
            timestamp: 0
        };
    }
    async isAvailable() {
        return true;
    }
    async fetch() {
        const traceId = this.performanceMonitor.startTrace('espn-fetch');
        try {
            if (this.isCacheValid()) {
                return this.cache.data;
            }
            const [games, headlines] = await Promise.all([
                this.fetchGames(),
                this.fetchHeadlines()
            ]);
            const data = { games, headlines };
            this.cache = { data, timestamp: Date.now() };
            this.eventBus.publish({ type: 'espn-updated', payload: { data } });
            this.performanceMonitor.endTrace(traceId);
            return data;
        }
        catch (error) {
            this.performanceMonitor.endTrace(traceId, error);
            throw error;
        }
    }
    async fetchGames() {
        // Use ESPN's public scoreboard API (NBA example)
        const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
        try {
            const res = await fetch(url);
            const json = await res.json();
            return (json.events || []).map((event) => ({
                id: event.id,
                homeTeam: event.competitions[0].competitors.find((c) => c.homeAway === 'home')?.team.displayName || '',
                awayTeam: event.competitions[0].competitors.find((c) => c.homeAway === 'away')?.team.displayName || '',
                startTime: event.date,
                status: event.status.type.name
            }));
        }
        catch {
            return [];
        }
    }
    async fetchHeadlines() {
        // Use ESPN's NBA news RSS feed
        const url = 'https://www.espn.com/espn/rss/nba/news';
        try {
            const res = await fetch(url);
            const text = await res.text();
            const matches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
            return matches.map(item => {
                const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || '';
                const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || '';
                const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
                return { title, link, pubDate };
            });
        }
        catch {
            return [];
        }
    }
    isCacheValid() {
        const cacheTimeout = 5 * 60 * 1000;
        return (this.cache.data !== null &&
            Date.now() - this.cache.timestamp < cacheTimeout);
    }
    clearCache() {
        this.cache = { data: null, timestamp: 0 };
    }
    async connect() { }
    async disconnect() { }
    async getData() { return this.cache.data; }
    isConnected() { return true; }
    getMetadata() { return { id: this.id, type: this.type }; }
}
