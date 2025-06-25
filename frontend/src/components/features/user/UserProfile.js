import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Avatar, Button, TextField, IconButton, Divider, Chip, Alert, Snackbar, CircularProgress, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon, } from '@mui/icons-material';
const ProfileCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));
const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: `4px solid ${theme.palette.primary.main}`,
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.8,
    },
}));
const DEFAULT_PROFILE = {
    id: '1',
    username: 'betpro_user',
    email: 'user@example.com',
    fullName: 'John Doe',
    avatar: '/default-avatar.png',
    bio: 'Sports betting enthusiast and data analyst',
    location: 'New York, USA',
    joinDate: '2024-01-01',
    stats: {
        totalBets: 150,
        winningBets: 85,
        totalWagered: 5000,
        netProfit: 1250,
        winRate: 56.7,
    },
    preferences: {
        favoriteSports: ['NBA', 'NFL', 'MLB'],
        favoriteTeams: ['Lakers', '49ers', 'Yankees'],
        bettingStyle: 'Value Betting',
    },
};
export const UserProfile = () => {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const handleEdit = () => {
        setEditedProfile(profile);
        setIsEditing(true);
    };
    const handleCancel = () => {
        setIsEditing(false);
    };
    const handleSave = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement profile update API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setProfile(editedProfile);
            setIsEditing(false);
            setSnackbar({
                open: true,
                message: 'Profile updated successfully',
                severity: 'success',
            });
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update profile',
                severity: 'error',
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedProfile(prev => ({
                    ...prev,
                    avatar: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsx(ProfileCard, { children: _jsxs(CardContent, { children: [_jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, md: 4, sx: { textAlign: 'center' }, children: [_jsxs(Box, { position: "relative", display: "inline-block", children: [_jsx(StyledAvatar, { src: isEditing ? editedProfile.avatar : profile.avatar, alt: profile.fullName }), isEditing && (_jsxs(IconButton, { component: "label", sx: {
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark',
                                                },
                                            }, children: [_jsx("input", { type: "file", hidden: true, accept: "image/*", onChange: handleAvatarChange }), _jsx(PhotoCameraIcon, {})] }))] }), _jsx(Typography, { variant: "h5", sx: { mt: 2 }, children: isEditing ? (_jsx(TextField, { fullWidth: true, value: editedProfile.fullName, onChange: (e) => handleInputChange('fullName', e.target.value) })) : (profile.fullName) }), _jsxs(Typography, { variant: "subtitle1", color: "textSecondary", children: ["@", isEditing ? (_jsx(TextField, { fullWidth: true, value: editedProfile.username, onChange: (e) => handleInputChange('username', e.target.value) })) : (profile.username)] })] }), _jsxs(Grid, { item: true, xs: 12, md: 8, children: [_jsx(Box, { display: "flex", justifyContent: "flex-end", mb: 2, children: isEditing ? (_jsxs(_Fragment, { children: [_jsx(Button, { startIcon: _jsx(CancelIcon, {}), onClick: handleCancel, sx: { mr: 1 }, children: "Cancel" }), _jsx(Button, { startIcon: _jsx(SaveIcon, {}), variant: "contained", onClick: handleSave, disabled: isLoading, children: isLoading ? _jsx(CircularProgress, { size: 24 }) : 'Save' })] })) : (_jsx(Button, { startIcon: _jsx(EditIcon, {}), onClick: handleEdit, children: "Edit Profile" })) }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Bio" }), isEditing ? (_jsx(TextField, { fullWidth: true, multiline: true, rows: 3, value: editedProfile.bio, onChange: (e) => handleInputChange('bio', e.target.value) })) : (_jsx(Typography, { children: profile.bio }))] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Email" }), isEditing ? (_jsx(TextField, { fullWidth: true, type: "email", value: editedProfile.email, onChange: (e) => handleInputChange('email', e.target.value) })) : (_jsx(Typography, { children: profile.email }))] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Location" }), isEditing ? (_jsx(TextField, { fullWidth: true, value: editedProfile.location, onChange: (e) => handleInputChange('location', e.target.value) })) : (_jsx(Typography, { children: profile.location }))] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, { sx: { my: 2 } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Betting Statistics" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, sm: 4, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Total Bets" }), _jsx(Typography, { variant: "h6", children: profile.stats.totalBets })] }), _jsxs(Grid, { item: true, xs: 6, sm: 4, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Win Rate" }), _jsxs(Typography, { variant: "h6", children: [profile.stats.winRate, "%"] })] }), _jsxs(Grid, { item: true, xs: 6, sm: 4, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Net Profit" }), _jsxs(Typography, { variant: "h6", color: profile.stats.netProfit >= 0 ? 'success.main' : 'error.main', children: ["$", profile.stats.netProfit.toLocaleString()] })] })] })] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Divider, { sx: { my: 2 } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Preferences" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Favorite Sports" }), _jsx(Box, { sx: { mt: 1 }, children: profile.preferences.favoriteSports.map((sport) => (_jsx(Chip, { label: sport, sx: { mr: 1, mb: 1 } }, sport))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Favorite Teams" }), _jsx(Box, { sx: { mt: 1 }, children: profile.preferences.favoriteTeams.map((team) => (_jsx(Chip, { label: team, sx: { mr: 1, mb: 1 } }, team))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Betting Style" }), _jsx(Typography, { children: profile.preferences.bettingStyle })] })] })] })] })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 6000, onClose: () => setSnackbar(prev => ({ ...prev, open: false })), children: _jsx(Alert, { onClose: () => setSnackbar(prev => ({ ...prev, open: false })), severity: snackbar.severity, sx: { width: '100%' }, children: snackbar.message }) })] }) }));
};
