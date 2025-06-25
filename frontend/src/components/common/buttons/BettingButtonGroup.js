import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { twMerge } from 'tailwind-merge';
export const BettingButtonGroup = ({ children, className, orientation = 'horizontal', size = 'md', fullWidth = false, }) => {
    const groupStyles = twMerge('flex', orientation === 'horizontal' ? 'flex-row' : 'flex-col', fullWidth ? 'w-full' : '', size === 'sm' ? 'gap-1' : size === 'md' ? 'gap-2' : 'gap-3', className);
    return (_jsx("div", { className: groupStyles, children: React.Children.map(children, child => {
            if (!React.isValidElement(child))
                return child;
            return React.cloneElement(child, {
                className: twMerge('flex-1', orientation === 'horizontal'
                    ? 'rounded-none first:rounded-l-md last:rounded-r-md'
                    : 'rounded-none first:rounded-t-md last:rounded-b-md', child.props.className),
            });
        }) }));
};
