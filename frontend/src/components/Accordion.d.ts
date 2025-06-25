import React from 'react';
export interface AccordionItem {
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
}
export interface AccordionProps {
    items: AccordionItem[];
    variant?: 'default' | 'bordered' | 'separated';
    defaultOpen?: number[];
    allowMultiple?: boolean;
    className?: string;
}
export declare const Accordion: React.FC<AccordionProps>;
