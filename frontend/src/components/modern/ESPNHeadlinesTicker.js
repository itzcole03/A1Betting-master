import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
const getSentimentBadge = (sentiment) => {
    // Simple badge: green if positive, red if negative, gray if neutral/undefined
    const avg = sentiment &&
        [sentiment.twitter, sentiment.reddit, sentiment.news]
            .filter(v => typeof v === 'number')
            .reduce((a, b) => a + (b || 0), 0) /
            ([sentiment.twitter, sentiment.reddit, sentiment.news].filter(v => typeof v === 'number')
                .length || 1);
    let color = 'bg-gray-300 text-gray-700';
    let icon = '−';
    if (avg > 0.2) {
        color = 'bg-green-200 text-green-700';
        icon = '▲';
    }
    else if (avg < -0.2) {
        color = 'bg-red-200 text-red-700';
        icon = '▼';
    }
    return (_jsxs("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-bold ${color}`, children: [icon, " ", (avg * 100).toFixed(0), "%"] }));
};
const ESPNHeadlinesTicker = () => {
    const [headlines, setHeadlines] = useState([]);
    const [playerSentiments, setPlayerSentiments] = useState({});
    const [paused, setPaused] = useState(false);
    const tickerRef = useRef(null);
    // WebSocket connection for ESPN feed
    useWebSocket({
        url: 'ws://localhost:3001/espn-feed',
        onMessage: msg => {
            // Assume msg.data is a Headline or array of Headline
            let newHeadlines = [];
            if (Array.isArray(msg.data)) {
                newHeadlines = msg.data;
            }
            else if (msg.data && typeof msg.data === 'object') {
                newHeadlines = [msg.data];
            }
            setHeadlines(prev => {
                // Merge, deduplicate by headline+timestamp
                const all = [...newHeadlines, ...prev];
                const seen = new Set();
                return all.filter(h => {
                    const key = h.headline + h.timestamp;
                    if (seen.has(key))
                        return false;
                    seen.add(key);
                    return true;
                });
            });
        },
    });
    // Fetch sentiment for each related player
    useEffect(() => {
        const fetchSentiment = async (playerId) => {
            try {
                const res = await fetch(`/api/sentiment/${playerId}`);
                if (!res.ok)
                    return;
                const data = await res.json();
                setPlayerSentiments(prev => ({ ...prev, [playerId]: data }));
            }
            catch { }
        };
        const playerIds = headlines.flatMap(h => h.relatedPlayers.map(p => p.id));
        Array.from(new Set(playerIds)).forEach(id => {
            if (!playerSentiments[id])
                fetchSentiment(id);
        });
        // Optionally, poll every 30s for live update
        const interval = setInterval(() => {
            Array.from(new Set(playerIds)).forEach(fetchSentiment);
        }, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [headlines]);
    // Auto-scroll logic
    useEffect(() => {
        if (paused || !tickerRef.current)
            return;
        const ticker = tickerRef.current;
        let frame;
        let start = null;
        const scrollWidth = ticker.scrollWidth;
        const clientWidth = ticker.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        const speed = 40; // px/sec
        function step(ts) {
            if (start === null)
                start = ts;
            const elapsed = ts - start;
            const px = ((elapsed / 1000) * speed) % (maxScroll + 100);
            ticker.scrollLeft = px;
            frame = requestAnimationFrame(step);
        }
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [paused, headlines]);
    if (!headlines.length) {
        return (_jsx("div", { className: "glass rounded-2xl px-4 py-2 text-gray-500 animate-pulse-soft", children: "Loading ESPN headlines..." }));
    }
    return (_jsxs("div", { ref: tickerRef, className: "news-ticker glass rounded-2xl px-4 py-2 overflow-x-auto whitespace-nowrap cursor-pointer relative", style: { transition: 'background 0.2s' }, onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), children: [_jsx("div", { className: "inline-flex items-center gap-8 news-ticker-content", children: headlines.map((h, i) => (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("a", { className: "hover:underline text-blue-700 dark:text-blue-300 font-semibold", href: h.link || '#', rel: "noopener noreferrer", target: "_blank", title: new Date(h.timestamp).toLocaleString(), children: h.headline }), h.relatedPlayers.map(p => (_jsxs("span", { className: "ml-1", children: [_jsx("span", { className: "text-xs text-gray-500", children: p.name }), getSentimentBadge(playerSentiments[p.id] || {})] }, p.id)))] }, h.headline + h.timestamp + i))) }), paused && _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-10 pointer-events-none" })] }));
};
export default React.memo(ESPNHeadlinesTicker);
