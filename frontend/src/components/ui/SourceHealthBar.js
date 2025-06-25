import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SourceHealthBar = ({ sources }) => (_jsxs("div", { className: "source-health-bar", children: [_jsx("div", { children: "Source Health:" }), _jsx("div", { style: { display: 'flex' }, children: sources.map((src, idx) => (_jsx("div", { style: {
                    width: 60,
                    height: 12,
                    background: src.healthy ? 'green' : 'red',
                    margin: 3,
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 10,
                }, children: src.name }, idx))) })] }));
export default SourceHealthBar;
