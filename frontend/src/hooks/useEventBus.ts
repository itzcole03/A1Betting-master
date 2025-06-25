import { useCallback, useMemo, useState } from 'react';

export interface EventBusEvent {
    id: string;
    type: string;
    data: unknown;
    timestamp: string;
}

export interface EventBusHook {
    emit: (type: string, data?: unknown) => void;
    recentEvents: EventBusEvent[];
    clearEvents: () => void;
}

export const useEventBus = (): EventBusHook => {
    const [events, setEvents] = useState<EventBusEvent[]>([]);

    const emit = useCallback((type: string, data?: unknown) => {
        const event: EventBusEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            data,
            timestamp: new Date().toISOString(),
        };

        setEvents(prev => {
            const newEvents = [event, ...prev.slice(0, 49)]; // Keep last 50 events
            return newEvents;
        });

        // Emit to global event bus if available
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('eventbus', { detail: event }));
        }
    }, []);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    return useMemo(() => ({
        emit,
        recentEvents: events,
        clearEvents,
    }), [emit, events, clearEvents]);
};

export default useEventBus;
