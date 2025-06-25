export type SportsNewsArticle = {
    id: string;
    title: string;
    summary: string;
    link: string;
    publishedAt: string;
    source: string;
    imageUrl?: string;
    category?: string;
};
export declare function useSportsNews(): {
    articles: SportsNewsArticle[];
    loading: boolean;
    error: string | null;
};
