import React from "react";
import { type VariantProps } from "class-variance-authority";
declare const buttonVariants: (props?: ({
    variant?: "error" | "outline" | "link" | "default" | "success" | "warning" | "ghost" | "premium" | "glass" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
declare const cardVariants: (props?: ({
    variant?: "default" | "premium" | "glass" | "gradient" | "neumorphic" | null | undefined;
    padding?: "default" | "none" | "sm" | "lg" | "xl" | null | undefined;
    rounded?: "default" | "lg" | "xl" | "full" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
}
declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
declare const badgeVariants: (props?: ({
    variant?: "error" | "outline" | "default" | "success" | "warning" | "premium" | "glass" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;
declare const inputVariants: (props?: ({
    variant?: "default" | "premium" | "glass" | "minimal" | null | undefined;
    inputSize?: "default" | "sm" | "lg" | null | undefined;
    rounded?: "default" | "none" | "lg" | "full" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
declare const progressVariants: (props?: ({
    variant?: "default" | "premium" | "glass" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | null | undefined;
    rounded?: "default" | "none" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
declare const progressFillVariants: (props?: ({
    variant?: "error" | "default" | "success" | "warning" | "glass" | null | undefined;
    rounded?: "default" | "none" | "lg" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
    value?: number;
    max?: number;
    fillVariant?: VariantProps<typeof progressFillVariants>["variant"];
}
declare const Progress: React.ForwardRefExoticComponent<ProgressProps & React.RefAttributes<HTMLDivElement>>;
declare const spinnerVariants: (props?: ({
    variant?: "error" | "default" | "success" | "white" | "brand" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
}
declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLDivElement>>;
declare const skeletonVariants: (props?: ({
    variant?: "button" | "text" | "default" | "avatar" | "card" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
}
declare const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<HTMLDivElement>>;
export { Button, buttonVariants, Card, cardVariants, Badge, badgeVariants, Input, inputVariants, Progress, progressVariants, Spinner, spinnerVariants, Skeleton, skeletonVariants, };
export type { ButtonProps, CardProps, BadgeProps, InputProps, ProgressProps, SpinnerProps, SkeletonProps, };
