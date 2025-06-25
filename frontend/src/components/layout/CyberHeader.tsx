import React from "react";
import { useCyberApp } from "../../contexts/CyberAppContext";
import StatusIndicator from "../ui/StatusIndicator";

const CyberHeader: React.FC = () => {
  const { user, theme, setTheme } = useCyberApp();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header
      className="glass-card border-b border-white/10 sticky top-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative float-element">
                <div className="absolute inset-0 bg-gradient-to-r from-electric-400 to-neon-blue rounded-xl blur-lg opacity-75" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-electric-400 to-neon-blue rounded-xl flex items-center justify-center">
                  <i className="fas fa-brain text-black text-lg font-bold" />
                </div>
              </div>
              <div>
                <div className="holographic text-xl font-black tracking-tight">
                  A1BETTING
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  Quantum Intelligence
                </div>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <StatusIndicator status="active" label="All Systems Online" />
              <StatusIndicator status="active" label="47 AI Models Active" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Balance</div>
                <div className="font-bold text-green-400">
                  ${user.balance.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">
                  AI Accuracy
                </div>
                <div className="font-bold text-electric-400">
                  {user.accuracy}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Tier</div>
                <div className="font-bold text-purple-400">{user.tier}</div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 glass-card rounded-xl hover:shadow-neon transition-all duration-300"
            >
              <i
                className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"} text-electric-400`}
              />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-electric-400 rounded-full blur-sm opacity-50" />
                <img
                  src="https://ui-avatars.com/api/?name=Alex+Chen&background=000&color=00ff88&bold=true"
                  alt="Profile"
                  className="relative w-9 h-9 rounded-full border-2 border-electric-400"
                />
              </div>
              <div className="hidden md:block">
                <div className="font-semibold text-white text-sm">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CyberHeader;
