import React from "react";
import MetricCard from "../components/ui/MetricCard";

const CyberPremiumDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center mb-8">
        <h1 className="holographic text-4xl font-black mb-4 flex items-center justify-center">
          <i className="fas fa-crown mr-3" />
          Premium Quantum Dashboard
        </h1>
        <p className="text-xl text-gray-400">
          Advanced quantum-enhanced AI with 1024 qubits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Active Qubits"
          value="1024"
          icon="fa-atom"
          change="+64"
          trend="up"
        />
        <MetricCard
          label="Entanglement"
          value="99.97%"
          icon="fa-link"
          change="+0.03%"
          trend="up"
        />
        <MetricCard
          label="Coherence Time"
          value="2.1ms"
          icon="fa-clock"
          change="+0.2ms"
          trend="up"
        />
      </div>
    </div>
  );
};

export default CyberPremiumDashboard;
