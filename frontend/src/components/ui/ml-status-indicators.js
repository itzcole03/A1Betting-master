import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const MLStatusIndicators = ({ models }) => {
    const activeModels = models.filter(m => m.status === 'active');
    const trainingModels = models.filter(m => m.status === 'training');
    const errorModels = models.filter(m => m.status === 'error');
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-success-500';
            case 'training':
                return 'bg-warning-500';
            case 'error':
                return 'bg-error-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return '\u2713';
            case 'training':
                return '\u27f3';
            case 'error':
                return '\u26a0';
            default:
                return '?';
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsx("div", { className: "glass-premium p-4 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Active Models" }), _jsx("div", { className: "text-2xl font-bold text-success-500", children: activeModels.length })] }), _jsx("div", { className: "text-3xl text-success-500", children: "\u2713" })] }) }), _jsx("div", { className: "glass-premium p-4 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Training" }), _jsx("div", { className: "text-2xl font-bold text-warning-500", children: trainingModels.length })] }), _jsx("div", { className: "text-3xl text-warning-500 animate-spin-slow", children: "\u27F3" })] }) }), _jsx("div", { className: "glass-premium p-4 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Errors" }), _jsx("div", { className: "text-2xl font-bold text-error-500", children: errorModels.length })] }), _jsx("div", { className: "text-3xl text-error-500", children: "\u26A0" })] }) })] }), _jsx("div", { className: "space-y-2", children: models.map(model => (_jsxs("div", { className: `glass-premium p-4 rounded-xl model-status ${model.status === 'active' ? 'model-active' :
                        model.status === 'training' ? 'model-training' :
                            'model-error'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: model.name }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Last update: ", new Date(model.lastUpdate).toLocaleString()] })] }), _jsx("div", { className: `text-3xl ${getStatusColor(model.status)}`, children: getStatusIcon(model.status) })] }), _jsx("div", { className: "mt-2", children: _jsx(ModelConfidenceIndicator, { confidence: model.confidence }) })] }, model.id))) })] }));
};
export const ModelConfidenceIndicator = ({ confidence, size = 'md' }) => {
    const getColor = (c) => {
        if (c >= 0.8)
            return 'bg-success-500';
        if (c >= 0.6)
            return 'bg-warning-500';
        return 'bg-error-500';
    };
    const sizeMap = {
        sm: 'h-2 w-16',
        md: 'h-3 w-24',
        lg: 'h-4 w-32'
    };
    return (_jsx("div", { className: `rounded-full ${getColor(confidence)} ${sizeMap[size]}` }));
};
export const ModelStatusBadge = ({ status }) => {
    const colorMap = {
        active: 'bg-success-500',
        training: 'bg-warning-500',
        error: 'bg-error-500'
    };
    return (_jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold text-white ${colorMap[status]}`, children: status }));
};
