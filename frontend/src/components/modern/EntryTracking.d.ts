import React from 'react';
type Entry = {
    id: string;
    date: string;
    legs: number;
    entry: number;
    potentialPayout: number;
    status: 'won' | 'lost' | 'pending';
    picks: Array<{
        player: string;
        stat: string;
        line: string;
        result: 'won' | 'lost' | 'pending';
        current: number;
        target: number;
    }>;
};
declare const EntryTracking: React.FC<{
    entries?: Entry[];
}>;
export default EntryTracking;
