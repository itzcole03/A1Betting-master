import { DailyFantasyProjection } from '@/types';
/**
 * Fetches daily fantasy projections from the backend.
 * The backend /api/data-scraping/daily-fantasy-projections endpoint is currently mocked.
 * Expected backend response is an array of BackendDFPResponseItem (defined in this file).
 * Example Item:
 * {
 *   "player_id": "string",
 *   "player_name": "string",
 *   "team": "string",
 *   "position": "string",
 *   "projection": number,
 *   "salary": number (optional),
 *   "source": "string",
 *   "game_date": "YYYY-MM-DD",
 *   "league": "string"
 * }
 */
export declare const fetchDailyFantasyProjections: (date: string, league?: string) => Promise<DailyFantasyProjection[]>;
/**
 * Triggers a data scraping job on the backend.
 * The backend /api/data-scraping/trigger-job endpoint is currently mocked.
 * Expected backend response is BackendScrapingJobStatus (defined in this file).
 * Example Response:
 * {
 *   "job_id": "string",
 *   "status": "string (e.g., pending, running, completed, failed)",
 *   "message": "string (optional)",
 *   "created_at": "ISO_datetime_string",
 *   "updated_at": "ISO_datetime_string (optional)",
 *   "result_summary": { ... } (optional)
 * }
 */
export declare const triggerScrapingJob: (job_type: string, league?: string, target_date?: string) => Promise<{
    jobId: string;
    status: string;
    message?: string;
}>;
export declare const dataScrapingService: {
    fetchDailyFantasyProjections: (date: string, league?: string) => Promise<DailyFantasyProjection[]>;
    triggerScrapingJob: (job_type: string, league?: string, target_date?: string) => Promise<{
        jobId: string;
        status: string;
        message?: string;
    }>;
};
