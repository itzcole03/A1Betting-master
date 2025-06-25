import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Grid, Card, CardContent, CardHeader, IconButton, Select, MenuItem, FormControl, InputLabel, CircularProgress, } from '@mui/material';
import { MoreVert as MoreVertIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, } from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { analyticsService } from '@/services/analytics';
import { ErrorMessage } from '@/components/common/ErrorMessage';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const Analytics = () => {
    const [timeRange, setTimeRange] = useState('30');
    const { data: stats, isLoading: statsLoading, error: statsError, } = useQuery({
        queryKey: ['analytics-stats', timeRange],
        queryFn: () => analyticsService.getAnalyticsStats(timeRange),
    });
    const { data: performanceData, isLoading: performanceLoading, error: performanceError, } = useQuery({
        queryKey: ['analytics-performance', timeRange],
        queryFn: () => analyticsService.getPerformanceData(timeRange),
    });
    const { data: sportDistribution, isLoading: distributionLoading, error: distributionError, } = useQuery({
        queryKey: ['analytics-distribution', timeRange],
        queryFn: () => analyticsService.getSportDistribution(timeRange),
    });
    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };
    if (statsError || performanceError || distributionError) {
        return _jsx(ErrorMessage, { error: statsError || performanceError || distributionError });
    }
    return (_jsxs(Box, { sx: { flexGrow: 1, p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h4", children: "Analytics" }), _jsxs(FormControl, { sx: { minWidth: 200 }, children: [_jsx(InputLabel, { children: "Time Period" }), _jsxs(Select, { label: "Time Period", value: timeRange, onChange: handleTimeRangeChange, children: [_jsx(MenuItem, { value: "7", children: "Last 7 days" }), _jsx(MenuItem, { value: "30", children: "Last 30 days" }), _jsx(MenuItem, { value: "90", children: "Last 90 days" }), _jsx(MenuItem, { value: "365", children: "Last year" })] })] })] }), _jsxs(Grid, { container: true, spacing: 3, children: [statsLoading ? (_jsx(Grid, { item: true, xs: 12, children: _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) }) })) : (stats?.map((stat) => (_jsx(Grid, { item: true, md: 3, sm: 6, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, color: "textSecondary", children: stat.title }), _jsx(Typography, { component: "div", variant: "h5", children: stat.value }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mt: 1 }, children: [stat.trend === 'up' ? (_jsx(TrendingUpIcon, { color: "success" })) : (_jsx(TrendingDownIcon, { color: "error" })), _jsx(Typography, { color: stat.trend === 'up' ? 'success.main' : 'error.main', sx: { ml: 0.5 }, variant: "body2", children: stat.change })] })] }) }) }, stat.title)))), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { children: [_jsx(CardHeader, { action: _jsx(IconButton, { children: _jsx(MoreVertIcon, {}) }), title: "Performance Over Time" }), _jsx(CardContent, { children: performanceLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(Box, { sx: { height: 400 }, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(LineChart, { data: performanceData, margin: {
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { activeDot: { r: 8 }, dataKey: "value", stroke: "#8884d8", type: "monotone" })] }) }) })) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Card, { children: [_jsx(CardHeader, { action: _jsx(IconButton, { children: _jsx(MoreVertIcon, {}) }), title: "Prediction Success by Sport" }), _jsx(CardContent, { children: distributionLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(Box, { sx: { height: 400 }, children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(BarChart, { data: sportDistribution, margin: {
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) }) })) })] }) })] })] }));
};
export default Analytics;
