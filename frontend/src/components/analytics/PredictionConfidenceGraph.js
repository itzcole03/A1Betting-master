import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePredictionStore } from '../../stores/predictionStore';
const PredictionConfidenceGraph = () => {
    const predictions = usePredictionStore(state => state.getLatestPredictions());
    return (_jsxs("div", { children: [_jsx("h3", { children: "Prediction Confidence Over Time" }), _jsx("svg", { width: "400", height: "100", children: predictions.map((p, i) => (_jsx("circle", { cx: i * 20 + 10, cy: 100 - (p.confidence || 0) * 100, r: 4, fill: "blue" }, i))) })] }));
};
export default PredictionConfidenceGraph;
