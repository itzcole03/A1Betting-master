import React from 'react';
interface Prop {
    id: string;
    title: string;
    description: string;
    odds: number;
    category: string;
    confidence: number;
    prediction: string;
}
interface PropCardsProps {
    data: Prop[];
    isLoading: boolean;
}
export declare const PropCards: React.FC<PropCardsProps>;
declare const _default: React.NamedExoticComponent<PropCardsProps>;
export default _default;
