import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { cn } from '../../utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
const icons = {
    success: (_jsx("svg", { className: "w-6 h-6 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M5 13l4 4L19 7", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }) })),
    error: (_jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M6 18L18 6M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }) })),
    warning: (_jsx("svg", { className: "w-6 h-6 text-yellow-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }) })),
    info: (_jsx("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }) })),
};
const variants = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};
const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose, }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, id, onClose]);
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { animate: { opacity: 1, y: 0, scale: 1 }, className: cn('pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg', variants[type]), exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }, initial: { opacity: 0, y: 50, scale: 0.3 }, children: _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: icons[type] }), _jsxs("div", { className: "ml-3 w-0 flex-1", children: [title && (_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: title })), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: message })] }), _jsx("div", { className: "ml-4 flex flex-shrink-0", children: _jsxs("button", { className: "inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none", type: "button", onClick: () => onClose(id), children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { clipRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", fillRule: "evenodd" }) })] }) })] }) }) }) }));
};
