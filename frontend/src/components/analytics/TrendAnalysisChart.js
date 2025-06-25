import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePredictionStore } from '../../stores/predictionStore';
const TrendAnalysisChart = () => {
    const predictions = usePredictionStore(state => state.getLatestPredictions());
    // Collect pattern anomalies
    const anomalies = predictions.flatMap(p => p.analytics?.patterns?.inefficiencies || []);
    return (_jsxs("div", { children: [_jsx("h3", { children: "Trend Analysis" }), _jsx("ul", { children: anomalies.map((a, i) => (_jsxs("li", { children: [a.type, " ", a.detected ? 'Detected' : 'Not Detected'] }, i))) })] }));
};
export default TrendAnalysisChart;
