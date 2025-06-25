import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const CyberAppContext = createContext(null);
export const CyberAppContextProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [user] = useState({
        name: "Alex Chen",
        email: "alex@a1betting.com",
        balance: 127430.5,
        tier: "Quantum Pro",
        accuracy: 97.3,
        winRate: 89.4,
        totalProfit: 47230,
    });
    const [theme, setTheme] = useState("dark");
    const value = {
        currentPage,
        setCurrentPage,
        user,
        theme,
        setTheme,
    };
    return (_jsx(CyberAppContext.Provider, { value: value, children: children }));
};
export const useCyberApp = () => {
    const context = useContext(CyberAppContext);
    if (!context) {
        throw new Error("useCyberApp must be used within a CyberAppContextProvider");
    }
    return context;
};
export default CyberAppContext;
