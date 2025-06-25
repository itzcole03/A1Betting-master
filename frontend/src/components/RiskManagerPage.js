import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const RiskManagerPage = () => {
    // State for risk profiles and active bets
    const [profiles, setProfiles] = useState([]);
    const [activeBets, setActiveBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Modal state for creating new profile
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch risk profiles and active bets on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [profilesRes, betsRes] = await Promise.all([
                    axios.get('/api/risk-profiles'),
                    axios.get('/api/active-bets'),
                ]);
                setProfiles(profilesRes.data);
                setActiveBets(betsRes.data);
            }
            catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message || 'Failed to load data');
                }
                else if (err instanceof Error) {
                    setError(err.message);
                }
                else {
                    setError('Failed to load data');
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const activeProfile = profiles.find(p => p.isActive);
    const totalExposure = activeBets.reduce((sum, bet) => sum + bet.stake, 0);
    const maxPotentialLoss = totalExposure;
    const maxPotentialWin = activeBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low':
                return 'text-green-600 dark:text-green-400';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'high':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    return (_jsx(_Fragment, { children: _jsxs("main", { className: "section space-y-6 lg:space-y-8 animate-fade-in", children: [_jsxs("div", { className: "modern-card p-6 lg:p-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8", children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold", children: "\u2696\uFE0F Risk Manager" }), _jsx("button", { className: "modern-button", onClick: () => setIsModalOpen(true), children: "Create New Profile" })] }), loading ? (_jsx("div", { className: "text-center text-gray-500 dark:text-gray-400", children: "Loading..." })) : error ? (_jsx("div", { className: "text-center text-red-600", children: error })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Active Profile" }), _jsx("p", { className: "text-2xl font-bold", children: activeProfile?.name || 'None' })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Total Exposure" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", totalExposure.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Max Potential Loss" }), _jsxs("p", { className: "text-2xl font-bold text-red-600", children: ["-$", maxPotentialLoss.toFixed(2)] })] }), _jsxs("div", { className: "modern-card p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Max Potential Win" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["+$", maxPotentialWin.toFixed(2)] })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Risk Profiles" }), profiles.length === 0 ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "No risk profiles available." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: profiles.map(profile => (_jsxs("div", { className: `modern-card p-6 ${profile.isActive ? 'ring-2 ring-primary-500' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-bold", children: profile.name }), profile.isActive && (_jsx("span", { className: "px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full", children: "Active" }))] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Max Stake" }), _jsxs("span", { className: "font-medium", children: ["$", profile.maxStake] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Max Exposure" }), _jsxs("span", { className: "font-medium", children: ["$", profile.maxExposure] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Stop Loss" }), _jsxs("span", { className: "font-medium", children: ["-$", profile.stopLoss] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Take Profit" }), _jsxs("span", { className: "font-medium", children: ["+$", profile.takeProfit] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 dark:text-gray-400", children: "Kelly Fraction" }), _jsxs("span", { className: "font-medium", children: [profile.kellyFraction, "x"] })] })] }), !profile.isActive && _jsx("button", { className: "modern-button mt-4", children: "Set Active" })] }, profile.id))) }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Active Bets" }), activeBets.length === 0 ? (_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "No active bets." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "modern-table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Event" }), _jsx("th", { children: "Stake" }), _jsx("th", { children: "Odds" }), _jsx("th", { children: "Potential Win" }), _jsx("th", { children: "Risk" }), _jsx("th", { children: "Expires At" })] }) }), _jsx("tbody", { children: activeBets.map(bet => (_jsxs("tr", { children: [_jsx("td", { children: bet.event }), _jsxs("td", { children: ["$", bet.stake] }), _jsx("td", { children: bet.odds }), _jsxs("td", { children: ["$", bet.potentialWin] }), _jsx("td", { className: getRiskColor(bet.risk), children: bet.risk }), _jsx("td", { children: new Date(bet.expiresAt).toLocaleString() })] }, bet.id))) })] }) }))] })] }))] }), isModalOpen && (_jsx("div", { className: "modal-backdrop", children: _jsxs("div", { className: "modal", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Create New Profile" }), _jsx(CreateProfileForm, { onSuccess: (profile) => {
                                    setProfiles((prev) => [...prev, profile]);
                                    setIsModalOpen(false);
                                }, onCancel: () => setIsModalOpen(false) })] }) }))] }) }));
};
/**
 * Modal form for creating a new risk profile.
 * Integrates with /api/risk-profiles endpoint.
 */
const CreateProfileForm = ({ onSuccess, onCancel }) => {
    const [form, setForm] = React.useState({
        name: '',
        maxStake: 0,
        maxExposure: 0,
        stopLoss: 0,
        takeProfit: 0,
        kellyFraction: 1,
    });
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === 'name' ? value : Number(value) }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await axios.post('/api/risk-profiles', form);
            onSuccess(res.data);
        }
        catch (err) {
            if (axios.isAxiosError && axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Failed to create profile');
            }
            else if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError('Failed to create profile');
            }
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Name" }), _jsx("input", { name: "name", value: form.name, onChange: handleChange, className: "modern-input w-full", required: true, placeholder: "Profile Name", title: "Profile Name" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Max Stake" }), _jsx("input", { name: "maxStake", type: "number", value: form.maxStake, onChange: handleChange, className: "modern-input w-full", min: 0, required: true, placeholder: "Max Stake", title: "Max Stake" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Max Exposure" }), _jsx("input", { name: "maxExposure", type: "number", value: form.maxExposure, onChange: handleChange, className: "modern-input w-full", min: 0, required: true, placeholder: "Max Exposure", title: "Max Exposure" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Stop Loss" }), _jsx("input", { name: "stopLoss", type: "number", value: form.stopLoss, onChange: handleChange, className: "modern-input w-full", min: 0, required: true, placeholder: "Stop Loss", title: "Stop Loss" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Take Profit" }), _jsx("input", { name: "takeProfit", type: "number", value: form.takeProfit, onChange: handleChange, className: "modern-input w-full", min: 0, required: true, placeholder: "Take Profit", title: "Take Profit" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Kelly Fraction" }), _jsx("input", { name: "kellyFraction", type: "number", value: form.kellyFraction, onChange: handleChange, className: "modern-input w-full", min: 0.01, step: 0.01, required: true, placeholder: "Kelly Fraction", title: "Kelly Fraction" })] })] }), error && _jsx("div", { className: "text-red-600 text-sm", children: error }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("button", { type: "submit", className: "modern-button", disabled: submitting, children: submitting ? 'Creating...' : 'Create' }), _jsx("button", { type: "button", className: "modern-button", onClick: onCancel, disabled: submitting, children: "Cancel" })] })] }));
};
export default RiskManagerPage;
