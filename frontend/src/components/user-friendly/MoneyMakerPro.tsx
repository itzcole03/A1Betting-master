import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  ShieldCheckIcon,
  CalculatorIcon,
  ChartPieIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  MinusIcon,
  InformationCircleIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon as ActivityIcon,
} from '@heroicons/react/24/outline';
import { productionApiService, api } from "@/services/api/ProductionApiService";
import { logger, logUserAction, logError } from "@/utils/logger";
import OfflineIndicator from "@/components/ui/OfflineIndicator";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface BettingOpportunity {
  id: string;
  sport: string;
  game: string;
  betType: string;
  line: number;
  odds: number;
  bookmaker: string;
  expectedValue: number;
  confidence: number;
  edge: number;
  stake: number;
  potentialProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: 'value' | 'arbitrage' | 'sure-bet';
  expires: string;
}

interface PortfolioPosition {
  id: string;
  betId: string;
  sport: string;
  description: string;
  stake: number;
  odds: number;
  potentialReturn: number;
  status: 'pending' | 'won' | 'lost' | 'pushed';
  placedAt: string;
  settledAt?: string;
  profit?: number;
}

interface BankrollConfig {
  totalBankroll: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  maxBetPercent: number;
  kellyMultiplier: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  minBetAmount: number;
  maxBetAmount: number;
}

interface PerformanceMetrics {
  totalProfit: number;
  totalStaked: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  streakCurrent: number;
  streakBest: number;
  totalBets: number;
  winningBets: number;
  losingBets: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateKellyStake = (odds: number, winProbability: number, bankroll: number, multiplier: number = 0.25): number => {
  const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
  const kellyFraction = (winProbability * decimalOdds - 1) / (decimalOdds - 1);
  return Math.max(0, Math.min(bankroll * kellyFraction * multiplier, bankroll * 0.05));
};

const calculateExpectedValue = (odds: number, winProbability: number, stake: number): number => {
  const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
  return (winProbability * stake * (decimalOdds - 1)) - ((1 - winProbability) * stake);
};

// Calculate Kelly values for the calculator
const calculateKellyValues = (odds: number, winProbability: number, bankroll: number) => {
  const winProb = winProbability / 100;
  const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
  const kellyFraction = (winProb * decimalOdds - 1) / (decimalOdds - 1);
  const kellyPercent = Math.max(0, kellyFraction * 100);
  const suggestedStake = Math.max(0, bankroll * kellyFraction);
  const maxRisk = Math.min(suggestedStake * 2, bankroll * (0.05));
  
  return {
    kellyPercent,
    suggestedStake,
    maxRisk
  };
};

const formatOdds = (odds: number): string => {
  return odds > 0 ? `+${odds}` : `${odds}`;
};

const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MoneyMakerPro: React.FC = () => {
  // State management
  const [opportunities, setOpportunities] = useState<BettingOpportunity[]>([]);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [bankrollConfig, setBankrollConfig] = useState<BankrollConfig>({
    totalBankroll: 10000,
    riskTolerance: 'moderate',
    maxBetPercent: 5,
    kellyMultiplier: 0.25,
    stopLossPercent: 20,
    takeProfitPercent: 50,
    minBetAmount: 25,
    maxBetAmount: 500,
  });
  
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics' | 'settings'>('opportunities');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBankroll, setShowBankroll] = useState(false);
  const [autoStaking, setAutoStaking] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'value' | 'arbitrage' | 'sure-bet'>('all');
  const [sortBy, setSortBy] = useState<'ev' | 'edge' | 'confidence' | 'expiry'>('ev');
  
  // Kelly Calculator state
  const [kellyInputs, setKellyInputs] = useState({
    odds: -110,
    winProbability: 55,
    edge: 5
  });

  // Production error handling - no mock data fallbacks
  const handleApiError = (error: Error, context: string) => {
    logError(error, context);
    setError(`Failed to load ${context.toLowerCase()}. Please check your connection and try again.`);
    logger.error(`API Error in ${context}:`, error);
  };

  // Data fetching functions
  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getBettingOpportunities({
        sport: 'all',
        minEdge: 2.0
      });
      
      if (response.success && response.data) {
        const data = response.data.map((opp: any) => ({
          id: opp.id,
          sport: opp.sport,
          game: opp.event,
          betType: opp.market,
          line: opp.odds,
          odds: opp.odds,
          bookmaker: opp.bookmaker || 'DraftKings',
          expectedValue: opp.expectedValue * 100, // Convert to percentage
          confidence: opp.confidence,
          edge: opp.expectedValue * 100,
          stake: 0,
          potentialProfit: 0,
          riskLevel: opp.riskLevel,
          category: 'value' as const,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }));
        setOpportunities(data);
        logger.info('Successfully fetched betting opportunities', { count: data.length });
      } else {
        throw new Error(response.error || 'Failed to fetch betting opportunities');
      }
    } catch (err) {
      handleApiError(err as Error, 'MoneyMakerPro.fetchOpportunities');
      setOpportunities([]); // Empty array instead of mock data
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchArbitrageOpportunities = useCallback(async () => {
    try {
      const response = await api.getArbitrageOpportunities();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      logError(err as Error, 'MoneyMakerPro.fetchArbitrageOpportunities');
      return [];
    }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await api.getPortfolioAnalysis('user123');
      if (response.success && response.data) {
        // Convert API response to portfolio positions
        const positions: PortfolioPosition[] = response.data.positions?.map((pos: any) => ({
          id: pos.id,
          betId: pos.betId,
          sport: pos.sport,
          description: pos.description,
          stake: pos.stake,
          odds: pos.odds,
          potentialReturn: pos.potentialReturn,
          status: pos.status,
          placedAt: pos.placedAt,
          profit: pos.profit,
        })) || [];
        setPortfolio(positions);
      } else {
        setPortfolio([]);
      }
    } catch (err) {
      handleApiError(err as Error, 'MoneyMakerPro.fetchPortfolio');
      setPortfolio([]);
    }
  }, []);

  const fetchPerformance = useCallback(async () => {
    try {
      const response = await api.getPortfolioAnalysis('user123');
      if (response.success && response.data) {
        const data = response.data;
        setPerformance({
          totalProfit: data.totalProfit || 0,
          totalStaked: data.totalValue || 0,
          roi: data.totalValue ? ((data.totalProfit || 0) / data.totalValue) * 100 : 0,
          winRate: (data.winRate || 0) * 100,
          avgOdds: data.avgOdds || 0,
          profitFactor: data.profitFactor || 0,
          sharpeRatio: data.sharpeRatio || 0,
          maxDrawdown: data.maxDrawdown || 0,
          streakCurrent: data.streakCurrent || 0,
          streakBest: data.streakBest || 0,
          totalBets: data.totalBets || 0,
          winningBets: data.winningBets || 0,
          losingBets: data.losingBets || 0,
        });
      } else {
        // Initialize with zeros if no data available
        setPerformance({
          totalProfit: 0,
          totalStaked: 0,
          roi: 0,
          winRate: 0,
          avgOdds: 0,
          profitFactor: 0,
          sharpeRatio: 0,
          maxDrawdown: 0,
          streakCurrent: 0,
          streakBest: 0,
          totalBets: 0,
          winningBets: 0,
          losingBets: 0,
        });
      }
    } catch (err) {
      handleApiError(err as Error, 'MoneyMakerPro.fetchPerformance');
      // Initialize with zeros on error
      setPerformance({
        totalProfit: 0,
        totalStaked: 0,
        roi: 0,
        winRate: 0,
        avgOdds: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        streakCurrent: 0,
        streakBest: 0,
        totalBets: 0,
        winningBets: 0,
        losingBets: 0,
      });
    }
  }, []);

  // Effects
  useEffect(() => {
    logUserAction('money_maker_pro_opened', { 
      bankroll: bankrollConfig.totalBankroll,
      riskTolerance: bankrollConfig.riskTolerance 
    });
    fetchOpportunities();
    fetchPortfolio();
    fetchPerformance();
    
    // Fetch arbitrage opportunities
    fetchArbitrageOpportunities().then(setArbitrageOpportunities);
  }, [fetchOpportunities, fetchPortfolio, fetchPerformance, fetchArbitrageOpportunities, bankrollConfig.riskTolerance, bankrollConfig.totalBankroll]);

  // Auto-calculate stakes when opportunities change
  useEffect(() => {
    if (autoStaking && opportunities.length > 0) {
      const updatedOpportunities = opportunities.map(opp => {
        const winProbability = opp.confidence / 100;
        const kellyStake = calculateKellyStake(opp.odds, winProbability, bankrollConfig.totalBankroll, bankrollConfig.kellyMultiplier);
        const finalStake = Math.max(
          bankrollConfig.minBetAmount,
          Math.min(kellyStake, bankrollConfig.maxBetAmount, bankrollConfig.totalBankroll * (bankrollConfig.maxBetPercent / 100))
        );
        
        return {
          ...opp,
          stake: finalStake,
          potentialProfit: finalStake * (Math.abs(opp.odds) / 100),
        };
      });
      
      setOpportunities(updatedOpportunities);
    }
  }, [autoStaking, bankrollConfig, opportunities]);

  // Event handlers
  const handleStakeChange = (opportunityId: string, newStake: number) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId 
        ? { 
            ...opp, 
            stake: newStake,
            potentialProfit: newStake * (Math.abs(opp.odds) / 100)
          }
        : opp
    ));
    logUserAction('stake_adjusted', { opportunityId, newStake });
  };

  const handlePlaceBet = async (opportunity: BettingOpportunity) => {
    try {
      const response = await productionApiService.post('/api/bets/place', {
        opportunityId: opportunity.id,
        stake: opportunity.stake,
        odds: opportunity.odds,
      });
      
      if (response.success) {
        logUserAction('bet_placed', { 
          opportunityId: opportunity.id,
          stake: opportunity.stake,
          potentialProfit: opportunity.potentialProfit 
        });
        
        // Remove from opportunities and refresh portfolio
        setOpportunities(prev => prev.filter(opp => opp.id !== opportunity.id));
        fetchPortfolio();
        
        alert(`Bet placed successfully! Stake: $${opportunity.stake}`);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      logError(err as Error, 'MoneyMakerPro.handlePlaceBet');
      alert('Failed to place bet. Please try again.');
    }
  };

  // Filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    const filtered = opportunities.filter(opp => 
      selectedFilter === 'all' || opp.category === selectedFilter
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ev':
          return b.expectedValue - a.expectedValue;
        case 'edge':
          return b.edge - a.edge;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'expiry':
          return new Date(a.expires).getTime() - new Date(b.expires).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [opportunities, selectedFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <OfflineIndicator 
        show={!!error} 
        service="Betting API"
        onRetry={fetchOpportunities}
      />
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  MoneyMaker Pro
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 ml-6">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bankroll:</span>
                  <button
                    onClick={() => setShowBankroll(!showBankroll)}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-sm font-medium"
                  >
                    {showBankroll ? (
                      <>
                        <span>${bankrollConfig.totalBankroll.toLocaleString()}</span>
                        <EyeSlashIcon className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <span>••••••</span>
                        <EyeIcon className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
                {performance && (
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    ROI: {performance.roi.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoStaking(!autoStaking)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  autoStaking
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
                title="Toggle auto-staking with Kelly Criterion"
              >
                <CalculatorIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={fetchOpportunities}
                disabled={isLoading}
                className="p-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                title="Refresh opportunities"
              >
                <ArrowPathIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
              <button 
                onClick={fetchOpportunities}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Performance Summary Cards */}
        {performance && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Profit</p>
                  <p className={`text-2xl font-bold ${performance.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${performance.totalProfit.toLocaleString()}
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Win Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {performance.winRate.toFixed(1)}%
                  </p>
                </div>
                <StarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profit Factor</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {performance.profitFactor.toFixed(2)}
                  </p>
                </div>
                <ChartPieIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {performance.sharpeRatio.toFixed(2)}
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Real-time P&L Tracker */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Today's Performance
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {performance?.totalProfit ? `${performance.totalProfit >= 0 ? '+' : ''}$${performance.totalProfit.toFixed(2)}` : '$0.00'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Today's P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${performance?.totalStaked ? performance.totalStaked.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Today's Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {performance?.totalBets || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Bets Placed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {performance?.winRate ? `${performance.winRate.toFixed(0)}%` : '0%'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Win Rate</div>
            </div>
          </div>
          
          <div className="mt-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                {performance?.streakCurrent && performance.streakCurrent > 0 
                  ? `🔥 You're on a ${performance.streakCurrent}-bet winning streak!`
                  : '💪 Ready to start your winning streak!'
                }
              </span>
              <span className="text-xs text-green-600 dark:text-green-400">
                ROI: {performance?.roi ? `${performance.roi >= 0 ? '+' : ''}${performance.roi.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 dark:bg-slate-800/60 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: "opportunities", label: "Opportunities", icon: BoltIcon },
              { id: "portfolio", label: "Portfolio", icon: ChartPieIcon },
              { id: "analytics", label: "Analytics", icon: ChartBarIcon },
              { id: "settings", label: "Settings", icon: CogIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "opportunities" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Opportunities' },
                    { id: 'value', label: 'Value Bets' },
                    { id: 'arbitrage', label: 'Arbitrage' },
                    { id: 'sure-bet', label: 'Sure Bets' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedFilter === filter.id
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  title="Sort opportunities by"
                >
                  <option value="ev">Sort by Expected Value</option>
                  <option value="edge">Sort by Edge</option>
                  <option value="confidence">Sort by Confidence</option>
                  <option value="expiry">Sort by Expiry</option>
                </select>
              </div>
            </div>

            {/* Kelly Criterion Calculator */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-4">
                <CalculatorIcon className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Kelly Criterion Calculator
                </h3>
                <InformationCircleIcon 
                  className="h-5 w-5 text-slate-400" 
                  title="Kelly Criterion helps determine optimal bet sizing based on edge and odds"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Edge (%)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter edge % (e.g., 5)"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={kellyInputs.edge}
                    onChange={(e) => setKellyInputs(prev => ({ ...prev, edge: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Odds
                  </label>
                  <input
                    type="number"
                    placeholder="-110"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={kellyInputs.odds}
                    onChange={(e) => setKellyInputs(prev => ({ ...prev, odds: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Win Probability (%)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter win probability % (e.g., 55)"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={kellyInputs.winProbability}
                    onChange={(e) => setKellyInputs(prev => ({ ...prev, winProbability: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Kelly %</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{calculateKellyValues(kellyInputs.odds, kellyInputs.winProbability, bankrollConfig.totalBankroll).kellyPercent.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Suggested Stake</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">${calculateKellyValues(kellyInputs.odds, kellyInputs.winProbability, bankrollConfig.totalBankroll).suggestedStake.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Max Risk</div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">${calculateKellyValues(kellyInputs.odds, kellyInputs.winProbability, bankrollConfig.totalBankroll).maxRisk.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No Opportunities Available</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {error ? 'Unable to load opportunities. Please check your connection.' : 'No betting opportunities match your current filters.'}
                </p>
                <button
                  onClick={fetchOpportunities}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Refresh Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
                  >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{opportunity.game}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(opportunity.riskLevel)}`}>
                              {opportunity.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {opportunity.sport} • {opportunity.betType} • {opportunity.bookmaker}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {formatOdds(opportunity.odds)}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {opportunity.confidence.toFixed(0)}% conf
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Expected Value</div>
                          <div className={`font-bold ${opportunity.expectedValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${opportunity.expectedValue.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Edge</div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {opportunity.edge.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Category</div>
                          <div className="font-bold text-blue-600 capitalize">
                            {opportunity.category}
                          </div>
                        </div>
                      </div>

                      {/* Stake Control */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Stake Amount
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStakeChange(opportunity.id, Math.max(bankrollConfig.minBetAmount, opportunity.stake - 25))}
                            className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            title="Decrease stake amount"
                            aria-label="Decrease stake amount"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={opportunity.stake}
                            onChange={(e) => handleStakeChange(opportunity.id, Math.max(0, parseFloat(e.target.value) || 0))}
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                            min={bankrollConfig.minBetAmount}
                            max={bankrollConfig.maxBetAmount}
                            title="Stake amount"
                            aria-label="Stake amount"
                          />
                          <button
                            onClick={() => handleStakeChange(opportunity.id, Math.min(bankrollConfig.maxBetAmount, opportunity.stake + 25))}
                            className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            title="Increase stake amount"
                            aria-label="Increase stake amount"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Potential Profit: ${opportunity.potentialProfit.toFixed(2)}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handlePlaceBet(opportunity)}
                        disabled={opportunity.stake < bankrollConfig.minBetAmount}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Place Bet • ${opportunity.stake.toFixed(2)}
                      </button>

                      {/* Expiry Warning */}
                      {new Date(opportunity.expires).getTime() - Date.now() < 3600000 && (
                        <div className="mt-3 flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <span className="text-sm">Expires in less than 1 hour</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            )}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <ChartPieIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No Active Positions</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Your betting portfolio will appear here once you place bets
                </p>
                <button
                  onClick={() => setActiveTab("opportunities")}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {portfolio.map((position) => (
                  <div
                    key={position.id}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{position.description}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{position.sport}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        position.status === 'won' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                        position.status === 'lost' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' :
                        position.status === 'pushed' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                      }`}>
                        {position.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Stake</div>
                        <div className="font-bold">${position.stake.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Odds</div>
                        <div className="font-bold">{formatOdds(position.odds)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">Potential Return</div>
                        <div className="font-bold">${position.potentialReturn.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-slate-400">P&L</div>
                        <div className={`font-bold ${
                          position.profit ? 
                            position.profit >= 0 ? 'text-green-600' : 'text-red-600' :
                            'text-slate-600'
                        }`}>
                          {position.profit !== undefined ? `$${position.profit.toFixed(2)}` : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="text-center py-12">
            <ChartBarIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Advanced Analytics Coming Soon</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Detailed performance charts, trend analysis, and risk metrics will be available here
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Bankroll Management Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Total Bankroll ($)
                  </label>
                  <input
                    type="number"
                    value={bankrollConfig.totalBankroll}
                    onChange={(e) => setBankrollConfig(prev => ({ ...prev, totalBankroll: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    title="Total bankroll amount"
                    aria-label="Total bankroll amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    value={bankrollConfig.riskTolerance}
                    onChange={(e) => setBankrollConfig(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    title="Risk tolerance level"
                    aria-label="Risk tolerance level"
                  >
                    <option value="conservative">Conservative (Low Risk)</option>
                    <option value="moderate">Moderate (Medium Risk)</option>
                    <option value="aggressive">Aggressive (High Risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Maximum Bet Percentage ({bankrollConfig.maxBetPercent}%)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={bankrollConfig.maxBetPercent}
                    onChange={(e) => setBankrollConfig(prev => ({ ...prev, maxBetPercent: parseFloat(e.target.value) }))}
                    className="w-full"
                    title="Maximum bet percentage"
                    aria-label="Maximum bet percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Kelly Criterion Multiplier ({bankrollConfig.kellyMultiplier})
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={bankrollConfig.kellyMultiplier}
                    onChange={(e) => setBankrollConfig(prev => ({ ...prev, kellyMultiplier: parseFloat(e.target.value) }))}
                    className="w-full"
                    title="Kelly Criterion multiplier"
                    aria-label="Kelly Criterion multiplier"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Lower values are more conservative
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Minimum Bet Amount ($)
                    </label>
                    <input
                      type="number"
                      value={bankrollConfig.minBetAmount}
                      onChange={(e) => setBankrollConfig(prev => ({ ...prev, minBetAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      title="Minimum bet amount"
                      aria-label="Minimum bet amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Maximum Bet Amount ($)
                    </label>
                    <input
                      type="number"
                      value={bankrollConfig.maxBetAmount}
                      onChange={(e) => setBankrollConfig(prev => ({ ...prev, maxBetAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      title="Maximum bet amount"
                      aria-label="Maximum bet amount"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      logUserAction('bankroll_settings_saved', bankrollConfig);
                      alert('Settings saved successfully!');
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Arbitrage Opportunities Section */}
        {arbitrageOpportunities.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FireIcon className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  🔥 Arbitrage Opportunities
                </h3>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                  {arbitrageOpportunities.length} Available
                </span>
              </div>
              <button
                onClick={() => fetchArbitrageOpportunities().then(setArbitrageOpportunities)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                title="Refresh arbitrage opportunities"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {arbitrageOpportunities.slice(0, 6).map((arb) => (
                <div key={arb.id} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{arb.event}</h4>
                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      {arb.profit?.toFixed(2)}% Profit
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {arb.bookmakers?.map((book: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">
                          {book.name}: {book.selection}
                        </span>
                        <div className="text-right">
                          <div className="font-medium">{book.odds}</div>
                          <div className="text-xs text-slate-500">${book.stake?.toFixed(0)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Total Stake:</span>
                      <span className="font-medium">${arb.totalStake?.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Expires:</span>
                      <span className="font-medium">
                        {arb.expiresAt ? new Date(arb.expiresAt).toLocaleTimeString() : 'Soon'}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200">
                    Execute Arbitrage
                  </button>
                </div>
              ))}
            </div>
            
            {arbitrageOpportunities.length > 6 && (
              <div className="mt-4 text-center">
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                  View All {arbitrageOpportunities.length} Arbitrage Opportunities →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoneyMakerPro;
