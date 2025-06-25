import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export const SHAPInsight = ({ modelName, shapData }) => {
    return (_jsxs("div", { className: "shap-insight border p-2 m-2 rounded bg-white shadow", children: [_jsxs("h4", { className: "font-semibold", children: [modelName, " SHAP Feature Importance"] }), _jsx("ul", { children: Object.entries(shapData).map(([feature, value]) => (_jsxs("li", { children: [feature, ": ", value.toFixed(3)] }, feature))) })] }));
};
