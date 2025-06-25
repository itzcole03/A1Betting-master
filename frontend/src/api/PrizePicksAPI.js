// import { EventMap } from './../../../src/types/core.ts'; // Temporarily remove as EventMap might not have these keys, FILE NOT FOUND
const API_BASE_URL = 'https://api.prizepicks.com';
export class PrizePicksAPI {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || API_BASE_URL;
    }
    async request(endpoint, method = 'GET', body, additionalHeaders, params) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...additionalHeaders,
        };
        if (this.apiKey) {
            headers['X-Api-Key'] = this.apiKey;
        }
        const configInit = {
            method,
            headers,
        };
        if (body && (method === 'POST' || method === 'PUT')) {
            configInit.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(url.toString(), configInit);
            if (!response.ok) {
                const errorBody = await response.text();
                // Removed eventBus.emit for 'api:error'
                // this.eventBus?.emit('api:error' as any, {
                //   source: 'PrizePicksAPI',
                //   endpoint,
                //   status: response.status,
                //   error: errorBody,
                // });
                console.error(`PrizePicksAPI request failed: ${response.status} ${response.statusText} to ${endpoint} - Body: ${errorBody}`);
                throw new Error(`PrizePicks API request failed to ${endpoint}: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            if (response.status === 204) {
                // No Content
                return null;
            }
            const responseData = await response.json();
            // Removed eventBus.emit for 'api:success'
            // this.eventBus?.emit('api:success' as any, {
            //     source: 'PrizePicksAPI',
            //     endpoint,
            //     status: response.status,
            //     data: responseData,
            // });
            return responseData;
        }
        catch (error) {
            // Removed eventBus.emit for 'api:error'
            // this.eventBus?.emit('api:error' as any, {
            //     source: 'PrizePicksAPI',
            //     endpoint,
            //     status: (error instanceof Response) ? error.status : 0,
            //     error: (error instanceof Error) ? error.message : String(error),
            // });
            console.error(`PrizePicksAPI Error during request to ${endpoint}:`, error);
            throw error;
        }
    }
    async fetchProjections(leagueId, queryParams = {}) {
        const endpoint = '/projections';
        const params = { single_stat: 'true', ...queryParams };
        if (leagueId) {
            params['league_id'] = leagueId;
        }
        else if (!params['league_id']) {
            // If no leagueId is provided in args or queryParams, default to NBA
            params['league_id'] = 'NBA';
        }
        return this.request(endpoint, 'GET', undefined, undefined, params);
    }
    async fetchProjectionById(projectionId) {
        const endpoint = `/projections/${projectionId}`;
        return this.request(endpoint);
    }
    async fetchLeagues() {
        const endpoint = '/leagues';
        return this.request(endpoint);
    }
    async fetchStatTypes() {
        const endpoint = '/stat_types';
        return this.request(endpoint);
    }
    async fetchPlayerById(playerId) {
        const endpoint = `/new_players/${playerId}`;
        return this.request(endpoint);
    }
}
