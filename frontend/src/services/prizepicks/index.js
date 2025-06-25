import { logger } from '../logger';
import { cache } from '../cache';
import MLService from '../ml';
import { adapterManager } from '../adapters';
import { measurePerformance, handleApiError, transformData } from '../utils';
export class PrizePicksService {
    constructor(config) {
        this.config = config;
        this.mlService = MLService.getInstance();
        this.adapter = adapterManager.getAdapter('prizepicks');
    }
    static getInstance(config) {
        if (!PrizePicksService.instance) {
            if (!config) {
                throw new Error('PrizePicksService configuration is required for initialization');
            }
            PrizePicksService.instance = new PrizePicksService(config);
        }
        return PrizePicksService.instance;
    }
    async getAvailableProps(params) {
        try {
            const cacheKey = `props:${JSON.stringify(params)}`;
            const cachedProps = await cache.get(cacheKey);
            if (cachedProps) {
                return cachedProps;
            }
            const props = await this.fetchProps(params);
            await cache.set(cacheKey, props);
            return props;
        }
        catch (error) {
            logger.error('Failed to fetch props', { error, params });
            throw new Error('Failed to fetch props: ' + error.message);
        }
    }
    async fetchProps(params) {
        // Implementation of prop fetching logic
        return [];
    }
    async generateOptimizedLineup(params) {
        try {
            const { predictions, props, investmentAmount, strategyMode, portfolioSize } = params;
            // Filter props based on predictions and strategy
            const filteredProps = this.filterPropsByStrategy(props, predictions, strategyMode);
            // Calculate optimal portfolio
            const portfolio = this.calculateOptimalPortfolio(filteredProps, investmentAmount, portfolioSize);
            return portfolio;
        }
        catch (error) {
            logger.error('Failed to generate lineup', { error, params });
            throw new Error('Failed to generate lineup: ' + error.message);
        }
    }
    filterPropsByStrategy(props, predictions, strategyMode) {
        // Implementation of strategy-based filtering
        return props;
    }
    calculateOptimalPortfolio(props, investmentAmount, portfolioSize) {
        // Implementation of portfolio optimization
        return [];
    }
    calculateMultiplier(portfolioSize) {
        const multipliers = {
            2: 3,
            3: 5,
            4: 10,
            5: 20,
            6: 40,
        };
        return multipliers[portfolioSize] || 1;
    }
    async fetchProjections(league, statType) {
        return measurePerformance(async () => {
            try {
                const data = await this.adapter.fetchProps({
                    sports: league ? [league] : [],
                    timeWindow: statType || '',
                });
                const projections = data ?? [];
                return transformData(projections, this.transformProjections, 'prizepicks.fetchProjections');
            }
            catch (error) {
                handleApiError(error, 'prizepicks.fetchProjections');
                return []; // Return empty array on error
            }
        }, 'prizepicks.fetchProjections');
    }
    async fetchPlayerDetails(playerId) {
        return measurePerformance(async () => {
            try {
                const data = await this.adapter.fetchPlayers({ sports: [] }); // No playerId-based fetch, fallback to fetching all and filtering
                const player = Array.isArray(data) ? data.find(p => p.id === playerId) : undefined;
                return transformData(player, this.transformPlayerDetails, 'prizepicks.fetchPlayerDetails');
            }
            catch (error) {
                handleApiError(error, 'prizepicks.fetchPlayerDetails');
            }
        }, 'prizepicks.fetchPlayerDetails');
    }
    async fetchLines(propId) {
        return measurePerformance(async () => {
            try {
                const data = await this.adapter.fetchLines({ propIds: [propId] });
                const lines = data ?? null;
                return transformData(lines, this.transformLines, 'prizepicks.fetchLines');
            }
            catch (error) {
                handleApiError(error, 'prizepicks.fetchLines');
                return null; // Return null on error
            }
        }, 'prizepicks.fetchLines');
    }
    transformProjections(data) {
        return data.map((proj) => ({
            id: proj.id,
            league: proj.relationships?.league?.data?.id || 'Unknown',
            player_name: proj.attributes.description.split(' ')[0] || 'Unknown Player',
            stat_type: proj.attributes.stat_type,
            line_score: proj.attributes.line_score,
            description: proj.attributes.description,
            start_time: proj.attributes.start_time,
            status: proj.attributes.status,
            image_url: proj.attributes.custom_image_url,
            projection_type: proj.attributes.projection_type,
            overOdds: undefined,
            underOdds: undefined,
            playerId: proj.relationships?.new_player?.data?.id,
            player: undefined,
        }));
    }
    transformPlayerDetails(data) {
        return {
            id: data.id,
            name: data.attributes.name,
            team: data.attributes.team_name,
            position: data.attributes.position,
            image_url: data.attributes.image_url,
        };
    }
    transformLines(data) {
        // If data is an array, return the first element or an empty array as fallback
        if (Array.isArray(data)) {
            return data.length > 0 ? data[0] : [];
        }
        return data;
        // Removed unreachable/incorrect return statement. Only return processed data above.
    }
    parseOdds(ptOld, type) {
        if (!ptOld)
            return undefined;
        const parts = ptOld.toLowerCase().split(' ');
        const part = parts.find(p => p.startsWith(type));
        if (!part)
            return undefined;
        const val = parseInt(part.substring(1));
        return isNaN(val) ? undefined : val;
    }
}
export default PrizePicksService;
