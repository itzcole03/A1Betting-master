import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../providers/useAuth';
const RegisterForm = ({ onSuccess, onToggleForm }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.username) {
            setError('All fields are required');
            return false;
        }
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
        if (!validateForm())
            return;
        setIsLoading(true);
        try {
            await register(formData.email, formData.password, formData.username);
            onSuccess?.();
        }
        catch (err) {
            setError('Registration failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(motion.div, { animate: { opacity: 1, y: 0 }, className: "w-full max-w-md mx-auto", exit: { opacity: 0, y: -20 }, initial: { opacity: 0, y: 20 }, children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "username", children: "Username" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "username", name: "username", placeholder: "johndoe", type: "text", value: formData.username, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "email", children: "Email" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "email", name: "email", placeholder: "you@example.com", type: "email", value: formData.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "password", children: "Password" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "password", name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", type: "password", value: formData.password, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "confirmPassword", name: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", type: "password", value: formData.confirmPassword, onChange: handleChange })] }), error && (_jsx(motion.p, { animate: { opacity: 1 }, className: "text-sm text-red-600 dark:text-red-400", initial: { opacity: 0 }, children: error })), _jsx("button", { className: "btn-primary w-full flex justify-center", disabled: isLoading, type: "submit", children: isLoading ? (_jsxs("svg", { className: "animate-spin h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", fill: "currentColor" })] })) : ('Sign Up') }), _jsxs("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: ["Already have an account?", ' ', _jsx("button", { className: "text-primary-600 dark:text-primary-400 hover:underline focus:outline-none", type: "button", onClick: onToggleForm, children: "Sign in" })] })] }) }));
};
export default React.memo(RegisterForm);
