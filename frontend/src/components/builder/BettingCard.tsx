import React from "react";

// Custom Betting Card Component (Builder.io removed)
interface BettingCardProps {
  title?: string;
  odds?: string;
  team1?: string;
  team2?: string;
  sport?: string;
  time?: string;
  onClick?: () => void;
}

const BettingCard: React.FC<BettingCardProps> = ({
  title = "Match Title",
  odds = "2.5",
  team1 = "Team A",
  team2 = "Team B",
  sport = "Football",
  time = "Today 3:00 PM",
  onClick,
}) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sport}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-medium dark:text-white">{team1}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs</span>
          <span className="text-sm font-medium dark:text-white">{team2}</span>
        </div>
        <div className="bg-blue-500 text-white px-3 py-1 rounded font-bold">
          {odds}
        </div>
      </div>
    </div>
  );
};

// Builder.io registration completely removed

export default BettingCard;
