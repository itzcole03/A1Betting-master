import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSportsFilter } from '@/hooks/useSportsFilter';
import { useQueryClient } from '@tanstack/react-query';
import { LINEUP_QUERY_KEY } from '@/hooks/useLineupAPI';
import { PREDICTIONS_QUERY_KEY } from '@/hooks/usePredictions';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useFilterStore } from '@/stores/filterStore';
const modelOptions = [
    { value: 'default', label: 'Default' },
    { value: 'ensemble', label: 'Ensemble' },
    { value: 'experimental', label: 'Experimental' },
];
export function SmartControlsBar({ className = '' }) {
    const { sports, activeSport, setActiveSport } = useSportsFilter();
    const queryClient = useQueryClient();
    const { riskProfile, setRiskProfile, stakeSizing, setStakeSizing, model, setModel, confidenceThreshold, setConfidenceThreshold, } = useFilterStore();
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: [LINEUP_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [PREDICTIONS_QUERY_KEY] });
    };
    return (_jsxs("div", { className: `flex flex-wrap items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 gap-4 ${className}`, children: [_jsx("div", { className: "flex items-center space-x-4", children: sports.map(sport => (_jsxs("button", { className: `flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${activeSport?.id === sport.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`, onClick: () => setActiveSport(sport), children: [_jsx("span", { className: "text-xl", children: sport.icon }), _jsx("span", { className: "font-medium", children: sport.name })] }, sport.id))) }), _jsxs("div", { className: "flex flex-wrap items-center space-x-4 gap-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Model:" }), _jsx("select", { className: "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700", value: model, onChange: e => setModel(e.target.value), children: modelOptions.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Risk Profile:" }), _jsxs("select", { className: "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700", value: riskProfile, onChange: e => setRiskProfile(e.target.value), children: [_jsx("option", { value: "conservative", children: "Conservative" }), _jsx("option", { value: "balanced", children: "Balanced" }), _jsx("option", { value: "aggressive", children: "Aggressive" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Stake Sizing:" }), _jsx("input", { className: "w-24 accent-primary-500", max: 20, min: 1, step: 1, type: "range", value: stakeSizing, onChange: e => setStakeSizing(Number(e.target.value)) }), _jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [stakeSizing, "%"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Confidence Threshold:" }), _jsxs("select", { className: "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700", value: confidenceThreshold, onChange: e => setConfidenceThreshold(Number(e.target.value)), children: [_jsx("option", { value: 0, children: "All" }), _jsx("option", { value: 0.7, children: "70%+" }), _jsx("option", { value: 0.8, children: "80%+" }), _jsx("option", { value: 0.9, children: "90%+" })] })] }), _jsxs("button", { className: "flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600", onClick: handleRefresh, children: [_jsx(ArrowPathIcon, { className: "h-5 w-5" }), _jsx("span", { children: "Refresh Data" })] })] })] }));
}
