/**
 * Simple User Interface - The main user-facing interface
 * Hides complexity and focuses on delivering winning sports bets
 */

import { AppBar, Box, Switch, Toolbar, Tooltip, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';
import { purpleGradientTheme } from '../../theme/PurpleGradientTheme';
import AdminDeveloperInterface from '../AdminDeveloperInterface';
import MainDashboard from './MainDashboard';

const SimpleUserInterface: React.FC = () => {
    const [isAdminMode, setIsAdminMode] = useState(false);

    const handleToggle = () => {
        setIsAdminMode(!isAdminMode);
    };

    return (
        <ThemeProvider theme={purpleGradientTheme}>
            <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {/* Header with Emoji Toggle */}
                <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
                            A1BETTING INTELLIGENCE
                        </Typography>

                        {/* Emoji Toggle */}
                        <Tooltip title={isAdminMode ? "Switch to Simple Interface" : "Switch to Admin Interface"}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ fontSize: '24px' }}>😊</Box>
                                <Switch
                                    checked={isAdminMode}
                                    onChange={handleToggle}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#00ffaa',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#00ffaa',
                                        },
                                    }}
                                />
                                <Box sx={{ fontSize: '24px' }}>🔧</Box>
                            </Box>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                {/* Content Area */}
                <Box sx={{ p: 2 }}>
                    {isAdminMode ? (
                        <AdminDeveloperInterface />
                    ) : (
                        <MainDashboard />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default SimpleUserInterface;
