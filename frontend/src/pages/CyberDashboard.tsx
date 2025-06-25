import React from "react";
import { useCyberApp } from "../contexts/CyberAppContext";
import MetricCard from "../components/ui/MetricCard";
import GlassCard from "../components/ui/GlassCard";
import CyberButton from "../components/ui/CyberButton";

const CyberDashboard: React.FC = () => {
  const { user } = useCyberApp();

  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center mb-8">
        <h1
          className="holographic text-4xl font-black mb-4"
          style={{
            background:
              "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b)",
            backgroundSize: "400% 400%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-shift 8s ease infinite",
            fontWeight: "900",
            letterSpacing: "-0.02em",
          }}
        >
          Welcome Back, Alex
        </h1>
        <p className="text-xl" style={{ color: "#9ca3af", marginTop: "16px" }}>
          Your AI-powered sports intelligence platform is ready
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Profit"
          value={`$${user.totalProfit.toLocaleString()}`}
          icon="fa-dollar-sign"
          change="+$3.2K"
          trend="up"
        />
        <MetricCard
          label="AI Accuracy"
          value={`${user.accuracy}%`}
          icon="fa-brain"
          change="+2.1%"
          trend="up"
        />
        <MetricCard
          label="Win Rate"
          value={`${user.winRate}%`}
          icon="fa-trophy"
          change="+4.7%"
          trend="up"
        />
        <MetricCard
          label="Account Balance"
          value={`$${user.balance.toLocaleString()}`}
          icon="fa-wallet"
          change="+12.3%"
          trend="up"
        />
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard title="Ultimate Money Maker" glowing={true}>
          <div className="text-center">
            <div className="text-4xl mb-4 text-green-400">💰</div>
            <p className="text-gray-300 mb-4">
              AI-powered profit maximization with 47 neural networks
            </p>
            <CyberButton
              label="Activate Now"
              variant="primary"
              className="w-full"
            />
          </div>
        </GlassCard>

        <GlassCard title="PrizePicks Pro">
          <div className="text-center">
            <div className="text-4xl mb-4 text-blue-400">🏆</div>
            <p className="text-gray-300 mb-4">
              Professional player prop analysis with real-time data
            </p>
            <CyberButton
              label="View Props"
              variant="secondary"
              className="w-full"
            />
          </div>
        </GlassCard>

        <GlassCard title="Quantum Analytics">
          <div className="text-center">
            <div className="text-4xl mb-4 text-purple-400">⚛️</div>
            <p className="text-gray-300 mb-4">
              Quantum-enhanced predictions with 99.7% accuracy
            </p>
            <CyberButton label="Explore" variant="ghost" className="w-full" />
          </div>
        </GlassCard>
      </div>

      {/* Live Activity Feed */}
      <GlassCard title="Live Activity Feed">
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-green-500/10 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300">
              AI Model generated new prediction: Lakers vs Warriors (94.7%
              confidence)
            </span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-blue-500/10 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300">
              Quantum processor analyzed 1,247 data points in 12ms
            </span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-purple-500/10 rounded-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-purple-300">
              Neural network training completed: +2.3% accuracy improvement
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CyberDashboard;
