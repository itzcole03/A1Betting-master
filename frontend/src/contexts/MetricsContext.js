import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from 'react';
export const MetricsContext = createContext(null);
export const MetricsProvider = ({ metrics, children }) => {
    return _jsx(MetricsContext.Provider, { value: metrics, children: children });
};
