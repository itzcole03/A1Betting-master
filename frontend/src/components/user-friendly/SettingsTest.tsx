import React from "react";

interface SettingsTestProps {
  onNavigate?: (page: string) => void;
}

export const SettingsTest: React.FC<SettingsTestProps> = ({ onNavigate }) => {
  console.log("SettingsTest component is rendering");

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
          Settings Test Page
        </h1>

        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold mb-6 text-white">
            This is a simple test settings page
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Test Setting 1
              </h3>
              <p className="text-gray-300">This is a test setting item.</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Test Setting 2
              </h3>
              <p className="text-gray-300">
                This is another test setting item.
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Navigation Test
              </h3>
              <button
                onClick={() => onNavigate?.("dashboard")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-green-400 font-bold">
                ✅ Settings component is working correctly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTest;
