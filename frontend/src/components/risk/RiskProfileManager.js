import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import { useRiskProfile } from '../../hooks/useRiskProfile';
export const RiskProfileManager = () => {
    const { activeProfile, profiles, isLoading, error, updateProfile, setActiveProfile } = useRiskProfile();
    const [selectedProfile, setSelectedProfile] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedProfile, setEditedProfile] = React.useState(activeProfile);
    React.useEffect(() => {
        if (activeProfile) {
            setSelectedProfile(activeProfile.id);
            setEditedProfile(activeProfile);
        }
    }, [activeProfile]);
    const handleProfileSelect = async (profileId) => {
        setSelectedProfile(profileId);
        await setActiveProfile(profileId);
    };
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleSave = async () => {
        if (editedProfile) {
            const success = await updateProfile(editedProfile);
            if (success) {
                setIsEditing(false);
            }
        }
    };
    const handleCancel = () => {
        setEditedProfile(activeProfile);
        setIsEditing(false);
    };
    const handleProfileChange = (field, value) => {
        if (editedProfile) {
            setEditedProfile(prev => ({
                ...prev,
                [field]: value,
                updatedAt: Date.now(),
            }));
        }
    };
    if (isLoading) {
        return (_jsx(Box, { alignItems: "center", display: "flex", justifyContent: "center", minHeight: "200px", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsxs(Alert, { severity: "error", sx: { mb: 2 }, children: ["Error loading risk profiles: ", error.message] }));
    }
    return (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h5", children: "Risk Profile Management" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, md: 4, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(FormControl, { fullWidth: true, sx: { mb: 2 }, children: [_jsx(InputLabel, { children: "Select Profile" }), _jsx(Select, { label: "Select Profile", value: selectedProfile, onChange: e => handleProfileSelect(e.target.value), children: profiles.map(profile => (_jsx(MenuItem, { value: profile.id, children: profile.name }, profile.id))) })] }), activeProfile && (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: activeProfile.name }), isEditing ? (_jsxs(Box, { children: [_jsx(Typography, { gutterBottom: true, children: "Maximum Stake" }), _jsx(Slider, { max: 1000, min: 10, step: 10, sx: { mb: 2 }, value: editedProfile?.maxStake || 0, valueLabelDisplay: "auto", onChange: (_, value) => handleProfileChange('maxStake', value) }), _jsx(Typography, { gutterBottom: true, children: "Minimum Stake" }), _jsx(Slider, { max: 100, min: 1, step: 1, sx: { mb: 2 }, value: editedProfile?.minStake || 0, valueLabelDisplay: "auto", onChange: (_, value) => handleProfileChange('minStake', value) }), _jsx(Typography, { gutterBottom: true, children: "Confidence Threshold" }), _jsx(Slider, { max: 0.95, min: 0.5, step: 0.05, sx: { mb: 2 }, value: editedProfile?.confidenceThreshold || 0, valueLabelDisplay: "auto", onChange: (_, value) => handleProfileChange('confidenceThreshold', value) }), _jsxs(Box, { display: "flex", gap: 1, mt: 2, children: [_jsx(Button, { fullWidth: true, color: "primary", variant: "contained", onClick: handleSave, children: "Save Changes" }), _jsx(Button, { fullWidth: true, variant: "outlined", onClick: handleCancel, children: "Cancel" })] })] })) : (_jsxs(Box, { children: [_jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Maximum Stake: $", activeProfile.maxStake] }), _jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Minimum Stake: $", activeProfile.minStake] }), _jsxs(Typography, { gutterBottom: true, color: "text.secondary", variant: "body2", children: ["Confidence Threshold: ", (activeProfile.confidenceThreshold * 100).toFixed(0), "%"] }), _jsx(Button, { fullWidth: true, color: "primary", sx: { mt: 2 }, variant: "contained", onClick: handleEdit, children: "Edit Profile" })] }))] }))] }) }) }), _jsx(Grid, { item: true, md: 8, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", children: "Risk Profile Statistics" }), activeProfile && (_jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Maximum Exposure" }), _jsxs(Typography, { variant: "h6", children: ["$", activeProfile.maxExposure] })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Volatility Threshold" }), _jsxs(Typography, { variant: "h6", children: [(activeProfile.volatilityThreshold * 100).toFixed(0), "%"] })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Stop Loss" }), _jsxs(Typography, { variant: "h6", children: [(activeProfile.stopLossPercentage * 100).toFixed(0), "%"] })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { color: "text.secondary", variant: "body2", children: "Take Profit" }), _jsxs(Typography, { variant: "h6", children: [(activeProfile.takeProfitPercentage * 100).toFixed(0), "%"] })] })] }))] }) }) })] })] }));
};
