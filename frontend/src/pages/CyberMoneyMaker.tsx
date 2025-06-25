import React from "react";
import CyberButton from "../components/ui/CyberButton";

const CyberMoneyMaker: React.FC = () => {
  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center mb-12 glass-card rounded-3xl p-12 shadow-neon">
        <h1 className="holographic text-5xl font-black mb-6">
          ULTIMATE MONEY MAKER
        </h1>
        <div className="text-6xl font-black text-green-400 mb-6 animate-cyber-pulse">
          $∞
        </div>
        <p className="text-xl text-gray-300 mb-8">
          AI-powered profit generation with 47 neural networks
        </p>
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-electric-400">∞%</div>
            <div className="text-gray-400">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">99.9%</div>
            <div className="text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">&lt;1ms</div>
            <div className="text-gray-400">Response</div>
          </div>
        </div>
        <CyberButton
          label="ACTIVATE QUANTUM PROFITS"
          variant="primary"
          size="lg"
          icon="fa-rocket"
          className="animate-glow-pulse"
        />
      </div>
    </div>
  );
};

export default CyberMoneyMaker;
