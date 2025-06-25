import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { cn } from '../../utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
const variants = {
    label: {
        initial: { y: -10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 10, opacity: 0 },
    },
    error: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
};
const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
};
export const UnifiedInput = React.forwardRef(({ 
// Appearance props
variant = 'default', size = 'md', leftIcon, rightIcon, className, 
// Labels and messages
label, error, info, 
// Validation
validation, 
// Animation
animate = true, 
// Callbacks
onValidationChange, onChange, onBlur, 
// Rest
...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [localError, setLocalError] = useState(error);
    const [isValid, setIsValid] = useState(true);
    useEffect(() => {
        setLocalError(error);
    }, [error]);
    const validate = (value) => {
        if (!validation)
            return true;
        if (validation.required && !value) {
            setLocalError('This field is required');
            setIsValid(false);
            return false;
        }
        if (validation.pattern && value) {
            const regex = new RegExp(validation.pattern);
            if (!regex.test(value)) {
                setLocalError('Invalid format');
                setIsValid(false);
                return false;
            }
        }
        if (props.type === 'number' && value) {
            const num = parseFloat(value);
            if (validation.min !== undefined && num < validation.min) {
                setLocalError(`Value must be at least ${validation.min}`);
                setIsValid(false);
                return false;
            }
            if (validation.max !== undefined && num > validation.max) {
                setLocalError(`Value must be at most ${validation.max}`);
                setIsValid(false);
                return false;
            }
        }
        setLocalError(undefined);
        setIsValid(true);
        return true;
    };
    const handleChange = (e) => {
        setIsDirty(true);
        if (validation && !validation.validateOnBlur) {
            const isValid = validate(e.target.value);
            onValidationChange?.(isValid);
        }
        onChange?.(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        if (validation?.validateOnBlur && isDirty) {
            const isValid = validate(e.target.value);
            onValidationChange?.(isValid);
        }
        onBlur?.(e);
    };
    const handleFocus = (e) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };
    const baseClasses = cn('w-full rounded-lg border px-4 transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-offset-2', sizeClasses[size], {
        'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800': variant === 'default',
        'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20': variant === 'premium',
        'border-red-500 focus:border-red-500 focus:ring-red-500': localError,
        'pl-10': leftIcon,
        'pr-10': rightIcon,
    }, className);
    return (_jsxs("div", { className: "space-y-1", children: [_jsx(AnimatePresence, { children: label && (_jsx(motion.label, { className: "block text-sm font-medium text-gray-700 dark:text-gray-200", ...(animate ? variants.label : {}), children: label })) }), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400", children: leftIcon })), _jsx("input", { ref: ref, className: baseClasses, onBlur: handleBlur, onChange: handleChange, onFocus: handleFocus, ...props }), rightIcon && (_jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400", children: rightIcon }))] }), _jsxs(AnimatePresence, { children: [localError && (_jsxs(motion.p, { className: "text-sm text-red-600 dark:text-red-500 flex items-center gap-1", ...(animate ? variants.error : {}), children: [_jsx(FaExclamationCircle, {}), localError] })), !localError && info && (_jsxs(motion.p, { className: "text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1", ...(animate ? variants.error : {}), children: [_jsx(FaInfoCircle, {}), info] }))] })] }));
});
UnifiedInput.displayName = 'UnifiedInput';
