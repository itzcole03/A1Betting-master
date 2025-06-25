import React from 'react';
interface ClusteringInsightsProps {
    clusters: number[];
    embedding?: number[][];
    metrics: {
        silhouetteScore: number;
        daviesBouldinScore: number;
        calinskiHarabaszScore: number;
    };
    clusterStats: {
        size: number[];
        centroid: number[][];
        variance: number[];
        density: number[];
    };
}
declare const _default: React.NamedExoticComponent<ClusteringInsightsProps>;
export default _default;
