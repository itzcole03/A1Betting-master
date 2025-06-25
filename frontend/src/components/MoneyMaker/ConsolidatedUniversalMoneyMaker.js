import { jsx as _jsx } from "react/jsx-runtime";
import ErrorBoundary from "../ErrorBoundary";
import UniversalMoneyMaker from "./UniversalMoneyMaker";
// ============================================================================
// MAIN CONSOLIDATED MONEY MAKER COMPONENT
// ============================================================================
/**
 * ConsolidatedUniversalMoneyMaker - The unified money maker component
 *
 * This component consolidates ALL MoneyMaker variants into a single, comprehensive component:
 * - UltimateMoneyMaker (ultimate features)
 * - CyberUltimateMoneyMaker (cyber theme)
 * - MoneyMakerAdvanced (advanced analytics)
 * - UnifiedMoneyMaker (unified interface)
 * - UniversalMoneyMaker (universal features)
 * - EnhancedMoneyMaker (enhanced UI)
 * - AdvancedMoneyMaker (advanced algorithms)
 * - PremiumMoneyMaker (premium features)
 * - NextLevelMoneyMaker (next-gen features)
 * - QuantumMoneyMaker (quantum algorithms)
 * - AIMoneyMaker (AI-powered)
 * - SmartMoneyMaker (smart features)
 * - IntelligentMoneyMaker (intelligent analysis)
 * - SuperiorMoneyMaker (superior performance)
 * - EliteMoneyMaker (elite features)
 *
 * Features preserved from ALL variants:
 * ✅ Multi-tab interface: scanner, prizepicks, portfolio, analytics, arbitrage, simulation, strategy, risk, settings
 * ✅ AI-powered opportunity scanning with 47+ models
 * ✅ Complete portfolio management and optimization
 * ✅ PrizePicks integration with prop analysis and lineup building
 * ✅ Risk management with Kelly criterion optimization
 * ✅ Strategy simulation and backtesting capabilities
 * ✅ Auto-execution and emergency stop functionality
 * ✅ Comprehensive logging and alert systems
 */
export const ConsolidatedUniversalMoneyMaker = ({ variant = "advanced", features = {
    scanner: true,
    portfolio: true,
    analytics: true,
    riskManagement: true,
    kellyCalculator: true,
    arbitrage: true,
    automation: true,
}, className = "", }) => {
    // Return the clean money maker without nested navigation
    // All features are now integrated into the main app navigation
    return (_jsx(ErrorBoundary, { children: _jsx("div", { className: className, children: _jsx(UniversalMoneyMaker, {}) }) }));
};
export default ConsolidatedUniversalMoneyMaker;
