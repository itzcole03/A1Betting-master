import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const defaultStrategyInput = {
    stake: 100,
    minConfidence: 0.55,
    selectedStrategies: [],
    maxPayout: 5,
    minPayout: 1.5,
    selectedSports: [],
    selectedPropTypes: [],
};
const StrategyInputContext = createContext(undefined);
export const StrategyInputProvider = ({ children }) => {
    const [strategyInput, setStrategyInput] = useState(defaultStrategyInput);
    const updateStrategyInput = useCallback((input) => {
        setStrategyInput(prev => ({ ...prev, ...input }));
    }, []);
    const resetStrategyInput = useCallback(() => {
        setStrategyInput(defaultStrategyInput);
    }, []);
    return (_jsx(StrategyInputContext.Provider, { value: { strategyInput, updateStrategyInput, resetStrategyInput }, children: children }));
};
export const useStrategyInput = () => {
    const context = useContext(StrategyInputContext);
    if (!context) {
        throw new Error('useStrategyInput must be used within a StrategyInputProvider');
    }
    return context;
};
