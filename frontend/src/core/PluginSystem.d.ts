import { UnifiedConfig } from './UnifiedConfig';
import { unifiedMonitor } from './UnifiedMonitor';
import { unifiedState } from './UnifiedState';
/**
 * Defines the structure for a plugin.
 * Each plugin should have a unique name, version, and methods for initialization and potentially teardown.
 */
export interface Plugin {
    name: string;
    version: string;
    description?: string;
    /**
     * Called when the plugin is loaded and registered.
     * @param context Provides access to core app services or context if needed.
     */
    initialize: (context: PluginContext) => Promise<void> | void;
    /**
     * Optional: Called when the plugin is unloaded or the system is shutting down.
     */
    destroy?: () => Promise<void> | void;
    /**
     * Optional: Expose specific functionalities of the plugin.
     * The structure of `exports` is up to the plugin itself.
     */
    exports?: Record<string, any>;
}
/**
 * Provides context to plugins during initialization, such as access to core services
 * or the main application store.
 */
export interface PluginContext {
    log: (message: string, level?: 'info' | 'warn' | 'error') => void;
    getUnifiedConfig: () => UnifiedConfig;
    unifiedMonitor: typeof unifiedMonitor;
    unifiedState: typeof unifiedState;
    [key: string]: any;
}
/**
 * PluginSystem class manages the registration, initialization, and lifecycle of plugins.
 */
declare class PluginSystemSingleton {
    private registeredPlugins;
    private initializedPlugins;
    private pluginContext;
    constructor();
    registerPlugin(plugin: Plugin): Promise<void>;
    getPlugin(name: string): Plugin | undefined;
    getPluginApi<T = any>(pluginName: string, exportName: string): T | undefined;
    getAllInitializedPlugins(): Plugin[];
    unloadPlugin(name: string): Promise<void>;
    unloadAllPlugins(): Promise<void>;
}
export declare const pluginSystem: PluginSystemSingleton;
export {};
