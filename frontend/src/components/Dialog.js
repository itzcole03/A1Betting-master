import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { cn } from '../../utils/classNames';
import { motion } from 'framer-motion';
const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
};
export const Dialog = ({ isOpen, onClose, title, description, children, footer, size = 'md', className, showClose = true, closeOnOverlayClick = true, preventClose = false, }) => {
    const handleClose = () => {
        if (!preventClose) {
            onClose();
        }
    };
    return (_jsx(Transition, { appear: true, as: Fragment, show: isOpen, children: _jsx(HeadlessDialog, { as: "div", className: "fixed inset-0 z-50 overflow-y-auto", onClose: closeOnOverlayClick ? handleClose : () => { }, children: _jsxs("div", { className: "min-h-screen px-4 text-center", children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx(HeadlessDialog.Overlay, { className: "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" }) }), _jsx("span", { "aria-hidden": "true", className: "inline-block h-screen align-middle", children: "\u200B" }), _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(motion.div, { animate: { opacity: 1, y: 0 }, className: cn('inline-block w-full p-6 my-8 overflow-hidden text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all', sizes[size], className), exit: { opacity: 0, y: 20 }, initial: { opacity: 0, y: 20 }, children: [(title || showClose) && (_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [title && (_jsx(HeadlessDialog.Title, { as: "h3", className: "text-lg font-medium leading-6 text-gray-900 dark:text-gray-100", children: title })), description && (_jsx(HeadlessDialog.Description, { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: description }))] }), showClose && !preventClose && (_jsxs("button", { className: "text-gray-400 hover:text-gray-500 focus:outline-none", type: "button", onClick: handleClose, children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M6 18L18 6M6 6l12 12", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2 }) })] }))] })), _jsx("div", { className: "mt-2", children: children }), footer && _jsx("div", { className: "mt-6 flex justify-end space-x-3", children: footer })] }) })] }) }) }));
};
