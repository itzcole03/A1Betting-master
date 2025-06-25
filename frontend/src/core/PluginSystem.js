import { getInitializedUnifiedConfig } from './UnifiedConfig'; // Use the synchronous getter
import { unifiedMonitor } from './UnifiedMonitor';
import { unifiedState } from './UnifiedState';
/**
 * PluginSystem class manages the registration, initialization, and lifecycle of plugins.
 */
class PluginSystemSingleton {
    constructor() {
        this.registeredPlugins = new Map();
        this.initializedPlugins = new Map();
        // The application should ensure UnifiedConfig is initialized before plugins are registered.
        // If getInitializedUnifiedConfig() throws, plugin system construction will fail, which is appropriate.
        this.pluginContext = {
            log: (message, level = 'info') => {
                // Generic log for the context itself, plugin-specific log will be created during plugin init
            },
            getUnifiedConfig: getInitializedUnifiedConfig, // This will throw if config is not ready
            unifiedMonitor,
            unifiedState,
        };
    }
    async registerPlugin(plugin) {
        if (this.registeredPlugins.has(plugin.name)) {
            console.warn(`[PluginSystem] Plugin "${plugin.name}" version ${this.registeredPlugins.get(plugin.name)?.version} is already registered. New registration for version ${plugin.version} skipped.`);
            return;
        }
        this.registeredPlugins.set(plugin.name, plugin);
        try {
            const pluginSpecificContext = {
                ...this.pluginContext,
                // Override the log method to be specific to the plugin being initialized
                log: (message, level = 'info') => {
                }
            };
            if (typeof plugin.initialize !== 'function') {
                throw new Error(`Plugin ${plugin.name} is missing the initialize method or it is not a function.`);
            }
            // Initialize the plugin with its specific context
            await plugin.initialize(pluginSpecificContext);
            this.initializedPlugins.set(plugin.name, plugin);
        }
        catch (error) {
            console.error(`[PluginSystem] Failed to initialize plugin "${plugin.name}":`, error);
            unifiedMonitor.reportError(error, {
                pluginName: plugin.name,
                stage: 'initialization',
                message: error instanceof Error ? error.message : String(error)
            });
            // Optionally remove from registered if initialization fails critically
            // this.registeredPlugins.delete(plugin.name);
        }
    }
    getPlugin(name) {
        return this.initializedPlugins.get(name);
    }
    getPluginApi(pluginName, exportName) {
        const plugin = this.initializedPlugins.get(pluginName);
        if (plugin && plugin.exports && typeof plugin.exports[exportName] !== 'undefined') {
            return plugin.exports[exportName];
        }
        console.warn(`[PluginSystem] Export "${exportName}" not found in plugin "${pluginName}".`);
        return undefined;
    }
    getAllInitializedPlugins() {
        return Array.from(this.initializedPlugins.values());
    }
    async unloadPlugin(name) {
        const plugin = this.initializedPlugins.get(name);
        if (plugin) {
            if (plugin.destroy) {
                try {
                    await plugin.destroy();
                }
                catch (error) {
                    console.error(`[PluginSystem] Error destroying plugin "${name}":`, error);
                    // unifiedMonitor.reportError(error, { pluginName: name, stage: 'destruction' });
                }
            }
            this.initializedPlugins.delete(name);
            this.registeredPlugins.delete(name); // Also remove from registered if fully unloading
        }
        else {
            console.warn(`[PluginSystem] Plugin "${name}" not found or not initialized.`);
        }
    }
    async unloadAllPlugins() {
        for (const name of this.initializedPlugins.keys()) {
            await this.unloadPlugin(name);
        }
    }
}
// Export a singleton instance
export const pluginSystem = new PluginSystemSingleton();
// // Example Plugin:
// const MySamplePlugin: Plugin = {
//   name: 'SampleDataConnector',
//   version: '1.0.0',
//   description: 'Connects to a sample data source.',
//   async initialize(context: PluginContext) {
//     context.log('SampleDataConnector Initializing...');
//     // const config = await context.unifiedConfig.getSetting('sampleDataSourceUrl');
//     // 
//     this.exports.fetchData = async (params: any) => { 
//         context.log(`SampleDataConnector: fetchData called with ${JSON.stringify(params)}`);
//         return { sample: 'data', params }; 
//     };
//   },
//   async destroy() {
//     
//   },
//   exports: { // Define structure of exports here initially if known
//       fetchData: async (params: any): Promise<any> => { throw new Error('Not initialized'); }
//   }
// };
//
// // Registration example (e.g., in main.tsx or a dedicated plugin loader):
// pluginSystem.registerPlugin(MySamplePlugin);
//
// // Usage example:
// async function loadSampleData() {
//   const dataFetcher = pluginSystem.getPluginApi<typeof MySamplePlugin.exports.fetchData>('SampleDataConnector', 'fetchData');
//   if (dataFetcher) {
//     const data = await dataFetcher({ id: 123 });
//     
//   }
// }
// loadSampleData(); 
