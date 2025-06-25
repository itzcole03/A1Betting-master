import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { analyticsService } from '@/services/analytics';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
const timeRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' },
];
const Trends = () => {
    const [selectedSport, setSelectedSport] = useState('all');
    const [selectedMarket, setSelectedMarket] = useState('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState('30');
    const { data: performanceData, isLoading: performanceLoading, error: performanceError } = useQuery({
        queryKey: ['performance', selectedTimeRange],
        queryFn: () => analyticsService.getPerformanceTrends(selectedTimeRange),
    });
    const { data: sportsData, isLoading: sportsLoading, error: sportsError } = useQuery({
        queryKey: ['sports', selectedSport, selectedTimeRange],
        queryFn: () => analyticsService.getSportsDistribution(selectedSport, selectedTimeRange),
    });
    const { data: marketsData, isLoading: marketsLoading, error: marketsError } = useQuery({
        queryKey: ['markets', selectedMarket, selectedTimeRange],
        queryFn: () => analyticsService.getMarketsDistribution(selectedMarket, selectedTimeRange),
    });
    const handleSportChange = (event) => {
        setSelectedSport(event.target.value);
    };
    const handleMarketChange = (event) => {
        setSelectedMarket(event.target.value);
    };
    const handleTimeRangeChange = (event) => {
        setSelectedTimeRange(event.target.value);
    };
    if (performanceError || sportsError || marketsError) {
        return _jsx(ErrorMessage, { error: performanceError || sportsError || marketsError });
    }
    return (_jsx("div", { className: "p-6 min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "mb-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: "Trends" }), _jsx("select", { className: "modern-input", value: selectedTimeRange, onChange: handleTimeRangeChange, children: timeRanges.map(range => (_jsx("option", { value: range.value, children: range.label }, range.value))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Performance Trends" }), performanceLoading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("span", { children: "Loading..." }) })) : (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(LineChart, { data: performanceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Line, { dataKey: "value", stroke: "#8884d8", strokeWidth: 2, type: "monotone" })] }) }) }))] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Sports Distribution" }), _jsxs("select", { className: "modern-input mb-2", value: selectedSport, onChange: handleSportChange, children: [_jsx("option", { value: "all", children: "All Sports" }), _jsx("option", { value: "football", children: "Football" }), _jsx("option", { value: "basketball", children: "Basketball" }), _jsx("option", { value: "tennis", children: "Tennis" })] }), sportsLoading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("span", { children: "Loading..." }) })) : (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(BarChart, { data: sportsData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#82ca9d" })] }) }) }))] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Market Distribution" }), _jsxs("select", { className: "modern-input mb-2", value: selectedMarket, onChange: handleMarketChange, children: [_jsx("option", { value: "all", children: "All Markets" }), _jsx("option", { value: "match-winner", children: "Match Winner" }), _jsx("option", { value: "over-under", children: "Over/Under" }), _jsx("option", { value: "btts", children: "Both Teams to Score" })] }), marketsLoading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("span", { children: "Loading..." }) })) : (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { height: "100%", width: "100%", children: _jsxs(BarChart, { data: marketsData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) }) }))] })] }), _jsxs(GlassCard, { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Key Insights" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingUpIcon, { className: "text-green-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Most Profitable Sport" }), _jsx("div", { children: "Football" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingDownIcon, { className: "text-red-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Least Profitable Market" }), _jsx("div", { children: "Handicap" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingUpIcon, { className: "text-green-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Best Time to Bet" }), _jsx("div", { children: "Weekend Matches" })] })] })] })] })] }) }));
};
export default Trends;
