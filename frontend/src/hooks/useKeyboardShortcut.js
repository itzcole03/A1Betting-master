import { useEffect, useCallback } from 'react';
export const useKeyboardShortcut = (shortcuts, options = {}) => {
    const { enabled = true } = options;
    const handleKeyDown = useCallback((event) => {
        if (!enabled)
            return;
        const shortcutArray = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
        for (const shortcut of shortcutArray) {
            const { key, ctrlKey = false, altKey = false, shiftKey = false, metaKey = false, preventDefault = true, handler } = shortcut;
            const matchesKey = event.key.toLowerCase() === key.toLowerCase();
            const matchesCtrl = event.ctrlKey === ctrlKey;
            const matchesAlt = event.altKey === altKey;
            const matchesShift = event.shiftKey === shiftKey;
            const matchesMeta = event.metaKey === metaKey;
            if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
                if (preventDefault) {
                    event.preventDefault();
                }
                handler(event);
                break;
            }
        }
    }, [enabled, shortcuts]);
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
// Predefined shortcuts for common actions
export const useEscapeKey = (handler, enabled = true) => {
    useKeyboardShortcut({ key: 'Escape', handler }, { enabled });
};
export const useSaveShortcut = (handler, enabled = true) => {
    useKeyboardShortcut({ key: 's', ctrlKey: true, handler }, { enabled });
};
export const useUndoShortcut = (handler, enabled = true) => {
    useKeyboardShortcut({ key: 'z', ctrlKey: true, handler }, { enabled });
};
export const useRedoShortcut = (handler, enabled = true) => {
    useKeyboardShortcut({ key: 'y', ctrlKey: true, handler }, { enabled });
};
