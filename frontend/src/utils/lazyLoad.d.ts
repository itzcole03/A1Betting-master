import React from 'react';
export declare const lazyLoad: (importFunc: () => Promise<{
    default: React.ComponentType<any>;
}>, fallback?: React.ReactNode) => (props: any) => import("react/jsx-runtime").JSX.Element;
