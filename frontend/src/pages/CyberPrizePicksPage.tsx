import React from "react";
import PrizePicksPage from "./PrizePicksPage";

const CyberPrizePicksPage: React.FC = () => {
  return (
    <div className="animate-slide-in-up">
      <div className="text-center mb-8">
        <div className="text-6xl mb-6 text-electric-400 float-element">
          <i className="fa-trophy" />
        </div>
        <h1 className="holographic text-4xl font-black mb-4">PrizePicks Pro</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Professional player prop analysis with real-time AI enhancement and
          market insights
        </p>
      </div>

      {/* Wrap the existing PrizePicksPage with cyber styling */}
      <div className="glass-card rounded-2xl p-6 transition-all duration-300">
        <PrizePicksPage />
      </div>
    </div>
  );
};

export default CyberPrizePicksPage;
