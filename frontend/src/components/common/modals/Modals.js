import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-fade-in", onClick: onClose, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.95, opacity: 0, y: 20 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: `modern-card glass bg-gradient-to-br from-primary-700/90 to-primary-500/80 p-8 rounded-3xl shadow-2xl w-full ${sizeClasses[size]} relative flex flex-col max-h-[90vh] animate-fade-in`, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6 border-b border-white/10 pb-4", children: [title && _jsx("h2", { className: "text-2xl font-bold text-white truncate drop-shadow-lg", children: title }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full text-white hover:bg-primary/20 transition-colors", "aria-label": "Close modal", children: _jsx(X, { size: 26 }) })] }), _jsx("div", { className: "overflow-y-auto flex-grow text-white", children: children })] }) })) }));
};
// ModalsManager component has been removed as individual components will manage their modal instances.
// If global modal management is needed, it should be handled via useAppStore.
export { Modal }; // Exporting only the Modal component 
