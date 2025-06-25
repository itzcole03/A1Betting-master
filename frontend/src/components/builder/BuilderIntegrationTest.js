import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { builder, BuilderComponent } from "@builder.io/react";
const BuilderIntegrationTest = () => {
    const [builderContent, setBuilderContent] = useState(null);
    const [status, setStatus] = useState("loading");
    useEffect(() => {
        const testIntegration = async () => {
            try {
                console.log("Testing Builder.io integration...");
                console.log("API Key:", builder.apiKey);
                // Test fetching content
                const content = await builder
                    .get("page", {
                    url: "/builder-test",
                })
                    .promise();
                console.log("Builder content:", content);
                if (content) {
                    setBuilderContent(content);
                    setStatus("success");
                }
                else {
                    setStatus("no-content");
                }
            }
            catch (error) {
                console.error("Builder.io integration error:", error);
                setStatus("error");
            }
        };
        testIntegration();
    }, []);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-900 mb-2", children: "Builder.io Integration Test" }), _jsx("p", { className: "text-blue-700", children: "Testing the connection to your Builder.io project" })] }), _jsxs("div", { className: "bg-white border rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", children: "Integration Status" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: "API Key:" }), _jsx("code", { className: "bg-gray-100 px-2 py-1 rounded text-sm", children: builder.apiKey })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: "Status:" }), _jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${status === "success"
                                            ? "bg-green-100 text-green-800"
                                            : status === "loading"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : status === "no-content"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-red-100 text-red-800"}`, children: status === "success"
                                            ? "Connected & Content Found"
                                            : status === "loading"
                                                ? "Testing Connection..."
                                                : status === "no-content"
                                                    ? "Connected - No Content"
                                                    : "Connection Error" })] })] })] }), status === "success" && builderContent && (_jsxs("div", { className: "bg-white border rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", children: "Builder.io Content" }), _jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-4", children: _jsx(BuilderComponent, { model: "page", content: builderContent }) })] })), status === "no-content" && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-yellow-800 mb-2", children: "No Content Found" }), _jsx("p", { className: "text-yellow-700 mb-3", children: "The integration is working, but no content was found for the URL '/builder-test'." }), _jsxs("div", { className: "text-sm text-yellow-600", children: [_jsx("p", { className: "font-medium mb-1", children: "Next steps:" }), _jsxs("ol", { className: "list-decimal list-inside space-y-1", children: [_jsx("li", { children: "Go to your Builder.io dashboard" }), _jsx("li", { children: "Create a new page with URL '/builder-test'" }), _jsx("li", { children: "Add some content and publish" }), _jsx("li", { children: "Refresh this page to see the content" })] })] })] })), status === "error" && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-red-800 mb-2", children: "Integration Error" }), _jsx("p", { className: "text-red-700 mb-3", children: "There was an error connecting to Builder.io. Check the console for details." }), _jsxs("div", { className: "text-sm text-red-600", children: [_jsx("p", { className: "font-medium mb-1", children: "Troubleshooting:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Verify the API key is correct" }), _jsx("li", { children: "Check network connectivity" }), _jsx("li", { children: "Ensure the Builder.io project exists" }), _jsx("li", { children: "Check browser console for detailed errors" })] })] })] })), _jsxs("div", { className: "bg-gray-50 border rounded-lg p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", children: "Debug Information" }), _jsx("pre", { className: "bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto", children: `Project ID: ${builder.apiKey}
Builder Environment: ${typeof builder}
Integration Status: ${status}
User Agent: ${navigator.userAgent.substring(0, 50)}...` })] })] }));
};
export default BuilderIntegrationTest;
