import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, TextField, Link, Typography, Alert, Grid } from '@mui/material';
import { useStore } from '@/store';
import { apiService } from '@/services/api';
export default function RegisterPage() {
    const navigate = useNavigate();
    const setUser = useStore(state => state.setUser);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            const user = await apiService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            });
            setUser(user);
            navigate('/dashboard');
        }
        catch (err) {
            setError('Failed to create account. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Box, { component: "form", sx: { width: '100%' }, onSubmit: handleSubmit, children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, sm: 6, xs: 12, children: _jsx(TextField, { fullWidth: true, required: true, autoComplete: "given-name", id: "firstName", label: "First Name", name: "firstName", value: formData.firstName, onChange: handleChange }) }), _jsx(Grid, { item: true, sm: 6, xs: 12, children: _jsx(TextField, { fullWidth: true, required: true, autoComplete: "family-name", id: "lastName", label: "Last Name", name: "lastName", value: formData.lastName, onChange: handleChange }) })] }), _jsx(TextField, { fullWidth: true, required: true, autoComplete: "email", id: "email", label: "Email Address", margin: "normal", name: "email", value: formData.email, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, autoComplete: "new-password", id: "password", label: "Password", margin: "normal", name: "password", type: "password", value: formData.password, onChange: handleChange }), _jsx(TextField, { fullWidth: true, required: true, autoComplete: "new-password", id: "confirmPassword", label: "Confirm Password", margin: "normal", name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange }), _jsx(Button, { fullWidth: true, disabled: isLoading, sx: { mt: 3, mb: 2 }, type: "submit", variant: "contained", children: isLoading ? 'Creating Account...' : 'Sign Up' }), _jsx(Box, { sx: { textAlign: 'center' }, children: _jsxs(Typography, { variant: "body2", children: ["Already have an account?", ' ', _jsx(Link, { component: RouterLink, to: "/login", variant: "body2", children: "Sign in" })] }) })] }));
}
