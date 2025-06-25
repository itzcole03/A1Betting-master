import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
    size?: "small" | "medium" | "large";
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
}
export declare const Button: React.FC<ButtonProps>;
interface CardProps {
    children: React.ReactNode;
    className?: string;
}
export declare const Card: React.FC<CardProps>;
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    type?: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    helperText?: string;
    required?: boolean;
}
export declare const Input: React.FC<InputProps>;
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
    error?: string;
    disabled?: boolean;
}
export declare const Select: React.FC<SelectProps>;
export declare const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}>;
interface ToastProps {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    onClose: () => void;
    duration?: number;
}
export declare const Toast: React.FC<ToastProps & {
    index?: number;
}>;
interface SpinnerProps {
    size?: "small" | "medium" | "large";
    className?: string;
}
export declare const Spinner: React.FC<SpinnerProps>;
interface BadgeProps {
    children: React.ReactNode;
    variant?: "success" | "warning" | "danger" | "info";
    className?: string;
}
export declare const Badge: React.FC<BadgeProps>;
interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    label?: string;
    className?: string;
}
export declare const Slider: React.FC<SliderProps>;
interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
}
export declare const Progress: React.FC<ProgressProps>;
interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}
export declare const Tabs: React.FC<TabsProps>;
interface TabProps {
    value: string;
    label: string;
    className?: string;
    onClick?: (value: string) => void;
}
export declare const Tab: React.FC<TabProps>;
interface IconProps {
    name: string;
    className?: string;
}
export declare const Icon: React.FC<IconProps>;
interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
}
export declare const Tooltip: React.FC<TooltipProps>;
export {};
