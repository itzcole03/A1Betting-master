import React from "react";
import useUserStats from "../hooks/useUserStats";

const TestUserStats: React.FC = () => {
  const { userStats, backendHealth, isLoading, error } = useUserStats();

  if (isLoading) {
    return <div className="text-blue-400">Loading user stats...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-4">User Stats Test</h3>

      {error && (
        <div className="mb-4 p-2 bg-yellow-600 text-white rounded">
          Status: {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-green-400">User Statistics</h4>
          <p className="text-white">
            Balance: ${userStats.balance?.toLocaleString()}
          </p>
          <p className="text-white">
            Win Rate: {(userStats.winRate * 100).toFixed(1)}%
          </p>
          <p className="text-white">
            Total Profit: ${userStats.totalProfit?.toLocaleString()}
          </p>
          <p className="text-white">Active Bets: {userStats.activeBets}</p>
          <p className="text-white">
            Accuracy: {userStats.accuracy.toFixed(1)}%
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-400">Backend Health</h4>
          <p className="text-white">Status: {backendHealth.status}</p>
          <p className="text-white">
            Accuracy: {backendHealth.accuracy.toFixed(1)}%
          </p>
          <p className="text-white">
            Active Predictions: {backendHealth.activePredictions}
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-300">API Status:</p>
            <p className="text-xs">
              SportsRadar: {backendHealth.apis.sportsradar}
            </p>
            <p className="text-xs">
              DailyFantasy: {backendHealth.apis.dailyfantasy}
            </p>
            <p className="text-xs">TheOdds: {backendHealth.apis.theodds}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Last Updated: {new Date(userStats.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default TestUserStats;
