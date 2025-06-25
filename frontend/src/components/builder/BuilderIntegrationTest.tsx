import React, { useEffect, useState } from "react";
import { builder, BuilderComponent } from "@builder.io/react";

const BuilderIntegrationTest: React.FC = () => {
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
        } else {
          setStatus("no-content");
        }
      } catch (error) {
        console.error("Builder.io integration error:", error);
        setStatus("error");
      }
    };

    testIntegration();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Builder.io Integration Test
        </h1>
        <p className="text-blue-700">
          Testing the connection to your Builder.io project
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Integration Status</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">API Key:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {builder.apiKey}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "loading"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "no-content"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {status === "success"
                ? "Connected & Content Found"
                : status === "loading"
                  ? "Testing Connection..."
                  : status === "no-content"
                    ? "Connected - No Content"
                    : "Connection Error"}
            </span>
          </div>
        </div>
      </div>

      {status === "success" && builderContent && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Builder.io Content</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <BuilderComponent model="page" content={builderContent} />
          </div>
        </div>
      )}

      {status === "no-content" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            No Content Found
          </h2>
          <p className="text-yellow-700 mb-3">
            The integration is working, but no content was found for the URL
            '/builder-test'.
          </p>
          <div className="text-sm text-yellow-600">
            <p className="font-medium mb-1">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Builder.io dashboard</li>
              <li>Create a new page with URL '/builder-test'</li>
              <li>Add some content and publish</li>
              <li>Refresh this page to see the content</li>
            </ol>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Integration Error
          </h2>
          <p className="text-red-700 mb-3">
            There was an error connecting to Builder.io. Check the console for
            details.
          </p>
          <div className="text-sm text-red-600">
            <p className="font-medium mb-1">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify the API key is correct</li>
              <li>Check network connectivity</li>
              <li>Ensure the Builder.io project exists</li>
              <li>Check browser console for detailed errors</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Debug Information</h2>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto">
          {`Project ID: ${builder.apiKey}
Builder Environment: ${typeof builder}
Integration Status: ${status}
User Agent: ${navigator.userAgent.substring(0, 50)}...`}
        </pre>
      </div>
    </div>
  );
};

export default BuilderIntegrationTest;
