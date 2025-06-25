import type { AxiosInstance } from "axios";
import { UnifiedServiceRegistry } from "./UnifiedServiceRegistry";
import { UnifiedConfig } from "../unified/UnifiedConfig";
import { UnifiedLogger } from "../unified/UnifiedLogger";
import { UnifiedCache } from "../unified/UnifiedCache";
declare class EventEmitter {
    private events;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, ...args: any[]): void;
}
export interface ServiceError {
    code: string;
    source: string;
    details?: any;
}
export declare abstract class BaseService extends EventEmitter {
    protected readonly name: string;
    protected readonly serviceRegistry: UnifiedServiceRegistry;
    protected config: UnifiedConfig;
    protected logger: UnifiedLogger;
    protected api: AxiosInstance;
    protected cache: UnifiedCache;
    constructor(name: string, serviceRegistry: UnifiedServiceRegistry);
    private setupInterceptors;
    protected handleError(error: any, serviceError: ServiceError): void;
    protected retry<T>(operation: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>;
    protected getCacheKey(...parts: (string | number)[]): string;
    protected withCache<T>(key: string, operation: () => Promise<T>, ttl?: number): Promise<T>;
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    protected handleRequest<T>(request: () => Promise<T>): Promise<T>;
}
export {};
