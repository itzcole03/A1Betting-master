import React from 'react';
export interface SourceHealthBarProps {
    sources: {
        name: string;
        healthy: boolean;
    }[];
}
declare const SourceHealthBar: React.FC<SourceHealthBarProps>;
export default SourceHealthBar;
