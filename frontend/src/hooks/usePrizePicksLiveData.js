import { webSocketManager } from '@/services/unified/WebSocketManager';
import { useEffect, useState } from 'react';
export function usePrizePicksLiveData() {
    const [livePrizePicksData, setLivePrizePicksData] = useState([]);
    useEffect(() => {
        const handler = (prop) => {
            setLivePrizePicksData(prev => {
                // Replace if id exists, else add
                const idx = prev.findIndex(p => p.id === prop.id);
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = prop;
                    return updated;
                }
                return [prop, ...prev];
            });
        };
        webSocketManager.on('prizepicks:prop', handler);
        return () => {
            webSocketManager.off('prizepicks:prop', handler);
        };
    }, []);
    return livePrizePicksData;
}
