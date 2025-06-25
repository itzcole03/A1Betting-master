export class PerformanceHistoryService {
    constructor() {
        this.userHistories = new Map();
        this.modelHistories = new Map();
    }
    static getInstance() {
        if (!PerformanceHistoryService.instance) {
            PerformanceHistoryService.instance = new PerformanceHistoryService();
        }
        return PerformanceHistoryService.instance;
    }
    getUserHistory(userId) {
        return this.userHistories.get(userId);
    }
    getModelHistory(model, market) {
        return this.modelHistories.get(`${model}:${market}`);
    }
    addUserHistoryEntry(userId, entry) {
        if (!this.userHistories.has(userId)) {
            this.userHistories.set(userId, { userId, entries: [] });
        }
        this.userHistories.get(userId).entries.push(entry);
    }
    addModelHistoryEntry(model, market, entry) {
        const key = `${model}:${market}`;
        if (!this.modelHistories.has(key)) {
            this.modelHistories.set(key, { model, market, entries: [] });
        }
        this.modelHistories.get(key).entries.push(entry);
    }
    getUserStats(userId) {
        const history = this.getUserHistory(userId);
        if (!history)
            return null;
        const wins = history.entries.filter(e => e.result === 'win').length;
        const losses = history.entries.filter(e => e.result === 'loss').length;
        const roi = history.entries.reduce((sum, e) => sum + e.payout - e.stake, 0) / (history.entries.reduce((sum, e) => sum + e.stake, 0) || 1);
        return { wins, losses, roi };
    }
}
