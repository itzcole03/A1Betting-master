import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '@/stores/themeStore';
import { motion } from 'framer-motion';
const MotionIconButton = motion.create(IconButton);
const ThemeToggle = () => {
    const theme = useTheme();
    const { toggleTheme } = useThemeStore();
    return (_jsx(MotionIconButton, { "aria-label": "toggle theme", color: "primary", sx: {
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'rotate(15deg)',
            },
        }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: toggleTheme, children: theme.palette.mode === 'dark' ? (_jsx(motion.div, { animate: { rotate: 360 }, initial: { rotate: 0 }, transition: { duration: 0.5 }, children: _jsx(Brightness7, {}) })) : (_jsx(motion.div, { animate: { rotate: 360 }, initial: { rotate: 0 }, transition: { duration: 0.5 }, children: _jsx(Brightness4, {}) })) }));
};
export default ThemeToggle;
