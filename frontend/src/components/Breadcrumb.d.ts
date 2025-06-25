import React from 'react';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    className?: string;
    maxItems?: number;
    itemClassName?: string;
    separatorClassName?: string;
}
export declare const Breadcrumb: React.FC<BreadcrumbProps>;
