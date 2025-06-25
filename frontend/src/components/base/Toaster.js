import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle as AlertCircleIcon } from 'lucide-react';
const Toast = ({ id, message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [id, onDismiss]);
    const icons = {
        success: _jsx(CheckCircle, { className: "w-6 h-6 text-green-400" }),
        error: _jsx(AlertTriangle, { className: "w-6 h-6 text-red-400" }),
        info: _jsx(Info, { className: "w-6 h-6 text-blue-400" }),
        warning: _jsx(AlertCircleIcon, { className: "w-6 h-6 text-yellow-400" }),
    };
    const borderColors = {
        success: 'border-green-500',
        error: 'border-red-500',
        info: 'border-blue-500',
        warning: 'border-yellow-500',
    };
    return (_jsxs(motion.div, { layout: true, animate: { opacity: 1, y: 0, scale: 1 }, className: `px-6 py-4 rounded-2xl shadow-2xl flex items-start space-x-3 glass modern-card bg-gradient-to-br from-primary-700/90 to-primary-500/80 border-l-4 ${borderColors[type]} min-w-[320px] max-w-md animate-fade-in`, exit: { opacity: 0, x: '100%', scale: 0.5 }, initial: { opacity: 0, y: 50, scale: 0.3 }, transition: { type: 'spring', stiffness: 200, damping: 25 }, children: [_jsx("div", { className: "flex-shrink-0", children: icons[type] }), _jsx("div", { className: "flex-grow", children: _jsx("p", { className: "text-base font-semibold text-white drop-shadow-lg", children: message }) }), _jsx("button", { "aria-label": "Dismiss notification", className: "ml-auto -mr-1 -mt-1 p-2 rounded-full hover:bg-primary/20 transition-colors", onClick: () => onDismiss(id), children: _jsx(X, { className: "text-white", size: 20 }) })] }));
};
const Toaster = () => {
    const toasts = useAppStore((state) => state.toasts);
    const removeToast = useAppStore((state) => state.removeToast);
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-[100] space-y-3", children: _jsx(AnimatePresence, { initial: false, children: toasts.map(toast => (_jsx(Toast, { ...toast, onDismiss: removeToast }, toast.id))) }) }));
};
export default React.memo(Toaster);
