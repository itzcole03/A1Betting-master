import { ReactNode } from 'react';
interface Prop {
    id: string;
    player: string;
    team: string;
    stat: string;
    line: number;
    type: 'goblin' | 'demon' | 'normal';
    percentage: number;
    fireCount: number;
    sentiment?: {
        score: number;
        direction: 'up' | 'down' | 'neutral';
        tooltip?: string;
    };
    espnLink?: string;
}
interface Entry {
    id: string;
    date: string;
    legs: number;
    entry: number;
    potentialPayout: number;
    status: 'won' | 'lost' | 'pending';
    picks: any[];
}
interface MoneyMakerResult {
    legs: number;
    lineup: Prop[];
    winProbability: number;
    payout: number;
}
interface StateContextType {
    props: Prop[];
    entries: Entry[];
    addEntry: (entry: Entry) => void;
    findOptimalLineup: (entryAmount: number) => MoneyMakerResult | null;
}
export declare const StateProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAppState: () => StateContextType;
export {};
