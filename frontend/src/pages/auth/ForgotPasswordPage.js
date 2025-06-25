import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Link, Typography, Alert } from '@mui/material';
import { apiService } from '@/services/api';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);
        try {
            await apiService.forgotPassword(email);
            setSuccess(true);
        }
        catch (err) {
            setError('Failed to send reset email. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Box, { component: "form", sx: { width: '100%' }, onSubmit: handleSubmit, children: [_jsx(Typography, { sx: { mb: 2 }, variant: "h6", children: "Reset your password" }), _jsx(Typography, { sx: { mb: 3 }, variant: "body2", children: "Enter your email address and we'll send you a link to reset your password." }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), success && (_jsx(Alert, { severity: "success", sx: { mb: 2 }, children: "Password reset email sent. Please check your inbox." })), _jsx(TextField, { autoFocus: true, fullWidth: true, required: true, autoComplete: "email", id: "email", label: "Email Address", margin: "normal", name: "email", value: email, onChange: e => setEmail(e.target.value) }), _jsx(Button, { fullWidth: true, disabled: isLoading, sx: { mt: 3, mb: 2 }, type: "submit", variant: "contained", children: isLoading ? 'Sending...' : 'Send Reset Link' }), _jsx(Box, { sx: { textAlign: 'center' }, children: _jsx(Link, { component: RouterLink, to: "/login", variant: "body2", children: "Back to Sign In" }) })] }));
}
