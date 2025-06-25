import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { UnifiedBettingSystem } from './core/UnifiedBettingSystem';
import { UnifiedDataEngine } from './core/UnifiedDataEngine';
import { UnifiedPredictionEngine } from './core/UnifiedPredictionEngine';
import { UnifiedStrategyEngine } from './core/UnifiedStrategyEngine';
import { UnifiedStateManager } from './core/UnifiedState';
import { UnifiedMonitor } from './core/UnifiedMonitor';
import { unifiedConfig } from './core/UnifiedConfig';
import { SystemError } from './core/UnifiedError';
export const AppInitializer = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Initialize configuration first
                await unifiedConfig.initialize();
                // Initialize core systems
                const systems = [
                    UnifiedDataEngine.getInstance(),
                    UnifiedPredictionEngine.getInstance(),
                    UnifiedStrategyEngine.getInstance(),
                    UnifiedBettingSystem.getInstance(),
                    UnifiedStateManager.getInstance(),
                    UnifiedMonitor.getInstance()
                ];
                // Initialize all systems in parallel
                await Promise.all(systems.map(system => system.initialize()));
                setIsInitialized(true);
            }
            catch (err) {
                const error = err instanceof Error ? err : new SystemError('INITIALIZATION_FAILED', 'Failed to initialize application');
                setError(error);
                console.error('[AppInitializer] Initialization failed:', error);
            }
        };
        initializeApp();
    }, []);
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-red-50", children: _jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "Initialization Error" }), _jsx("p", { className: "text-gray-700 mb-4", children: error.message }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors", children: "Retry" })] }) }));
    }
    if (!isInitialized) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Initializing application..." })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
