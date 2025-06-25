import React from 'react';
interface TrendingProp {
    id: string;
    playerName: string;
    team: string;
    propType: string;
    value: number;
    direction: 'over' | 'under';
    modifier?: 'goblin' | 'devil';
    confidence: number;
    fireCount: number;
    communityStats: {
        likes: number;
        comments: number;
        shares: number;
    };
    topComment?: {
        user: string;
        avatar?: string;
        text: string;
        likes: number;
    };
}
interface TrendingPropsProps {
    props: TrendingProp[];
    onPropSelect: (propId: string) => void;
}
export declare const TrendingProps: React.FC<TrendingPropsProps>;
export {};
