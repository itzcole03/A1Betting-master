import React from 'react';
export interface TabItem {
    key: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    badge?: string | number;
}
export interface TabsProps {
    items: TabItem[];
    defaultIndex?: number;
    onChange?: (index: number) => void;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    className?: string;
}
export declare const Tabs: React.FC<TabsProps>;
