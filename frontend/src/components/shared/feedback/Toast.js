import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import useStore from '../../../store/useStore';
import { m, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
const toastVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};
const toastIcons = {
    success: _jsx(CheckCircleIcon, { className: "h-6 w-6 text-green-500" }),
    error: _jsx(ExclamationCircleIcon, { className: "h-6 w-6 text-red-500" }),
    info: _jsx(InformationCircleIcon, { className: "h-6 w-6 text-blue-500" }),
    warning: _jsx(ExclamationCircleIcon, { className: "h-6 w-6 text-yellow-500" }),
};
const toastColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
};
const ToastItem = ({ toast }) => {
    const { removeToast } = useStore();
    return (_jsxs(m.div, { layout: true, animate: "animate", className: `flex items-start p-4 mb-4 rounded-lg border ${toastColors[toast.type]} shadow-lg`, exit: "exit", initial: "initial", variants: toastVariants, children: [_jsx("div", { className: "flex-shrink-0", children: toastIcons[toast.type] }), _jsx("div", { className: "ml-3 w-0 flex-1", children: _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: toast.message }) }), _jsx("div", { className: "ml-4 flex-shrink-0 flex", children: _jsx("button", { className: "inline-flex text-gray-400 hover:text-gray-500 focus:outline-none", onClick: () => removeToast(toast.id), title: "Dismiss notification", "aria-label": "Dismiss notification", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) }) })] }));
};
const ToastContainer = () => {
    const toasts = useStore(state => state.toasts);
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]", children: _jsx(AnimatePresence, { mode: "popLayout", children: toasts.map(toast => (_jsx(ToastItem, { toast: toast }, toast.id))) }) }));
};
export default React.memo(ToastContainer);
