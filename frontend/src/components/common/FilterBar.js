import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { FaFilter, FaChartBar, FaPercentage, FaMoneyBillWave, FaFire } from 'react-icons/fa';
// import { useStore } from '../store/useStore';
const filterVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};
const sportFilters = [
    { id: 'NBA', label: 'NBA' },
    { id: 'NFL', label: 'NFL' },
    { id: 'MLB', label: 'MLB' },
    { id: 'NHL', label: 'NHL' }
];
const propTypeFilters = [
    { id: 'POINTS', label: 'Points' },
    { id: 'REBOUNDS', label: 'Rebounds' },
    { id: 'ASSISTS', label: 'Assists' },
    { id: 'THREES', label: '3-Pointers' },
    { id: 'STEALS', label: 'Steals' },
    { id: 'BLOCKS', label: 'Blocks' }
];
const confidenceFilters = [
    { id: 'high', label: 'High Confidence (65%+)', icon: FaFire },
    { id: 'medium', label: 'Medium Confidence (55-65%)', icon: FaChartBar },
    { id: 'low', label: 'Low Confidence (<55%)', icon: FaPercentage }
];
const payoutFilters = [
    { id: 'high', label: 'High Payout (5x+)', icon: FaMoneyBillWave },
    { id: 'medium', label: 'Medium Payout (2-5x)', icon: FaMoneyBillWave },
    { id: 'low', label: 'Low Payout (<2x)', icon: FaMoneyBillWave }
];
export const FilterBar = () => {
    // const { activeFilters, toggleFilter } = useStore();
    const isFilterActive = (filterId) => {
        // if (activeFilters) {
        //   return activeFilters.has(filterId);
        // }
        return false;
    };
    const FilterButton = ({ id, label, icon: Icon }) => (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, 
        // onClick={() => toggleFilter(id)}
        className: `
        inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
        transition-colors duration-200
        ${isFilterActive(id)
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
      `, children: [Icon && _jsx(Icon, { className: "w-4 h-4 mr-2" }), label] }));
    return (_jsxs(motion.div, { variants: filterVariants, initial: "initial", animate: "animate", exit: "exit", className: "glass-morphism rounded-xl p-6 mb-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaFilter, { className: "w-5 h-5 text-primary-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Filters" })] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Sports" }), _jsx("div", { className: "flex flex-wrap gap-2", children: sportFilters.map(({ id, label }) => (_jsx(FilterButton, { id: id, label: label }, id))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Prop Types" }), _jsx("div", { className: "flex flex-wrap gap-2", children: propTypeFilters.map(({ id, label }) => (_jsx(FilterButton, { id: id, label: label }, id))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Confidence Level" }), _jsx("div", { className: "flex flex-wrap gap-2", children: confidenceFilters.map(({ id, label, icon }) => (_jsx(FilterButton, { id: `confidence_${id}`, label: label, icon: icon }, id))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Potential Payout" }), _jsx("div", { className: "flex flex-wrap gap-2", children: payoutFilters.map(({ id, label, icon }) => (_jsx(FilterButton, { id: `payout_${id}`, label: label, icon: icon }, id))) })] })] }));
};
