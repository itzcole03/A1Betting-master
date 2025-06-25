import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Link, Alert, CircularProgress, } from '@mui/material';
import { useStore } from '@/store';
import { authService } from '@/services/auth';
export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const from = location.state?.from?.pathname || '/';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
            navigate(from, { replace: true });
        }
        catch (err) {
            setError('Invalid email or password');
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
        }, children: _jsx(Card, { sx: { maxWidth: 400, width: '100%', mx: 2 }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(Typography, { gutterBottom: true, align: "center", variant: "h4", children: "Welcome Back" }), _jsx(Typography, { align: "center", color: "text.secondary", sx: { mb: 4 }, variant: "body2", children: "Sign in to continue to Betting Analyzer" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { autoFocus: true, fullWidth: true, required: true, label: "Email", margin: "normal", type: "email", value: email, onChange: e => setEmail(e.target.value) }), _jsx(TextField, { fullWidth: true, required: true, label: "Password", margin: "normal", type: "password", value: password, onChange: e => setPassword(e.target.value) }), error && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error })), _jsx(Button, { fullWidth: true, disabled: loading, size: "large", sx: { mt: 3, mb: 2 }, type: "submit", variant: "contained", children: loading ? _jsx(CircularProgress, { size: 24 }) : 'Sign In' }), _jsx(Box, { sx: { textAlign: 'center' }, children: _jsx(Link, { component: "button", variant: "body2", onClick: () => navigate('/register'), children: "Don't have an account? Sign up" }) })] })] }) }) }));
}
