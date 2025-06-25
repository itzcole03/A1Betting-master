import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
const ThemeContext = createContext({
    mode: 'system',
    setThemeMode: () => { },
});
export const useThemeContext = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }) => {
    const { mode, theme, setThemeMode } = useTheme();
    const muiTheme = React.useMemo(() => createTheme({
        palette: {
            mode: theme,
            primary: {
                main: '#2196f3',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: theme === 'dark' ? '#121212' : '#fafafa',
                paper: theme === 'dark' ? '#1e1e1e' : '#fff',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
                        borderRadius: 8,
                    },
                },
            },
            MuiCardContent: {
                styleOverrides: {
                    root: { padding: 24 },
                },
            },
        },
    }), [theme]);
    return (_jsx(ThemeContext.Provider, { value: { mode, setThemeMode }, children: _jsxs(MuiThemeProvider, { theme: muiTheme, children: [_jsx(CssBaseline, {}), children] }) }));
};
