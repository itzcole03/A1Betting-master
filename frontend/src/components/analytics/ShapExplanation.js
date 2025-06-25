import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePredictionStore } from '../../stores/predictionStore';
const ShapExplanation = ({ eventId }) => {
    const prediction = usePredictionStore(state => state.predictionsByEvent[eventId]);
    const shap = prediction?.analytics?.shap;
    if (!shap)
        return _jsx("div", { children: "No SHAP data available." });
    return (_jsxs("div", { children: [_jsx("h3", { children: "SHAP Feature Importances" }), _jsx("ul", { children: shap.featureImportances?.map((f) => (_jsxs("li", { children: [f.feature, ": ", f.value] }, f.feature))) })] }));
};
export default ShapExplanation;
