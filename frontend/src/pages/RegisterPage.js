import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, CircularProgress, } from '@mui/material';
import { useStore } from '@/store';
import { authService } from '@/services/auth';
export default function RegisterPage() {
    const navigate = useNavigate();
    const { setUser } = useStore();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const response = await authService.register(formData.username, formData.email, formData.password);
            setUser(response.user);
            navigate('/');
        }
        catch (err) {
            setError('Failed to create account. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
        }, children: _jsx(Card, { sx: { maxWidth: 400, width: '100%', mx: 2 }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(Typography, { gutterBottom: true, align: "center", variant: "h4", children: "Create Account" }), _jsx(Typography, { align: "center", color: "text.secondary", sx: { mb: 4 }, variant: "body2", children: "Join Betting Analyzer to start tracking your bets" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { autoFocus: true, fullWidth: true, required: true, label: "Username", margin: "normal", name: "username", value: formData.username, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, label: "Email", margin: "normal", name: "email", type: "email", value: formData.email, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, label: "Password", margin: "normal", name: "password", type: "password", value: formData.password, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, label: "Confirm Password", margin: "normal", name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange }), error && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error })), _jsx(Button, { fullWidth: true, disabled: loading, size: "large", sx: { mt: 3, mb: 2 }, type: "submit", variant: "contained", children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Create Account' }), _jsx(Box, { sx: { textAlign: 'center' }, children: _jsx(Link, { component: "button", variant: "body2", onClick: () => navigate('/login'), children: "Already have an account? Sign in" }) })] })] }) }) }));
}
