export type AuditAction = 'predict' | 'bet' | 'updateUser' | 'login' | 'apiCall';
export interface AuditLogEntry {
    id: string;
    userId?: string;
    action: AuditAction;
    details: Record<string, any>;
    timestamp: number;
}
export declare class AuditLogger {
    private logs;
    log(action: AuditAction, details: Record<string, any>, userId?: string): void;
    getLogs(): AuditLogEntry[];
}
export declare const auditLogger: AuditLogger;
