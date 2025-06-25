import React, { useMemo, useCallback } from "react";

// Safe UserStats component that can be used once store issues are resolved
interface UserStatsProps {
  entries?: any[];
  user?: { id?: string } | null;
}

interface UserStatsData {
  totalBets: number;
  settledBets: number;
  winRate: number;
  totalProfitLoss: number;
  roi: number;
}

// Safe calculation function
const calculateUserStatsSafe = (
  entries: any[] = [],
  userId?: string,
): UserStatsData => {
  try {
    if (!userId || !Array.isArray(entries)) {
      return {
        totalBets: 0,
        settledBets: 0,
        winRate: 0,
        totalProfitLoss: 0,
        roi: 0,
      };
    }

    const userEntries = entries.filter((entry) => entry?.user_id === userId);
    const totalBets = userEntries.length;

    const settledEntries = userEntries.filter(
      (entry) => entry?.status === "won" || entry?.status === "lost",
    );
    const settledBetsCount = settledEntries.length;

    let wins = 0;
    let totalStakeOnSettled = 0;
    let totalGrossReturnFromWon = 0;

    settledEntries.forEach((entry) => {
      const stake = Number(entry?.stake) || 0;
      const payout = Number(entry?.payout) || 0;

      totalStakeOnSettled += stake;
      if (entry?.status === "won") {
        wins++;
        totalGrossReturnFromWon += payout;
      }
    });

    const winRate = settledBetsCount > 0 ? (wins / settledBetsCount) * 100 : 0;
    const totalProfitLoss = totalGrossReturnFromWon - totalStakeOnSettled;
    const roi =
      totalStakeOnSettled > 0
        ? (totalProfitLoss / totalStakeOnSettled) * 100
        : 0;

    return {
      totalBets,
      settledBets: settledBetsCount,
      winRate,
      totalProfitLoss,
      roi,
    };
  } catch (error) {
    console.error("Error calculating user stats:", error);
    return {
      totalBets: 0,
      settledBets: 0,
      winRate: 0,
      totalProfitLoss: 0,
      roi: 0,
    };
  }
};

const UserStatsSafe: React.FC<UserStatsProps> = ({
  entries = [],
  user = null,
}) => {
  // Safely calculate stats with memoization
  const stats = useMemo(() => {
    return calculateUserStatsSafe(entries, user?.id);
  }, [entries, user?.id]);

  // Show fallback if no user
  if (!user?.id) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Please log in to see your betting statistics.</p>
      </div>
    );
  }

  // Show message if no data
  if (stats.totalBets === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No betting history available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="p-4 glass rounded-2xl bg-gradient-to-br from-blue-100/60 to-blue-300/30 shadow-md animate-fade-in">
        <p className="text-xs text-blue-700 font-semibold mb-1">Total Bets</p>
        <p className="text-2xl font-extrabold text-blue-900">
          {stats.totalBets}
        </p>
      </div>
      <div className="p-4 glass rounded-2xl bg-gradient-to-br from-green-100/60 to-green-300/30 shadow-md animate-fade-in">
        <p className="text-xs text-green-700 font-semibold mb-1">Win Rate</p>
        <p className="text-2xl font-extrabold text-green-700">
          {stats.winRate.toFixed(1)}%
        </p>
      </div>
      <div className="p-4 glass rounded-2xl bg-gradient-to-br from-yellow-100/60 to-yellow-300/30 shadow-md animate-fade-in">
        <p className="text-xs text-yellow-700 font-semibold mb-1">
          Profit/Loss
        </p>
        <p
          className={`text-2xl font-extrabold ${stats.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          ${stats.totalProfitLoss.toFixed(2)}
        </p>
      </div>
      <div className="p-4 glass rounded-2xl bg-gradient-to-br from-purple-100/60 to-purple-300/30 shadow-md animate-fade-in">
        <p className="text-xs text-purple-700 font-semibold mb-1">ROI</p>
        <p className="text-2xl font-extrabold text-purple-700">
          {stats.roi.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default React.memo(UserStatsSafe);
