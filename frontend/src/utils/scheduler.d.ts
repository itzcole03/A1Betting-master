type Job = () => Promise<void> | void;
declare class Scheduler {
    private jobs;
    schedule(id: string, job: Job, interval: number): void;
    cancel(id: string): void;
    cancelAll(): void;
    isScheduled(id: string): boolean;
}
export declare const scheduler: Scheduler;
export {};
