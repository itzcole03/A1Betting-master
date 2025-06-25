import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx(motion.div, { animate: { opacity: 1 }, exit: { opacity: 0 }, initial: { opacity: 0 }, children: _jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-blue-950", children: _jsxs(GlassCard, { className: "max-w-lg w-full text-center p-10", children: [_jsx("h1", { className: "text-6xl font-extrabold text-blue-700 dark:text-blue-200 mb-2", children: "404" }), _jsx("h2", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: "The page you're looking for doesn't exist or has been moved." }), _jsx(GlowButton, { onClick: () => navigate('/'), children: "Go to Home" })] }) }) }));
};
export default NotFound;
