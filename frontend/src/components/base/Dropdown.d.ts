import React from 'react';
export interface DropdownItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
}
export interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    position?: 'left' | 'right';
    width?: string;
    className?: string;
}
export declare const Dropdown: React.FC<DropdownProps>;
