export declare const useDataFetching: () => {
    props: unknown;
    stats: unknown;
    performance: unknown;
    headlines: unknown;
    isLoadingProps: false;
    isLoadingStats: false;
    isLoadingPerformance: false;
    isLoadingHeadlines: false;
    placeBet: import("@tanstack/react-query").UseMutateFunction<any, Error, Omit<Bet, "id" | "createdAt" | "updatedAt">, unknown>;
    isPlacingBet: boolean;
};
