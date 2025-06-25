import React from "react";
import HolographicText from "../ui/HolographicText";

const CyberFooter: React.FC = () => {
  return (
    <footer className="glass-card border-t border-white/10 py-6">
      <div className="text-center text-sm text-gray-400">
        <div className="mb-1">
          <HolographicText size="sm" className="font-semibold">
            A1BETTING QUANTUM INTELLIGENCE
          </HolographicText>
        </div>
        <div>
          © 2024 Advanced Sports Intelligence Platform • 47 Neural Networks •
          1024 Qubits
        </div>
      </div>
    </footer>
  );
};

export default CyberFooter;
