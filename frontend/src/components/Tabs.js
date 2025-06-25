import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Tab } from '@headlessui/react';
import { cn } from '../../utils/classNames';
import { motion } from 'framer-motion';
export const Tabs = ({ items, defaultIndex = 0, onChange, variant = 'default', fullWidth = false, className, }) => {
    const variants = {
        default: {
            list: 'flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1',
            tab: 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200',
            selected: 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white',
            disabled: 'opacity-50 cursor-not-allowed',
        },
        pills: {
            list: 'flex space-x-2',
            tab: 'px-4 py-2 text-sm font-medium rounded-full text-gray-500 dark:text-gray-400',
            selected: 'bg-primary-500 text-white',
            disabled: 'opacity-50 cursor-not-allowed',
        },
        underline: {
            list: 'flex space-x-8 border-b border-gray-200 dark:border-gray-700',
            tab: 'py-4 px-1 text-sm font-medium text-gray-500 dark:text-gray-400 border-b-2 border-transparent',
            selected: 'border-primary-500 text-primary-600 dark:text-primary-500',
            disabled: 'opacity-50 cursor-not-allowed',
        },
    };
    return (_jsxs(Tab.Group, { defaultIndex: defaultIndex, onChange: onChange, children: [_jsx(Tab.List, { className: cn(variants[variant].list, fullWidth ? 'w-full' : '', className), children: items.map(item => (_jsx(Tab, { className: ({ selected }) => cn(variants[variant].tab, 'relative flex items-center justify-center gap-2 focus:outline-none transition-all duration-200', selected
                        ? variants[variant].selected
                        : 'hover:text-gray-700 dark:hover:text-gray-200', item.disabled && variants[variant].disabled), disabled: item.disabled, children: ({ selected }) => (_jsxs(_Fragment, { children: [item.icon, item.label, item.badge && (_jsx("span", { className: cn('ml-2 rounded-full px-2 py-0.5 text-xs font-medium', selected
                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'), children: item.badge })), variant === 'underline' && selected && (_jsx(motion.div, { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500", layoutId: "underline" }))] })) }, item.key))) }), _jsx(Tab.Panels, { className: "mt-4", children: items.map(item => (_jsx(Tab.Panel, { className: cn('rounded-xl focus:outline-none', 'ring-white/60 ring-offset-2 ring-offset-primary-400 focus:ring-2'), children: item.content }, item.key))) })] }));
};
