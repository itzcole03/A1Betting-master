import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import CyberHeader from "./CyberHeader";
import CyberSidebar from "./CyberSidebar";

const CyberLayout: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex min-h-screen cyber-bg">
      <CyberSidebar />
      <div className="flex-1 flex flex-col">
        <CyberHeader />
        <main
          className="flex-1 p-8"
          style={{
            background: "transparent",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <Outlet />
        </main>
        <footer className="glass-card border-t border-white/10 py-6">
          <div className="text-center text-sm text-gray-400">
            <div className="holographic font-semibold mb-1">
              A1BETTING QUANTUM INTELLIGENCE
            </div>
            © 2024 Advanced Sports Intelligence Platform • 47 Neural Networks •
            1024 Qubits
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CyberLayout;
