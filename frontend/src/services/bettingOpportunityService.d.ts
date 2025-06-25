import { EventEmitter } from 'events';
import { Notification } from './notification/notificationManager';
import { Sportsbook } from '@/types/betting';
import { NotificationPreferences } from './notification/notificationManager';
interface VolumeData {
    totalVolume: number;
    lastUpdate: number;
    volumeHistory: Array<{
        timestamp: number;
        volume: number;
    }>;
}
interface MarketMetrics {
    volume: VolumeData;
    liquidity: number;
    volatility: number;
    trend: number;
}
export declare class BettingOpportunityService extends EventEmitter {
    private static instance;
    private arbitrageService;
    private lineShoppingService;
    private predictionService;
    private advancedPredictionService;
    private marketAnalysisService;
    private notificationManager;
    private isMonitoring;
    private marketMetrics;
    private readonly VOLUME_WINDOW;
    private readonly CLEANUP_INTERVAL;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): BettingOpportunityService;
    /**
     * Start monitoring for betting opportunities
     */
    startMonitoring(): void;
    /**
     * Stop monitoring for betting opportunities
     */
    stopMonitoring(): void;
    /**
     * Handle new arbitrage opportunities
     */
    private handleArbitrageOpportunity;
    private updateMarketMetrics;
    private calculateLiquidity;
    private calculateVolatility;
    private calculateTrend;
    /**
     * Handle odds updates from line shopping service
     */
    private handleOddsUpdate;
    private handlePrediction;
    private handleAdvancedPrediction;
    private handleMarketAnomaly;
    private handleMarketEfficiency;
    /**
     * Register a sportsbook for line shopping
     */
    registerSportsbook(sportsbook: Sportsbook): void;
    /**
     * Update notification preferences
     */
    updateNotificationPreferences(preferences: Partial<NotificationPreferences>): void;
    /**
     * Get all current notifications
     */
    getNotifications(): Notification[];
    /**
     * Mark notification as read
     */
    markNotificationAsRead(notificationId: string): void;
    /**
     * Clear expired opportunities and notifications
     */
    cleanup(): void;
    /**
     * Get current monitoring status
     */
    isActive(): boolean;
    getMarketMetrics(eventId: string): MarketMetrics | undefined;
}
export {};
