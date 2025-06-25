import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedServiceRegistry } from '../../services/unified/UnifiedServiceRegistry';
import { Card, Button, Input, Spinner, Toast, Modal } from '../ui/UnifiedUI';
export const UnifiedAuth = () => {
    // Initialize services
    const serviceRegistry = UnifiedServiceRegistry.getInstance();
    const stateService = serviceRegistry.getService('state');
    const notificationService = serviceRegistry.getService('notification');
    const errorService = serviceRegistry.getService('error');
    const settingsService = serviceRegistry.getService('settings');
    // Router hooks
    const navigate = useNavigate();
    const location = useLocation();
    // State
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [toast, setToast] = useState(null);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    // Check for existing session
    useEffect(() => {
        checkSession();
    }, []);
    const checkSession = async () => {
        try {
            const session = await stateService.getState('session');
            if (session?.isValid) {
                navigate('/dashboard');
            }
        }
        catch (error) {
            handleError('Failed to check session', error);
        }
    };
    const validateForm = () => {
        const errors = [];
        // Email validation
        if (!form.email) {
            errors.push({ field: 'email', message: 'Email is required' });
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.push({ field: 'email', message: 'Invalid email format' });
        }
        // Password validation
        if (!form.password) {
            errors.push({ field: 'password', message: 'Password is required' });
        }
        else if (form.password.length < 8) {
            errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
        }
        // Confirm password validation for registration
        if (!isLogin && form.password !== form.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        }
        setValidationErrors(errors);
        return errors.length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            if (isLogin) {
                await handleLogin();
            }
            else {
                await handleRegister();
            }
        }
        catch (error) {
            handleError('Authentication failed', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogin = async () => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: form.email,
                password: form.password,
                rememberMe: form.rememberMe,
            }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const data = await response.json();
        await stateService.setState('session', {
            token: data.token,
            user: data.user,
            isValid: true,
            expiresAt: data.expiresAt,
        });
        setToast({
            message: 'Login successful',
            type: 'success',
        });
        navigate('/dashboard');
    };
    const handleRegister = async () => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: form.email,
                password: form.password,
            }),
        });
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        setShowVerificationModal(true);
        setToast({
            message: 'Registration successful. Please verify your email.',
            type: 'success',
        });
    };
    const handlePasswordReset = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });
            if (!response.ok) {
                throw new Error('Password reset request failed');
            }
            setShowPasswordReset(false);
            setToast({
                message: 'Password reset instructions sent to your email',
                type: 'success',
            });
        }
        catch (error) {
            handleError('Failed to request password reset', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleError = (message, error) => {
        setError(message);
        setToast({ message, type: 'error' });
        errorService.handleError(error, {
            code: 'AUTH_ERROR',
            source: 'UnifiedAuth',
            details: { message },
        });
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8", children: [_jsxs(Card, { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold", children: isLogin ? 'Sign in to your account' : 'Create a new account' }), _jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: isLogin
                                    ? 'Welcome back! Please enter your details.'
                                    : 'Join us today and start betting smarter.' })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "email", children: "Email address" }), _jsx(Input, { required: true, error: validationErrors.find(e => e.field === 'email')?.message, id: "email", type: "email", value: form.email, onChange: e => setForm({ ...form, email: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "password", children: "Password" }), _jsx(Input, { required: true, error: validationErrors.find(e => e.field === 'password')?.message, id: "password", type: "password", value: form.password, onChange: e => setForm({ ...form, password: e.target.value }) })] }), !isLogin && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx(Input, { required: true, error: validationErrors.find(e => e.field === 'confirmPassword')?.message, id: "confirmPassword", type: "password", value: form.confirmPassword, onChange: e => setForm({ ...form, confirmPassword: e.target.value }) })] })), isLogin && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { checked: form.rememberMe, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded", id: "remember-me", type: "checkbox", onChange: e => setForm({ ...form, rememberMe: e.target.checked }) }), _jsx("label", { className: "ml-2 block text-sm text-gray-700 dark:text-gray-300", htmlFor: "remember-me", children: "Remember me" })] }), _jsx("button", { className: "text-sm font-medium text-primary-600 hover:text-primary-500", type: "button", onClick: () => setShowPasswordReset(true), children: "Forgot password?" })] }))] }), _jsx("div", { children: _jsx(Button, { className: "w-full", disabled: loading, type: "submit", variant: "primary", children: loading ? _jsx(Spinner, { size: "small" }) : isLogin ? 'Sign in' : 'Create account' }) }), _jsx("div", { className: "text-center", children: _jsx("button", { className: "text-sm font-medium text-primary-600 hover:text-primary-500", type: "button", onClick: () => setIsLogin(!isLogin), children: isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }) })] })] }), _jsx(Modal, { isOpen: showPasswordReset, title: "Reset Password", onClose: () => setShowPasswordReset(false), children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600", children: "Enter your email address and we'll send you instructions to reset your password." }), _jsx(Input, { placeholder: "Enter your email", type: "email", value: form.email, onChange: e => setForm({ ...form, email: e.target.value }) }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowPasswordReset(false), children: "Cancel" }), _jsx(Button, { disabled: loading, variant: "primary", onClick: handlePasswordReset, children: loading ? _jsx(Spinner, { size: "small" }) : 'Send Instructions' })] })] }) }), _jsx(Modal, { isOpen: showVerificationModal, title: "Verify Your Email", onClose: () => setShowVerificationModal(false), children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-600 mb-6", children: "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account." }), _jsx(Button, { variant: "primary", onClick: () => {
                                setShowVerificationModal(false);
                                setIsLogin(true);
                            }, children: "Return to Login" })] }) }), toast && _jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })] }));
};
