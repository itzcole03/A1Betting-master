import { EventBus } from '../core/EventBus';
import { UnifiedConfigManager } from '../core/UnifiedConfigManager.ts';
export class ArbitrageService {
    constructor() {
        this.isScanning = false;
        this.eventBus = EventBus.getInstance();
        this.configManager = UnifiedConfigManager.getInstance();
        this.config = this.initializeConfig();
        this.opportunities = new Map();
        this.marketData = new Map();
        this.setupEventListeners();
        this.startScanning();
    }
    static getInstance() {
        if (!ArbitrageService.instance) {
            ArbitrageService.instance = new ArbitrageService();
        }
        return ArbitrageService.instance;
    }
    initializeConfig() {
        const config = this.configManager.getConfig();
        return {
            minProfitMargin: 0.02, // 2%
            maxExposure: 1000,
            minOdds: 1.1,
            maxOdds: 10.0,
            maxBetDelay: 5000, // 5 seconds
            refreshInterval: 1000 // 1 second
        };
    }
    setupEventListeners() {
        this.eventBus.on('odds:update', async (event) => {
            try {
                const { propId, bookId, odds } = event.data;
                this.updateMarketData(propId, bookId, odds);
                await this.checkForArbitrage(propId);
            }
            catch (error) {
                console.error('Error handling odds update:', error);
            }
        });
        this.eventBus.on('market:update', async (event) => {
            try {
                const { id: propId, books } = event.data;
                for (const [bookId, odds] of Object.entries(books)) {
                    this.updateMarketData(propId, bookId, odds);
                }
                await this.checkForArbitrage(propId);
            }
            catch (error) {
                console.error('Error handling market update:', error);
            }
        });
        this.eventBus.on('bet:placed', (event) => {
            const { bet } = event.data;
            this.updateOpportunityStatus(bet.opportunity.id, 'executed');
        });
    }
    updateMarketData(propId, bookId, odds) {
        if (!this.marketData.has(propId)) {
            this.marketData.set(propId, {
                odds: new Map(),
                lastUpdate: Date.now()
            });
        }
        const market = this.marketData.get(propId);
        market.odds.set(bookId, odds);
        market.lastUpdate = Date.now();
        // Clean up old market data
        for (const [id, data] of this.marketData) {
            if (Date.now() - data.lastUpdate > 3600000) { // 1 hour
                this.marketData.delete(id);
            }
        }
    }
    startScanning() {
        setInterval(async () => {
            if (this.isScanning)
                return;
            this.isScanning = true;
            try {
                await this.scanAllMarkets();
            }
            catch (error) {
                console.error('Error scanning markets:', error);
            }
            finally {
                this.isScanning = false;
            }
        }, this.config.refreshInterval);
    }
    async scanAllMarkets() {
        const startTime = Date.now();
        let opportunitiesFound = 0;
        for (const [propId, market] of this.marketData) {
            if (Date.now() - market.lastUpdate > 60000)
                continue; // Skip stale markets
            await this.checkForArbitrage(propId);
            opportunitiesFound += this.opportunities.size;
        }
        // Emit metrics
        this.eventBus.emit('metric:recorded', {
            name: 'arbitrage_scan_duration',
            value: Date.now() - startTime,
            timestamp: Date.now(),
            labels: {
                markets_scanned: String(this.marketData.size),
                opportunities_found: String(opportunitiesFound)
            }
        });
    }
    async checkForArbitrage(propId) {
        const market = this.marketData.get(propId);
        if (!market || market.odds.size < 2)
            return;
        const opportunities = this.findArbitrageOpportunities(market.odds);
        for (const opportunity of opportunities) {
            if (this.isValidOpportunity(opportunity)) {
                this.opportunities.set(opportunity.id, opportunity);
                // Emit opportunity found event
                this.eventBus.emit('data:updated', {
                    sourceId: 'arbitrage',
                    data: [opportunity]
                });
            }
        }
        // Clean up expired opportunities
        for (const [id, opportunity] of this.opportunities) {
            if (Date.now() - opportunity.timestamp > this.config.maxBetDelay) {
                this.updateOpportunityStatus(id, 'expired');
            }
        }
    }
    findArbitrageOpportunities(odds) {
        const opportunities = [];
        const oddsArray = Array.from(odds.entries());
        for (let i = 0; i < oddsArray.length; i++) {
            for (let j = i + 1; j < oddsArray.length; j++) {
                const [book1Id, odds1] = oddsArray[i];
                const [book2Id, odds2] = oddsArray[j];
                if (odds1.odds < this.config.minOdds ||
                    odds1.odds > this.config.maxOdds ||
                    odds2.odds < this.config.minOdds ||
                    odds2.odds > this.config.maxOdds) {
                    continue;
                }
                const arbitrage = this.calculateArbitrage(odds1, odds2);
                if (arbitrage) {
                    opportunities.push({
                        id: `${book1Id}-${book2Id}-${Date.now()}`,
                        timestamp: Date.now(),
                        profitMargin: arbitrage.profitMargin,
                        totalStake: arbitrage.totalStake,
                        expectedProfit: arbitrage.expectedProfit,
                        legs: [
                            {
                                bookId: book1Id,
                                propId: odds1.propId,
                                odds: odds1.odds,
                                stake: arbitrage.stake1,
                                maxStake: odds1.maxStake
                            },
                            {
                                bookId: book2Id,
                                propId: odds2.propId,
                                odds: odds2.odds,
                                stake: arbitrage.stake2,
                                maxStake: odds2.maxStake
                            }
                        ],
                        risk: {
                            exposure: arbitrage.totalStake,
                            confidence: this.calculateConfidence(odds1, odds2),
                            timeSensitivity: this.calculateTimeSensitivity(odds1, odds2)
                        },
                        status: 'pending'
                    });
                }
            }
        }
        return opportunities;
    }
    calculateArbitrage(odds1, odds2) {
        const impliedProb1 = 1 / odds1.odds;
        const impliedProb2 = 1 / odds2.odds;
        const totalImpliedProb = impliedProb1 + impliedProb2;
        if (totalImpliedProb >= 1)
            return null; // No arbitrage opportunity
        const profitMargin = 1 - totalImpliedProb;
        if (profitMargin < this.config.minProfitMargin)
            return null;
        // Calculate optimal stakes for a $100 total stake
        const totalStake = Math.min(this.config.maxExposure, Math.min(odds1.maxStake, odds2.maxStake));
        const stake1 = (totalStake * impliedProb1) / totalImpliedProb;
        const stake2 = (totalStake * impliedProb2) / totalImpliedProb;
        return {
            profitMargin,
            totalStake,
            expectedProfit: totalStake * profitMargin,
            stake1,
            stake2
        };
    }
    calculateConfidence(odds1, odds2) {
        // Calculate confidence based on:
        // 1. Time since last odds update
        // 2. Historical odds volatility
        // 3. Book reliability
        const timeSinceUpdate = Math.max(Date.now() - odds1.timestamp, Date.now() - odds2.timestamp);
        const timeWeight = Math.max(0, 1 - timeSinceUpdate / this.config.maxBetDelay);
        return timeWeight; // Simplified confidence calculation
    }
    calculateTimeSensitivity(odds1, odds2) {
        // Calculate time sensitivity based on:
        // 1. Historical odds movement speed
        // 2. Market liquidity
        // 3. Time until event
        return 0.5; // Simplified time sensitivity calculation
    }
    isValidOpportunity(opportunity) {
        // Check if the opportunity is still valid
        return (opportunity.profitMargin >= this.config.minProfitMargin &&
            opportunity.totalStake <= this.config.maxExposure &&
            opportunity.risk.confidence >= 0.5 &&
            Date.now() - opportunity.timestamp <= this.config.maxBetDelay &&
            opportunity.legs.every(leg => leg.odds >= this.config.minOdds &&
                leg.odds <= this.config.maxOdds &&
                leg.stake <= leg.maxStake));
    }
    updateOpportunityStatus(id, status) {
        const opportunity = this.opportunities.get(id);
        if (opportunity) {
            opportunity.status = status;
            if (status === 'expired' || status === 'executed' || status === 'failed') {
                this.opportunities.delete(id);
            }
        }
    }
    getOpportunities() {
        return Array.from(this.opportunities.values());
    }
    getOpportunity(id) {
        return this.opportunities.get(id);
    }
    clearOpportunities() {
        this.opportunities.clear();
    }
    isMarketActive(propId) {
        const market = this.marketData.get(propId);
        return !!market && Date.now() - market.lastUpdate <= 60000;
    }
    getMarketData(propId) {
        return this.marketData.get(propId)?.odds;
    }
    clearMarketData() {
        this.marketData.clear();
    }
}
