import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { apiService } from '@/services/api';
export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!token) {
            setError('Invalid reset token');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            await apiService.resetPassword(token, formData.password);
            navigate('/login', { state: { message: 'Password reset successful. Please sign in.' } });
        }
        catch (err) {
            setError('Failed to reset password. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!token) {
        return (_jsx(Box, { sx: { width: '100%' }, children: _jsx(Alert, { severity: "error", children: "Invalid or expired reset token. Please request a new password reset link." }) }));
    }
    return (_jsxs(Box, { component: "form", sx: { width: '100%' }, onSubmit: handleSubmit, children: [_jsx(Typography, { sx: { mb: 2 }, variant: "h6", children: "Reset your password" }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsx(TextField, { fullWidth: true, required: true, autoComplete: "new-password", id: "password", label: "New Password", margin: "normal", name: "password", type: "password", value: formData.password, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, autoComplete: "new-password", id: "confirmPassword", label: "Confirm New Password", margin: "normal", name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange }), _jsx(Button, { fullWidth: true, disabled: isLoading, sx: { mt: 3, mb: 2 }, type: "submit", variant: "contained", children: isLoading ? 'Resetting...' : 'Reset Password' })] }));
}
