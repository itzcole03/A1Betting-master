import React from 'react';
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
export interface SelectProps {
    options: SelectOption[];
    value?: SelectOption['value'];
    onChange: (value: SelectOption['value']) => void;
    label?: string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    loading?: boolean;
}
export declare const Select: React.FC<SelectProps>;
