import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { builder, BuilderComponent } from '@builder.io/react';
// A simple test component to debug Builder.io integration
const BuilderTest = () => {
    const [builderContentJson, setBuilderContentJson] = useState(null);
    const [debugStatus, setDebugStatus] = useState({
        apiKey: builder.apiKey,
        isEditing: builder.isEditing,
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    });
    useEffect(() => {
        // Output debug info to console
        console.log('[Builder.io DEBUG] Initializing with API key:', builder.apiKey);
        console.log('[Builder.io DEBUG] User attributes:', builder.getUserAttributes());
        console.log('[Builder.io DEBUG] Environment:', builder);
        // Fetch test content
        async function fetchBuilderContent() {
            try {
                const content = await builder.get('page')
                    .promise();
                console.log('[Builder.io DEBUG] Content result:', content);
                setBuilderContentJson(content);
            }
            catch (error) {
                console.error('[Builder.io DEBUG] Error fetching content:', error);
            }
        }
        fetchBuilderContent();
        // Create global debug helper
        window.BUILDER_DEBUG = {
            forcePreview: () => {
                builder.setUserAttributes({ ...builder.getUserAttributes(), preview: true });
                console.log('[Builder.io DEBUG] Preview mode forced');
                return 'Preview mode enabled';
            },
            disableTracking: () => {
                // @ts-ignore
                builder.canTrack = false;
                console.log('[Builder.io DEBUG] Tracking disabled');
                return 'Tracking disabled';
            },
            getRegistry: () => {
                console.log('[Builder.io DEBUG] Component registry:', builder.registry);
                return builder.registry;
            },
            dumpStatus: () => {
                const status = {
                    apiKey: builder.apiKey,
                    isEditing: builder.isEditing,
                    components: Object.keys(builder.registry).length,
                    userAttributes: builder.getUserAttributes()
                };
                console.log('[Builder.io DEBUG] Current status:', status);
                return status;
            }
        };
    }, []);
    return (_jsxs("div", { className: "p-8 max-w-4xl mx-auto", children: [_jsxs("div", { className: "bg-blue-50 p-4 mb-6 rounded-lg", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Builder.io Debug Page" }), _jsx("p", { className: "text-gray-600 mb-4", children: "This page helps debug Builder.io integration issues" }), _jsxs("div", { className: "bg-white p-4 rounded shadow mb-4", children: [_jsx("h2", { className: "font-medium mb-2", children: "Debug Status" }), _jsx("pre", { className: "bg-gray-100 p-3 rounded text-xs overflow-auto", children: JSON.stringify(debugStatus, null, 2) })] }), _jsxs("div", { className: "bg-white p-4 rounded shadow mb-4", children: [_jsx("h2", { className: "font-medium mb-2", children: "Debug Commands" }), _jsxs("ul", { className: "list-disc pl-5 space-y-1 text-sm", children: [_jsxs("li", { children: [_jsx("code", { children: "BUILDER_DEBUG.forcePreview()" }), " - Force preview mode"] }), _jsxs("li", { children: [_jsx("code", { children: "BUILDER_DEBUG.disableTracking()" }), " - Disable tracking features"] }), _jsxs("li", { children: [_jsx("code", { children: "BUILDER_DEBUG.getRegistry()" }), " - Show all registered components"] }), _jsxs("li", { children: [_jsx("code", { children: "BUILDER_DEBUG.dumpStatus()" }), " - Output current Builder.io status"] })] })] })] }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 p-6 rounded-lg", children: [_jsx("h2", { className: "font-bold mb-4", children: "Builder.io Content Area:" }), _jsx(BuilderComponent, { model: "page", content: builderContentJson })] })] }));
};
export default BuilderTest;
