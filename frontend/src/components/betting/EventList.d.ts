import React from 'react';
import { Event } from '../../types/betting';
interface EventListProps {
    events: Event[];
    isLoading: boolean;
    selectedSport: Sport | null;
}
declare const _default: React.NamedExoticComponent<EventListProps>;
export default _default;
