import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './EntryTracking.module.css';
import { useAppState } from './StateProvider';
// EntryTracking: Real-time entry tracker for Poe UI
// Usage: <EntryTracking entries={optionalEntries} />
const WS_URL = 'ws://localhost:3001/entries';
const statusColor = (status) => status === 'won'
    ? 'status-won bg-green-500'
    : status === 'lost'
        ? 'status-lost bg-red-500'
        : 'status-pending bg-gray-400';
// Convert incoming WebSocket entry to context Entry type if needed
function toContextEntry(e) {
    if (typeof e === 'object' && e !== null && 'id' in e) {
        const obj = e;
        return {
            id: String(obj.id),
            date: typeof obj.date === 'string' ? obj.date : new Date(obj.timestamp || Date.now()).toISOString().split('T')[0],
            legs: typeof obj.legs === 'number' ? obj.legs : Array.isArray(obj.picks) ? obj.picks.length : 0,
            entry: typeof obj.entry === 'number' ? obj.entry : 0,
            potentialPayout: typeof obj.potentialPayout === 'number' ? obj.potentialPayout : typeof obj.payout === 'number' ? obj.payout : 0,
            status: typeof obj.status === 'string' ? obj.status : 'pending',
            picks: Array.isArray(obj.picks) ? obj.picks : [],
        };
    }
    // fallback
    return {
        id: '',
        date: new Date().toISOString().split('T')[0],
        legs: 0,
        entry: 0,
        potentialPayout: 0,
        status: 'pending',
        picks: [],
    };
}
const EntryTracking = ({ entries: propEntries }) => {
    const { entries: contextEntries, addEntry } = useAppState?.() || {
        entries: [],
        addEntry: undefined,
    };
    const [entries, setEntries] = useState(propEntries || contextEntries || []);
    const [selected, setSelected] = useState(null);
    const wsRef = useRef(null);
    const [wsError, setWsError] = useState(null);
    // WebSocket logic only if not controlled
    useEffect(() => {
        if (propEntries)
            return;
        let ws;
        let reconnectTimer = null;
        function connect() {
            ws = new window.WebSocket(WS_URL);
            wsRef.current = ws;
            ws.onopen = () => setWsError(null);
            ws.onmessage = event => {
                try {
                    const data = JSON.parse(event.data);
                    if (Array.isArray(data)) {
                        // Batch update: only update local state, not context (no batch setter in context)
                        setEntries(data.map(toContextEntry));
                        // TODO: add batch update to context if needed in future
                    }
                    else if (data && typeof data === 'object' && data.id) {
                        setEntries(prev => {
                            const idx = prev.findIndex(e => e.id === data.id);
                            const entry = toContextEntry(data);
                            if (idx >= 0) {
                                const updated = [...prev];
                                updated[idx] = entry;
                                return updated;
                            }
                            // Add to top
                            if (addEntry)
                                addEntry(entry);
                            return [entry, ...prev];
                        });
                    }
                }
                catch (_e) {
                    // Ignore parse errors
                }
            };
            ws.onclose = () => {
                setWsError('Disconnected from entry server. Reconnecting...');
                reconnectTimer = setTimeout(connect, 2000);
            };
            ws.onerror = () => {
                setWsError('WebSocket error. Attempting reconnect...');
                ws.close();
            };
        }
        connect();
        return () => {
            wsRef.current?.close();
            if (reconnectTimer)
                clearTimeout(reconnectTimer);
        };
    }, [propEntries, addEntry]);
    // Sync with context if context changes (for global updates)
    useEffect(() => {
        if (!propEntries && contextEntries && contextEntries.length) {
            setEntries(contextEntries);
        }
    }, [contextEntries, propEntries]);
    // Memoize entry list and modal for performance
    const entryList = useMemo(() => entries.map(entry => (_jsxs("div", { className: `modern-card p-6 hover:shadow-large transition-all entry-card-clickable animate-fade-in`, onClick: () => setSelected(entry.id), children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "font-bold text-xl", children: [entry.legs, "-Leg Entry"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: entry.date })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: `status-badge ${statusColor(entry.status)} animate-fade-in`, children: [entry.status === 'pending' ? '⏳' : entry.status === 'won' ? '✅' : '❌', ' ', entry.status.toUpperCase()] }) })] }), _jsx("div", { className: "space-y-3 mb-6", children: entry.picks.map((pick, i) => {
                    const progress = pick.current / pick.target;
                    const progressClass = pick.result === 'won' ? 'success' : pick.result === 'lost' ? 'danger' : 'pending';
                    return (_jsxs("div", { className: "text-sm p-3 glass rounded-xl animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "font-medium", children: pick.player }), _jsx("span", { className: `text-xs ${pick.result === 'won' ? 'text-green-600' : pick.result === 'lost' ? 'text-red-600' : 'text-gray-500'}`, children: pick.result === 'won' ? '✅' : pick.result === 'lost' ? '❌' : '⏳' })] }), _jsxs("div", { className: "text-xs text-gray-600 dark:text-gray-400 mb-2", children: [pick.stat, " ", pick.line] }), _jsx("div", { className: `${styles['progress-bar']} mb-1`, children: _jsx("div", { className: `${styles['progress-fill']} ${styles[progressClass]} animate-fade-in`, style: { ['--progress-width']: `${Math.min(progress * 100, 100)}%` } }) }), _jsxs("div", { className: "text-xs text-gray-500", children: [pick.current, " / ", pick.target] })] }, i));
                }) }), _jsxs("div", { className: "flex justify-between items-center pt-4 border-t", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: "Payout" }), _jsxs("div", { className: "font-bold text-lg", children: ["$", entry.potentialPayout.toFixed(2)] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 font-medium", children: "Legs" }), _jsx("div", { className: "font-bold text-lg text-blue-600", children: entry.legs })] })] })] }, entry.id))), [entries]);
    const selectedEntry = useMemo(() => entries.find(e => e.id === selected), [entries, selected]);
    return (_jsxs("div", { className: "modern-card p-6 lg:p-8 animate-fade-in", children: [_jsx("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("h2", { className: "text-2xl lg:text-3xl font-bold", children: "\uD83D\uDCCB Active Entries" }), _jsxs("span", { className: "status-badge bg-primary-500 text-white", children: [entries.filter(e => e.status === 'pending').length, " Active"] })] }) }), wsError && _jsx("div", { className: "text-red-500 text-center mb-4 animate-fade-in", children: wsError }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8", children: entryList }), selectedEntry && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in", children: _jsxs("div", { className: "modern-card max-w-4xl w-full p-8 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-start mb-8", children: [_jsx("h3", { className: "text-2xl font-bold", children: "\uD83D\uDCCA Entry Progress" }), _jsx("button", { className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl", onClick: () => setSelected(null), children: "\u00D7" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h4", { className: "text-xl font-bold", children: [selectedEntry.legs, "-Leg Entry - ", selectedEntry.date] }), _jsx("span", { className: `status-badge ${statusColor(selectedEntry.status)} animate-fade-in`, children: selectedEntry.status.toUpperCase() })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-center", children: [_jsxs("div", { className: "glass rounded-xl p-4", children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", selectedEntry.potentialPayout.toFixed(2)] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Potential Payout" })] }), _jsxs("div", { className: "glass rounded-xl p-4", children: [_jsx("div", { className: `text-2xl font-bold ${selectedEntry.status === 'won' ? 'text-green-600' : selectedEntry.status === 'lost' ? 'text-red-600' : 'text-blue-600'}`, children: selectedEntry.status === 'lost'
                                                        ? '0.00'
                                                        : selectedEntry.potentialPayout.toFixed(2) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Status" })] }), _jsxs("div", { className: "glass rounded-xl p-4", children: [_jsxs("div", { className: "text-2xl font-bold", children: [selectedEntry.picks.filter(p => p.result === 'won').length, "/", selectedEntry.picks.length] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Hits" })] })] })] }), _jsx("div", { className: "space-y-4", children: selectedEntry.picks.map((pick, i) => {
                                const progress = pick.current / pick.target;
                                const progressClass = pick.result === 'won' ? 'success' : pick.result === 'lost' ? 'danger' : 'pending';
                                return (_jsxs("div", { className: "modern-card p-4 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-bold", children: pick.player }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [pick.stat, " ", pick.line] })] }), _jsx("div", { className: "text-right", children: _jsx("span", { className: `text-xs ${pick.result === 'won' ? 'text-green-600' : pick.result === 'lost' ? 'text-red-600' : 'text-gray-500'}`, children: pick.result === 'won' ? '✅' : pick.result === 'lost' ? '❌' : '⏳' }) })] }), _jsxs("div", { className: "mb-2", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsxs("span", { children: ["Progress: ", pick.current, " / ", pick.target] }), _jsxs("span", { children: [(progress * 100).toFixed(0), "%"] })] }), _jsx("div", { className: styles['progress-bar'], children: _jsx("div", { className: `${styles['progress-fill']} ${styles[progressClass]} animate-fade-in`, style: { ['--progress-width']: `${Math.min(progress * 100, 100)}%` } }) })] }), _jsxs("div", { className: "text-xs text-gray-500", children: [pick.result === 'pending' ? 'Live' : 'Final', ": ", pick.current, ' ', pick.stat.toLowerCase()] })] }, i));
                            }) })] }) }))] }));
};
export default EntryTracking;
