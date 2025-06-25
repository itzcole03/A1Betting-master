import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../providers/useAuth';
const LoginForm = ({ onSuccess, onToggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            onSuccess?.();
        }
        catch (err) {
            setError('Invalid email or password');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(motion.div, { animate: { opacity: 1, y: 0 }, className: "w-full max-w-md mx-auto", exit: { opacity: 0, y: -20 }, initial: { opacity: 0, y: 20 }, children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "email", children: "Email" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "email", placeholder: "you@example.com", type: "email", value: email, onChange: e => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", htmlFor: "password", children: "Password" }), _jsx("input", { required: true, className: "input-primary mt-1", id: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", type: "password", value: password, onChange: e => setPassword(e.target.value) })] }), error && (_jsx(motion.p, { animate: { opacity: 1 }, className: "text-sm text-red-600 dark:text-red-400", initial: { opacity: 0 }, children: error })), _jsx("button", { className: "btn-primary w-full flex justify-center", disabled: isLoading, type: "submit", children: isLoading ? (_jsxs("svg", { className: "animate-spin h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", fill: "currentColor" })] })) : ('Sign In') }), _jsxs("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: ["Don't have an account?", ' ', _jsx("button", { className: "text-primary-600 dark:text-primary-400 hover:underline focus:outline-none", type: "button", onClick: onToggleForm, children: "Sign up" })] })] }) }));
};
export default React.memo(LoginForm);
