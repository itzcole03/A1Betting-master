import React from "react";

interface BuilderPageProps {
  model?: string;
  content?: unknown;
  url?: string;
}

const BuilderPage: React.FC<BuilderPageProps> = ({
  model = "page",
  content,
  url,
}) => {
  // Builder.io completely removed - redirect to main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Elite Sports Intelligence Platform
        </h1>
        <p className="text-gray-400 mb-6">
          Builder.io integration has been disabled
        </p>
        <p className="text-cyan-400">Redirecting to native Elite platform...</p>
      </div>
    </div>
  );
};

export default BuilderPage;
