import { useEffect, useState } from 'react';
import { newsService } from '../services/newsService.js';
export function useSportsNews() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);
        newsService.fetchHeadlines('espn', 10)
            .then((headlines) => {
            // Map ESPNHeadline to SportsNewsArticle if needed
            const mapped = headlines.map(h => ({
                id: h.id,
                title: h.title || h.summary || '',
                summary: h.summary || h.title || '',
                link: h.link,
                publishedAt: h.publishedAt || '',
                source: h.source || 'ESPN',
                imageUrl: h.imageUrl || '',
                category: h.category || '',
            }));
            if (mounted)
                setArticles(mapped);
        })
            .catch(err => { if (mounted)
            setError(err.message); })
            .finally(() => { if (mounted)
            setLoading(false); });
        return () => { mounted = false; };
    }, []);
    return { articles, loading, error };
}
