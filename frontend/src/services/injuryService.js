import axios from 'axios';
import { UnifiedConfig } from '../unified/UnifiedConfig.js';
import { EventBus } from '../unified/EventBus.js';
class InjuryService {
    constructor() {
        const configManager = UnifiedConfig.getInstance();
        this.config = configManager.get('injury');
        this.client = axios.create({
            baseURL: this.config.baseUrl,
            timeout: this.config.timeout,
            headers: { 'X-API-Key': this.config.apiKey },
        });
        this.eventBus = EventBus.getInstance();
    }
    /**
     * Fetches strictly typed injury data from real API only. Emits 'injury:update' event.
     * @param params Optional filter params (strictly typed)
     * @returns InjuryData[]
     */
    async getInjuries(params) {
        if (!this.config.enableFeatureFlag) {
            throw new Error('Injury feature is disabled by config.');
        }
        const response = await this.client.get('/injuries', { params });
        const injuries = response.data;
        this.eventBus.emit('injury:update', {
            injuries,
            timestamp: Date.now(),
        });
        return injuries;
    }
    /**
     * Type guard for InjuryData
     * @param data unknown
     * @returns data is InjuryData
     */
    isInjuryData(data) {
        return (typeof data === 'object' &&
            data !== null &&
            'playerId' in data &&
            'playerName' in data &&
            'team' in data &&
            'position' in data &&
            'status' in data &&
            'injuryType' in data &&
            'description' in data &&
            'expectedReturn' in data &&
            'updated' in data);
    }
}
// TODO: Add comprehensive unit and integration tests for all fallback and error-handling logic.
export const injuryService = new InjuryService();
