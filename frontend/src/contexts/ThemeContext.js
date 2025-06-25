import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => { },
});
export const useThemeContext = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });
    return (_jsx(ThemeContext.Provider, { value: { isDarkMode, toggleTheme }, children: _jsx(MuiThemeProvider, { theme: theme, children: children }) }));
};
export default ThemeContext;
