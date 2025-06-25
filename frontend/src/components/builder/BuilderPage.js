import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BuilderPage = ({ model = "page", content, url, }) => {
    // Builder.io completely removed - redirect to main app
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center", children: _jsxs("div", { className: "text-center p-8", children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4", children: "Elite Sports Intelligence Platform" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Builder.io integration has been disabled" }), _jsx("p", { className: "text-cyan-400", children: "Redirecting to native Elite platform..." })] }) }));
};
export default BuilderPage;
