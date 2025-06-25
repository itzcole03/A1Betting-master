import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from 'react';
export const LoggerContext = createContext(null);
export const LoggerProvider = ({ logger, children }) => {
    return _jsx(LoggerContext.Provider, { value: logger, children: children });
};
