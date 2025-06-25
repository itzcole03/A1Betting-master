import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
export const ThemeProvider = ({ children }) => {
    const theme = useStore(s => s.theme);
    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        }
        else {
            html.classList.remove('dark');
        }
    }, [theme]);
    return _jsx(_Fragment, { children: children });
};
