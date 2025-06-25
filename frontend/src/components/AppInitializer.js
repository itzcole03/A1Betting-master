import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useUnifiedStore } from "../store/unified/UnifiedStoreManager";
import { dataPipeline } from "../services/data/UnifiedDataPipeline";
import { mlEngine } from "../services/ml/UnifiedMLEngine";
export const AppInitializer = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const { actions } = useUnifiedStore();
    useEffect(() => {
        let isMounted = true;
        const initializeApp = async () => {
            try {
                actions.setLoading("app_init", true);
                // Initialize data connections
                console.log("🚀 Initializing A1Betting systems...");
                // Check data pipeline status
                const connectionStatus = dataPipeline.getConnectionStatus();
                console.log("📡 Data connections:", connectionStatus);
                // Initialize ML engine
                const activeModels = mlEngine.getActiveModels();
                console.log("🧠 Active ML models:", activeModels.length);
                if (isMounted) {
                    setIsInitialized(true);
                    actions.setLoading("app_init", false);
                    actions.addToast({
                        type: "success",
                        title: "System Ready",
                        message: `A1Betting initialized with ${activeModels.length} active models`,
                        duration: 3000,
                    });
                }
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown initialization error";
                console.error("❌ App initialization failed:", errorMessage);
                if (isMounted) {
                    setError(errorMessage);
                    actions.setLoading("app_init", false);
                    actions.addToast({
                        type: "error",
                        title: "Initialization Error",
                        message: errorMessage,
                        duration: 5000,
                    });
                }
            }
        };
        initializeApp();
        return () => {
            isMounted = false;
        };
    }, [actions]);
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-md mx-auto text-center p-6", children: [_jsx("div", { className: "text-red-500 text-6xl mb-4", children: "\u26A0\uFE0F" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "Initialization Failed" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Retry" })] }) }));
    }
    if (!isInitialized) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }), _jsx("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "Initializing A1Betting" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "Setting up your elite sports intelligence platform..." })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
export default AppInitializer;
