import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RiskHeatMap = ({ riskScores }) => (_jsxs("div", { className: "risk-heatmap", children: [_jsx("div", { children: "Risk Heat Map:" }), _jsx("div", { style: { display: 'flex' }, children: riskScores.map((score, idx) => (_jsx("div", { style: {
                    width: 20,
                    height: 20,
                    background: `rgba(255,0,0,${score})`,
                    margin: 2,
                }, title: `Risk: ${score}` }, idx))) })] }));
export default RiskHeatMap;
