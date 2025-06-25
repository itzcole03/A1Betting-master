import React from "react";
import GlassCard from "../components/ui/GlassCard";
import CyberButton from "../components/ui/CyberButton";

interface DefaultPageProps {
  title: string;
  description: string;
  icon: string;
}

const CyberDefaultPage: React.FC<DefaultPageProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="text-center">
        <div className="text-6xl mb-6 text-electric-400 float-element">
          <i className={icon} />
        </div>
        <h1 className="holographic text-4xl font-black mb-4">{title}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">{description}</p>
      </div>
      <GlassCard className="text-center py-12">
        <div className="text-gray-500 mb-6">
          Advanced feature interface coming soon...
        </div>
        <CyberButton label="Configure" variant="ghost" />
      </GlassCard>
    </div>
  );
};

export default CyberDefaultPage;
