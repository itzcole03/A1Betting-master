// Base class for all API connectors
import axios from 'axios';
export class ApiBase {
    constructor(baseUrl, apiKey) {
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.client = axios.create({ baseURL: baseUrl });
    }
    async request(config, attempt = 1) {
        try {
            return (await this.client.request(config)).data;
        }
        catch (error) {
            if (attempt < this.maxRetries) {
                await new Promise(res => setTimeout(res, this.retryDelay * attempt));
                return this.request(config, attempt + 1);
            }
            this.logError(error, config);
            throw error;
        }
    }
    logError(error, config) {
        // Log to console and optionally to /logs/liveData.log
        console.error(`[API ERROR] ${config.url}:`, error.message);
        // TODO: Append to /logs/liveData.log if running in Node
    }
}
