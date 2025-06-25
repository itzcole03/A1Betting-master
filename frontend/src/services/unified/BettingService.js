import axios from 'axios';
import { toast } from 'react-toastify';
import { WebSocketManager } from './WebSocketManager';
import { RiskProfileType, } from '../../types/betting';
class UnifiedBettingService {
    constructor() {
        this.config = {
            minConfidence: 0.7,
            maxStakePercentage: 0.1,
            riskProfile: RiskProfileType.MODERATE,
            autoRefresh: true,
            refreshInterval: 30000,
        };
        this.apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        this.wsService = WebSocketManager.getInstance();
        this.initializeWebSocketHandlers();
    }
    static getInstance() {
        if (!UnifiedBettingService.instance) {
            UnifiedBettingService.instance = new UnifiedBettingService();
        }
        return UnifiedBettingService.instance;
    }
    initializeWebSocketHandlers() {
        this.wsService.on('odds_update', this.handleOddsUpdate.bind(this));
        this.wsService.on('betting_opportunities', this.handleBettingOpportunities.bind(this));
        this.wsService.on('bet_result', this.handleBetResult.bind(this));
    }
    handleOddsUpdate(data) {
        this.emit('odds_update', data);
    }
    handleBettingOpportunities(data) {
        const opportunities = this.validateBettingOpportunities(data.opportunities);
        this.emit('betting_opportunities', { opportunities });
    }
    handleBetResult(data) {
        this.updateBettingMetrics(data.result);
        this.emit('bet_result', data.result);
    }
    validateBettingOpportunities(opportunities) {
        return opportunities.filter((opportunity) => {
            const confidence = this.calculateOpportunityConfidence(opportunity);
            return confidence >= this.config.minConfidence;
        });
    }
    calculateOpportunityConfidence(opportunity) {
        // Use only fields that exist on BettingOpportunity
        return opportunity.confidence;
    }
    updateBettingMetrics(result) {
        this.emit('metrics_update', this.calculateMetrics(result));
    }
    calculateMetrics(result) {
        return {
            ...result,
            totalBets: (result.totalBets ?? 0) + 1,
            winRate: this.calculateWinRate(result),
            averageOdds: this.calculateAverageOdds(result),
            roi: this.calculateROI(result),
        };
    }
    calculateWinRate(result) {
        const wins = result.winningBets ?? 0;
        const total = result.totalBets ?? 1;
        return total === 0 ? 0 : wins / total;
    }
    calculateAverageOdds(result) {
        return result.averageOdds ?? 0;
    }
    calculateROI(result) {
        const profit = result.totalProfit ?? 0;
        const totalStaked = result.totalStake ?? 1;
        return totalStaked === 0 ? 0 : (profit / totalStaked) * 100;
    }
    async getBettingOpportunities() {
        try {
            const { data } = await axios.get(`${this.apiUrl}/api/betting/opportunities`);
            return this.validateBettingOpportunities(data);
        }
        catch (error) {
            console.error('Error fetching betting opportunities:', error);
            toast.error('Failed to fetch betting opportunities');
            return [];
        }
    }
    async placeBet(bet) {
        try {
            await axios.post(`${this.apiUrl}/api/betting/place`, bet);
            this.emit('bet_placed', bet);
            return true;
        }
        catch (error) {
            console.error('Error placing bet:', error);
            toast.error('Failed to place bet');
            return false;
        }
    }
    async getBettingMetrics() {
        try {
            const { data } = await axios.get(`${this.apiUrl}/api/betting/metrics`);
            return data;
        }
        catch (error) {
            console.error('Error fetching betting metrics:', error);
            return {
                totalBets: 0,
                winningBets: 0,
                losingBets: 0,
                totalStake: 0,
                totalProfit: 0,
                roi: 0,
                winRate: 0,
                averageOdds: 0,
                averageStake: 0,
                riskScore: 0,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getBetHistory() {
        try {
            const { data } = await axios.get(`${this.apiUrl}/api/betting/history`);
            return data;
        }
        catch (error) {
            console.error('Error fetching bet history:', error);
            return [];
        }
    }
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.emit('config_updated', this.config);
    }
    getConfig() {
        return { ...this.config };
    }
    emit(_type, _data) {
        // No-op: implement as needed for your architecture.
    }
    async get(url) {
        try {
            const response = await axios.get(`${this.apiUrl}${url}`);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            toast.error(`Failed to fetch data from ${url}`);
            throw error;
        }
    }
    async post(url, data) {
        try {
            const response = await axios.post(`${this.apiUrl}${url}`, data);
            return response.data;
        }
        catch (error) {
            toast.error(`Failed to post data to ${url}`);
            throw error;
        }
    }
}
UnifiedBettingService.instance = null;
export default UnifiedBettingService;
