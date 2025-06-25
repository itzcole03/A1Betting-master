import { apiService } from './api';
class StrategyService {
    constructor() {
        this.activeStrategies = new Map();
    }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async getStrategies() {
        try {
            const response = await apiService.getStrategies();
            return response;
        }
        catch (error) {
            console.error('Failed to fetch strategies:', error);
            throw error;
        }
    }
    async analyzeStrategy(strategyId) {
        try {
            const response = await apiService.analyzeStrategy(strategyId);
            return response;
        }
        catch (error) {
            console.error('Failed to analyze strategy:', error);
            throw error;
        }
    }
    async executeStrategy(strategyId) {
        try {
            const response = await apiService.executeStrategy(strategyId);
            return response;
        }
        catch (error) {
            console.error('Failed to execute strategy:', error);
            throw error;
        }
    }
    async getStrategyPerformance(strategyId) {
        try {
            const response = await apiService.getStrategyPerformance(strategyId);
            return response;
        }
        catch (error) {
            console.error('Failed to fetch strategy performance:', error);
            throw error;
        }
    }
    async getStrategyHistory(strategyId) {
        try {
            const response = await apiService.getStrategyHistory(strategyId);
            return response;
        }
        catch (error) {
            console.error('Failed to fetch strategy history:', error);
            throw error;
        }
    }
    activateStrategy(strategy) {
        this.activeStrategies.set(strategy.id, strategy);
    }
    deactivateStrategy(strategyId) {
        this.activeStrategies.delete(strategyId);
    }
    getActiveStrategies() {
        return Array.from(this.activeStrategies.values());
    }
    isStrategyActive(strategyId) {
        return this.activeStrategies.has(strategyId);
    }
    async updateStrategySettings(strategyId, settings) {
        try {
            await apiService.updateStrategySettings(strategyId, settings);
        }
        catch (error) {
            console.error('Failed to update strategy settings:', error);
            throw error;
        }
    }
    async getStrategyRecommendations() {
        try {
            const response = await apiService.getStrategyRecommendations();
            return response;
        }
        catch (error) {
            console.error('Failed to fetch strategy recommendations:', error);
            throw error;
        }
    }
}
export const strategyService = StrategyService.getInstance();
export default strategyService;
