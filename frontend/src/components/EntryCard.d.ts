import React from 'react';
import type { Entry } from '@/types';
interface EntryCardProps {
    entry: Entry;
    onClick?: () => void;
}
export declare const EntryCard: React.FC<EntryCardProps>;
export {};
