import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
export const ESPNHeadlinesTicker = () => {
    const [position, setPosition] = useState(0);
    const containerRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const { data: headlines = [] } = useQuery({
        queryKey: ['headlines'],
        queryFn: async () => {
            // TODO: Implement API call to fetch headlines
            return [
                {
                    id: '1',
                    title: 'Breaking: Major trade in the NBA',
                    source: 'ESPN',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'Injury update: Star player expected to return',
                    source: 'ESPN',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: '3',
                    title: 'Game preview: Key matchup tonight',
                    source: 'ESPN',
                    timestamp: new Date().toISOString(),
                },
            ];
        },
    });
    useEffect(() => {
        if (!containerRef.current || !contentRef.current)
            return;
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.offsetWidth;
        const animate = () => {
            setPosition(prev => {
                const newPosition = prev - 1;
                if (newPosition <= -contentWidth) {
                    return containerWidth;
                }
                return newPosition;
            });
        };
        const interval = setInterval(animate, 30);
        return () => clearInterval(interval);
    }, []);
    return (_jsx(Box, { ref: containerRef, sx: {
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            height: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
        }, children: _jsx(Box, { ref: contentRef, sx: {
                position: 'absolute',
                whiteSpace: 'nowrap',
                transform: `translateX(${position}px)`,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            }, children: headlines.map(headline => (_jsxs(Box, { sx: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 4,
                }, children: [_jsx(Typography, { sx: {
                            color: 'text.primary',
                            fontWeight: 'medium',
                        }, variant: "body2", children: headline.title }), _jsxs(Typography, { sx: {
                            color: 'text.secondary',
                            ml: 1,
                        }, variant: "caption", children: ["\u2022 ", headline.source] })] }, headline.id))) }) }));
};
