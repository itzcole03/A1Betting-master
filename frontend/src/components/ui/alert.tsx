import React from 'react';

export interface AlertProps {
    children: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'default',
    className = ''
}) => {
    const variantClasses = {
        default: 'bg-blue-50 border-blue-200 text-blue-800',
        destructive: 'bg-red-50 border-red-200 text-red-800',
        outline: 'border border-gray-200 bg-white',
        secondary: 'bg-gray-50 border-gray-200 text-gray-800'
    };

    return (
        <div className={`rounded-lg border p-4 ${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );
};

export interface AlertDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`text-sm ${className}`}>
            {children}
        </div>
    );
};

export interface AlertTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
    children,
    className = ''
}) => {
    return (
        <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
            {children}
        </h5>
    );
};

export default Alert;
