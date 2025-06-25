import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Target, TrendingUp } from "lucide-react";

// Enhanced styling for module management
export const moduleEnhancementStyles = `
  .enhanced-module-card {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.3) 100%);
    border: 2px solid rgba(71, 85, 105, 0.4);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
  }

  .enhanced-module-card:hover {
    transform: scale(1.03) rotateY(2deg);
    border-color: rgba(71, 85, 105, 0.6);
    background: linear-gradient(135deg, rgba(51, 65, 85, 0.3) 0%, rgba(71, 85, 105, 0.25) 100%);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
  }

  .enhanced-module-card.active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(59, 130, 246, 0.15) 100%);
    border-color: rgba(34, 197, 94, 0.6);
    box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.4);
  }

  .money-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    color: black;
    font-size: 11px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    animation: pulse 2s infinite;
  }

  .profit-bar {
    width: 100%;
    height: 6px;
    background: rgba(71, 85, 105, 0.3);
    border-radius: 3px;
    overflow: hidden;
  }

  .profit-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s ease-out;
  }

  .profit-fill.high {
    background: linear-gradient(90deg, #10b981, #34d399);
  }

  .profit-fill.medium {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }

  .profit-fill.low {
    background: linear-gradient(90deg, #6b7280, #9ca3af);
  }
`;

// Money-making scores for modules
export const getModuleScore = (moduleId: string) => {
  const scores = {
    "advanced-analytics": { money: 95, accuracy: 12, profit: 25000 },
    "ultra-accuracy": { money: 92, accuracy: 18, profit: 22000 },
    "ultra-ml": { money: 88, accuracy: 15, profit: 20000 },
    "realtime-accuracy": { money: 85, accuracy: 10, profit: 18000 },
    "strategy-engine": { money: 82, accuracy: 6, profit: 15000 },
    "mega-analytics": { money: 90, accuracy: 20, profit: 30000 },
    "performance-analytics": { money: 78, accuracy: 5, profit: 10000 },
    "ml-model-center": { money: 75, accuracy: 8, profit: 12000 },
  };
  return scores[moduleId] || { money: 50, accuracy: 3, profit: 5000 };
};

// Enhanced module card component
export const EnhancedModuleIndicators = ({ moduleId, isActive }) => {
  const scores = getModuleScore(moduleId);

  return (
    <>
      {/* Money-making badge for high-value modules */}
      {scores.money >= 80 && (
        <div className="money-badge">💰 {scores.money}%</div>
      )}

      {/* Performance metrics */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            Money Impact
          </span>
          <span
            style={{ fontSize: "11px", fontWeight: "bold", color: "#10b981" }}
          >
            {scores.money}%
          </span>
        </div>
        <div className="profit-bar">
          <div
            className={`profit-fill ${scores.money >= 85 ? "high" : scores.money >= 70 ? "medium" : "low"}`}
            style={{ width: `${scores.money}%` }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#93c5fd" }}>Accuracy</span>
            <span
              style={{ fontSize: "10px", fontWeight: "bold", color: "#60a5fa" }}
            >
              +{scores.accuracy}%
            </span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#86efac" }}>Daily</span>
            <span
              style={{ fontSize: "10px", fontWeight: "bold", color: "#22c55e" }}
            >
              ${(scores.profit / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default {
  moduleEnhancementStyles,
  getModuleScore,
  EnhancedModuleIndicators,
};
