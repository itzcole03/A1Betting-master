import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import Tooltip from '../components/ui/Tooltip';
const mockUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    avatar: 'JD',
    joinDate: 'January 2024',
    stats: {
        totalPredictions: 1234,
        successRate: 78.5,
        winStreak: 5,
        totalWinnings: 5678.9,
    },
    favoriteSports: ['Football', 'Basketball', 'Tennis'],
};
const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(mockUserData);
    const [editedData, setEditedData] = useState(mockUserData);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const handleEdit = () => {
        setIsEditing(true);
        setEditedData(userData);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditedData(userData);
    };
    const handleSave = () => {
        setUserData(editedData);
        setIsEditing(false);
        setSnackbar({
            open: true,
            message: 'Profile updated successfully',
            severity: 'success',
        });
    };
    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    return (_jsxs("div", { className: "p-6 space-y-8 max-w-3xl mx-auto", children: [_jsxs(GlassCard, { className: "flex flex-col items-center p-8", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-4xl font-bold text-white mb-4", children: userData.avatar }), _jsx("div", { className: "text-2xl font-bold mb-2", children: userData.name }), _jsx("div", { className: "text-gray-500 mb-2", children: userData.email }), _jsx("div", { className: "text-gray-400 mb-2", children: userData.location }), _jsxs("div", { className: "text-xs text-gray-400 mb-4", children: ["Joined ", userData.joinDate] }), _jsx("div", { className: "flex gap-4 mb-4", children: userData.favoriteSports.map((sport, idx) => (_jsx("span", { className: "px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold", children: sport }, idx))) }), _jsx("div", { className: "flex gap-4 mb-4", children: _jsx(GlowButton, { onClick: handleEdit, className: "bg-primary-500", children: "Edit Profile" }) })] }), _jsx(GlassCard, { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Tooltip, { content: "Total number of predictions you've made.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Total Predictions" }) }), _jsx("div", { className: "text-2xl font-bold text-primary-600", children: userData.stats.totalPredictions })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Your overall success rate.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Success Rate" }) }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: [userData.stats.successRate, "%"] })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Your current win streak.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Win Streak" }) }), _jsx("div", { className: "text-2xl font-bold text-yellow-600", children: userData.stats.winStreak })] }), _jsxs("div", { children: [_jsx(Tooltip, { content: "Total winnings from all bets.", children: _jsx("div", { className: "text-xs text-gray-400", children: "Total Winnings" }) }), _jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["$", userData.stats.totalWinnings.toLocaleString()] })] })] }) })] }));
};
export default Profile;
