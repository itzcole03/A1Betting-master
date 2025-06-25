import { jsx as _jsx } from "react/jsx-runtime";
import React, { Suspense } from 'react';
export const lazyLoad = (importFunc, fallback = null) => {
    const LazyComponent = React.lazy(importFunc);
    return (props) => (_jsx(Suspense, { fallback: fallback, children: _jsx(LazyComponent, { ...props }) }));
};
