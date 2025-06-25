import React from 'react';
type InputAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
export interface UnifiedInputProps extends InputAttributes {
    variant?: 'default' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    label?: string;
    error?: string;
    info?: string;
    validation?: {
        required?: boolean;
        pattern?: string;
        min?: number;
        max?: number;
        validateOnBlur?: boolean;
    };
    animate?: boolean;
    onValidationChange?: (isValid: boolean) => void;
}
export declare const UnifiedInput: React.ForwardRefExoticComponent<UnifiedInputProps & React.RefAttributes<HTMLInputElement>>;
export {};
