import { jsxs as _jsxs } from "react/jsx-runtime";
const ConfidenceBands = ({ lower, upper, mean }) => (_jsxs("div", { className: "confidence-bands", children: [_jsxs("div", { children: ["Confidence Interval: ", lower, " - ", upper] }), _jsxs("div", { children: ["Mean: ", mean] })] }));
export default ConfidenceBands;
