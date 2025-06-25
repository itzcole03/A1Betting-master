// AuditLogger: Centralized audit logging for sensitive actions
// Persistent storage, compliance integration, and rate limiting are tracked in dev/copilot_roadmap.md under audit enhancements.
export class AuditLogger {
    constructor() {
        this.logs = [];
    }
    log(action, details, userId) {
        const entry = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            action,
            details,
            timestamp: Date.now(),
        };
        this.logs.push(entry);
        // See dev/copilot_roadmap.md: persistent storage, compliance, and rate limiting are tracked and prioritized for future implementation.
    }
    getLogs() {
        return this.logs;
    }
}
export const auditLogger = new AuditLogger();
