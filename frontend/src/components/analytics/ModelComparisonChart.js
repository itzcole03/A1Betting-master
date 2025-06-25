import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePredictionStore } from '../../stores/predictionStore';
const ModelComparisonChart = () => {
    const predictions = usePredictionStore(state => state.getLatestPredictions());
    // Group by modelId
    const byModel = predictions.reduce((acc, p) => {
        const model = p.analytics?.modelId || 'unknown';
        if (!acc[model])
            acc[model] = [];
        acc[model].push(p);
        return acc;
    }, {});
    return (_jsxs("div", { children: [_jsx("h3", { children: "Model Comparison" }), _jsx("ul", { children: Object.entries(byModel).map(([model, preds]) => (_jsxs("li", { children: [model, ": ", preds.length, " predictions"] }, model))) })] }));
};
export default ModelComparisonChart;
