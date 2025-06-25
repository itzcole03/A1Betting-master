import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePredictionStore } from '../../stores/predictionStore';
const RiskAssessmentMatrix = () => {
    const predictions = usePredictionStore(state => state.getLatestPredictions());
    const riskCounts = predictions.reduce((acc, p) => {
        const cat = p.analytics?.risk?.riskCategory || 'unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    return (_jsxs("div", { children: [_jsx("h3", { children: "Risk Assessment Matrix" }), _jsx("ul", { children: Object.entries(riskCounts).map(([cat, count]) => (_jsxs("li", { children: [cat, ": ", count] }, cat))) })] }));
};
export default RiskAssessmentMatrix;
