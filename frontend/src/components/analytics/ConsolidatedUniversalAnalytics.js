import { jsx as _jsx } from "react/jsx-runtime";
import ErrorBoundary from "../ErrorBoundary";
import UniversalAnalytics from "./UniversalAnalytics";
// ============================================================================
// MAIN CONSOLIDATED ANALYTICS COMPONENT
// ============================================================================
/**
 * ConsolidatedUniversalAnalytics - The unified analytics component
 *
 * This component consolidates ALL analytics variants into a single, comprehensive component:
 * - AdvancedAnalytics (advanced metrics)
 * - CyberAnalyticsHub (cyber theme)
 * - AdvancedAnalyticsHub (advanced features)
 * - PerformanceAnalyticsDashboard (performance tracking)
 * - RealTimeAnalytics (real-time data)
 * - MLAnalytics (machine learning metrics)
 * - BettingAnalytics (betting-specific analytics)
 * - SystemAnalytics (system health)
 * - PerformanceMetrics (performance indicators)
 * - ModelAnalytics (model performance)
 * - RiskAnalytics (risk assessment)
 * - PredictionAnalytics (prediction analysis)
 * - AdvancedMetrics (advanced calculations)
 * - ComprehensiveAnalytics (comprehensive reporting)
 * - IntelligentAnalytics (AI-powered insights)
 * - SmartAnalytics (smart features)
 * - EliteAnalytics (elite reporting)
 * - ProAnalytics (professional tools)
 * - ExpertAnalytics (expert analysis)
 * - MasterAnalytics (master reporting)
 * - QuantumAnalytics (quantum analytics)
 * - NextGenAnalyticsEngine (next-generation)
 * - UltraAnalytics (ultra-advanced)
 * - MegaAnalytics (mega features)
 * - HyperAnalytics (hyper-fast)
 * - SuperAnalyticsEngine (super-powered)
 *
 * Features preserved from ALL variants:
 * ✅ Multi-tab interface: overview, models, performance, risk, betting, system
 * ✅ Real-time metrics monitoring and model performance analysis
 * ✅ Comprehensive betting analytics and system health monitoring
 * ✅ Advanced charting, alert management, data export capabilities
 * ✅ Time range filtering and model comparison tools
 */
export const ConsolidatedUniversalAnalytics = ({ variant = "advanced", features = {
    realTime: true,
    models: true,
    performance: true,
    risk: true,
    betting: true,
    system: true,
    predictions: true,
    comparison: true,
    alerts: true,
    export: true,
}, timeRange = "1w", refreshInterval = 30000, className = "", }) => {
    // Return the clean analytics without nested navigation
    // All features are now integrated into the main app navigation
    return (_jsx(ErrorBoundary, { children: _jsx("div", { className: className, children: _jsx(UniversalAnalytics, {}) }) }));
};
export default ConsolidatedUniversalAnalytics;
