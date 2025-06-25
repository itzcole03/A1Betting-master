/**
 * Purple Gradient Theme for A1Betting
 * Matches the design shown in the user's images
 */

import { createTheme } from '@mui/material/styles';

export const purpleGradientTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#667eea',
            dark: '#764ba2',
            light: '#00ffaa',
        },
        secondary: {
            main: '#00ffaa',
            dark: '#00cc88',
            light: '#33ffbb',
        },
        background: {
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            paper: 'rgba(255, 255, 255, 0.1)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.8)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    background: 'linear-gradient(45deg, #00ffaa, #00cc88)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #00cc88, #00aa66)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'transparent',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
    },
});
