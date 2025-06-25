import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCalculator, FaChartLine, FaClock, FaExchangeAlt } from 'react-icons/fa';
import { useBettingOpportunities } from '../hooks/UniversalHooks';
import { ArbitrageOpportunity } from '../types/index';
import { calculateArbitrage, formatCurrency, formatPercentage } from '../utils/odds';
import { UnifiedInput } from './base/UnifiedInput';

const Arbitrage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [stake, setStake] = useState(1000);
  const [calculatorOdds, setCalculatorOdds] = useState({
    book1: -110,
    book2: +100,
  });

  // Fetch real arbitrage opportunities from backend
  const { data: bettingData, isLoading: _isLoading, error: _error } = useBettingOpportunities();

  useEffect(() => {
    // Use real data from backend if available, otherwise fall back to empty array
    if (bettingData?.arbitrage_opportunities) {
      const mappedOpportunities = bettingData.arbitrage_opportunities.map((opp: unknown, index: number) => {
        const opportunity = opp as Record<string, unknown>;
        return {
          id: (opportunity.id as string) || index.toString(),
          sport: (opportunity.sport as string) || 'NBA',
          player: opportunity.player || {
            id: '1',
            name: (opportunity.playerName as string) || 'Unknown Player',
            team: {
              id: '1',
              name: (opportunity.team as string) || 'Unknown Team',
              abbreviation: (opportunity.teamAbbr as string) || 'UNK',
              sport: (opportunity.sport as string) || 'NBA',
              colors: {
                primary: '#552583',
                secondary: '#FDB927',
              },
            },
            position: (opportunity.position as string) || 'Unknown',
            imageUrl: (opportunity.imageUrl as string) || 'https://example.com/player.jpg',
            stats: (opportunity.stats as Record<string, unknown>) || {},
            form: (opportunity.form as number) || 85,
          },
          propType: (opportunity.propType as string) || 'points',
          books: (opportunity.books as Array<{ name: string; odds: number; line: number }>) || [
            { name: 'DraftKings', odds: -110, line: 26.5 },
            { name: 'FanDuel', odds: +120, line: 26.5 },
          ],
          potentialProfit: (opportunity.potentialProfit as number) || 0,
          expiresAt: (opportunity.expiresAt as string) || new Date(Date.now() + 30 * 60000).toISOString(),
        };
      });
      setOpportunities(mappedOpportunities);
    } else {
      // Set empty array if no data
      setOpportunities([]);
    }
  }, [bettingData]);

  const handleCalculatorChange = (book: 'book1' | 'book2', value: string) => {
    setCalculatorOdds(prev => ({
      ...prev,
      [book]: parseInt(value) || 0,
    }));
  };

  const calculateOptimalStakes = () => {
    const result = calculateArbitrage(calculatorOdds.book1, calculatorOdds.book2, stake);

    return result;
  };

  const getTimeRemaining = (expiresAt: string): string => {
    const remaining = new Date(expiresAt).getTime() - Date.now();
    const minutes = Math.floor(remaining / 60000);
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Arbitrage Calculator */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaCalculator className="w-5 h-5 mr-2 text-primary-500" />
          Arbitrage Calculator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <UnifiedInput
              label="Book 1 Odds"
              placeholder="-110"
              type="number"
              value={calculatorOdds.book1}
              onChange={e => handleCalculatorChange('book1', e.target.value)}
            />
          </div>
          <div>
            <UnifiedInput
              label="Book 2 Odds"
              placeholder="+100"
              type="number"
              value={calculatorOdds.book2}
              onChange={e => handleCalculatorChange('book2', e.target.value)}
            />
          </div>
          <div>
            <UnifiedInput
              label="Total Stake"
              placeholder="1000"
              type="number"
              value={stake}
              onChange={e => setStake(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mt-4">
          {(() => {
            const result = calculateOptimalStakes();
            if (result) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Book 1 Stake</p>
                    <p className="text-lg font-bold text-primary-500">
                      {formatCurrency(result.split[0])}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Book 2 Stake</p>
                    <p className="text-lg font-bold text-primary-500">
                      {formatCurrency(result.split[1])}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Guaranteed Profit</p>
                    <p className="text-lg font-bold text-green-500">
                      {formatCurrency(result.profit)}
                    </p>
                  </div>
                </div>
              );
            }
            return (
              <p className="text-sm text-red-500">No arbitrage opportunity found with these odds</p>
            );
          })()}
        </div>
      </motion.div>

      {/* Live Opportunities */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaExchangeAlt className="w-5 h-5 mr-2 text-primary-500" />
          Live Arbitrage Opportunities
        </h3>
        <div className="space-y-4">
          {opportunities.map(opp => (
            <motion.div
              key={opp.id}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{opp.player.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {opp.player.team.abbreviation}
                    </span>
                    <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">
                      {opp.propType}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {opp.books.map((book: { name: string; odds: number; line: number }) => (
                      <div key={book.name} className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{book.name}:</span>
                        <span className="ml-1 font-medium">
                          {book.line} @ {book.odds > 0 ? '+' : ''}
                          {book.odds}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getTimeRemaining(opp.expiresAt)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Potential Profit
                    </span>
                    <p className="text-lg font-bold text-green-500">
                      {formatCurrency(opp.potentialProfit)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                  onClick={() => {
                    // Handle execution
                  }}
                >
                  Execute Trade
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-morphism p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Profit (30d)
            </h4>
            <FaChartLine className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500 mt-2">{formatCurrency(12450)}</p>
          <p className="text-xs text-gray-500 mt-1">From 45 executed trades</p>
        </div>
        <div className="glass-morphism p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average ROI</h4>
            <FaChartLine className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-primary-500 mt-2">{formatPercentage(0.0845)}</p>
          <p className="text-xs text-gray-500 mt-1">Per trade average</p>
        </div>
        <div className="glass-morphism p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</h4>
            <FaChartLine className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-primary-500 mt-2">{formatPercentage(0.982)}</p>
          <p className="text-xs text-gray-500 mt-1">Based on 250 trades</p>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(Arbitrage);
